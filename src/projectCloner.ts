import { ApolloQueryResult } from '@apollo/client';
import { GitHubAPI } from './api/github.js';
import type { ProjectMetadata } from './api/projectMetadata.js';
import { ProjectIssuesQuery, ProjectV2ItemFieldTextValue, ProjectV2ItemFieldNumberValue, ProjectV2ItemFieldDateValue, ProjectV2ItemFieldSingleSelectValue, ProjectV2ItemFieldIterationValue, IssueClosedStateReason, IssueStateReason, IssueState } from './generated/gql/graphql.js';

export class ProjectCloner {
  private template_owner: string;
  private template_repo: string;
  private template_project_number: number;
  private owner: string;
  private repo: string;
  private project: string;
  private github: GitHubAPI;

  constructor(token: string, template_owner: string, template_repo: string, template_project_number: number, owner: string, repo: string, project: string) {
    this.template_owner = template_owner;
    this.template_repo = template_repo;
    this.template_project_number = template_project_number;
    this.owner = owner;
    this.repo = repo;
    this.project = project;
    this.github = new GitHubAPI(token);

  }

  async clone() : Promise<ProjectMetadata>{
    const orgId = await this.github.getOrgId(this.template_owner);
    const templateRepo = await this.github.getRepoTemplate(this.template_owner, this.template_repo);
    
    console.log(`Org id is ${orgId}, template repo id is ${templateRepo.id}`);

    // Create a new repository from the template template_owner/template_repo
    const clonedRepoId = await this.github.cloneRepoTemplate(templateRepo.id, orgId, this.repo, templateRepo.description);

    if (!clonedRepoId) {
      throw new Error(`Failed to create the new repository ${this.repo} from template ${this.template_repo}`);
    }

    console.log(`Cloned repository id is ${clonedRepoId}`)

    // Getting the project template allong with all its linked issues
    return this.github.getProjectIssues(this.owner, this.template_project_number).then((project: ApolloQueryResult<ProjectIssuesQuery> | undefined) => {
      const projectId = project?.data?.organization?.projectV2?.id;
      
      if (!projectId) {
        throw new Error(`Failed to retrieve project ${this.template_project_number} from organization ${this.template_owner}`);
      }

      console.log(`Template project id is ${projectId}`)
    
      // Creat a ne project from the template template_project in the org template_owner
      return this.github.cloneProjectTemplate(orgId, projectId, this.project).then((clonedProjectMetadata) => {
        if (!clonedProjectMetadata) {
          throw new Error(`Failed to clone project ${this.template_project_number} within organization ${this.template_owner}`);
        }

        console.log(`Cloned project id is ${clonedProjectMetadata.id}, number is ${clonedProjectMetadata.number}`)
        
        return this.getProjectFieldDefinition(clonedProjectMetadata, clonedRepoId, project).then((fieldIdMap) => {
          return this.cloneIssues(clonedRepoId, clonedProjectMetadata, fieldIdMap, project).then(() => {
            return clonedProjectMetadata;
          });
        });
      });
    });
  }

  // Getting the field IDs for the new project so we can set their values withing the new issues
  private async getProjectFieldDefinition(clonedProjectMetadata: ProjectMetadata, clonedRepoId: string, project: ApolloQueryResult<ProjectIssuesQuery>) : Promise<Map<string, string>> {
    return this.github.getProjectFieldDefinition(this.owner, clonedProjectMetadata.number).then((projectFieldDefinition) => {
      if (!projectFieldDefinition) {
        throw new Error(`Failed to retrieve project field definition for project ${clonedProjectMetadata.number} from organization ${this.owner}`);
      }

      const fieldIdMap = new Map<string, string>();
      const standardProjectFields = ['Title', 'Assignees', 'Labels', 'Linked pull requests', 
        'Tracks', 'Reviewers', 'Repository', 'Milestone', 'Tracked by'];

    
      for (const field of projectFieldDefinition?.data?.organization?.projectV2?.fields?.nodes || []) {
        // We do not want the non-project specific fields (like title, assignee...)
        if (!standardProjectFields.includes(field?.name ?? '')) {
          console.log(`Using field ${field?.name}`);
          fieldIdMap.set(field?.name ?? '', field?.id ?? '');
        } else {
          console.log(`Skipping field ${field?.name}`);
        }
      }

      return fieldIdMap;
    });
  }

  async cloneIssues(clonedRepoId: string, clonedProjectMetadata: ProjectMetadata, fieldIdMap: Map<string, string>, project: ApolloQueryResult<ProjectIssuesQuery>) {
    for(const issue of project?.data?.organization?.projectV2?.items?.nodes || []) {
      let body = issue?.content?.body ?? '';
      let title = issue?.content?.title ?? '';
      
      // Duplicate the issue in the target repository
      const issueId = await this.github.createIssue(clonedRepoId, title, body);
      if(!issueId) {
        throw new Error(`Failed to create issue ${title} within repository ${this.repo}`);
      }

      // Check if the current type is an issue
      if (issue?.content && 'state' in issue?.content) {
        if (issue.content.state === IssueState.Closed) {
          // Close the issue
          let reason : IssueClosedStateReason
          if (issue.content.stateReason === IssueStateReason.NotPlanned) {
            reason = IssueClosedStateReason.NotPlanned;
          } else {
            reason = IssueClosedStateReason.Completed;
          }
          this.github.closeIssue(issueId, reason);
        }
      }

      console.log(`Cloned issue "${title}"`)

      // Add the issue to the project
      const projectItemId = await this.github.addIssueToProject(clonedProjectMetadata.id, issueId);
      if (!projectItemId) {
        throw new Error(`Failed to add issue ${issueId} to project ${clonedProjectMetadata.id}`);
      }

      console.log(`Added issue ${title} to project ${clonedProjectMetadata.number}`)
      
      // Going over the fields within the original project item (aka the issue within the project) to copy them to the new issue
      for(const fieldValue of issue?.fieldValues?.nodes || []) {
        switch(fieldValue?.__typename) {
          case 'ProjectV2ItemFieldTextValue':
            const textField = fieldValue as ProjectV2ItemFieldTextValue;
            
            if (fieldValue.text) {
              const fieldId = fieldIdMap.get(textField.field.name);
              if (fieldId) {
                this.github.setProjectTextFieldValue(clonedProjectMetadata.id, projectItemId, fieldId, fieldValue.text).then(() => {
                  // Code inside the promise callback
                });
              }
            }
            break;
          
          case 'ProjectV2ItemFieldNumberValue':
            const numField = fieldValue as ProjectV2ItemFieldNumberValue;
            
            if (fieldValue.number) {
              const fieldId = fieldIdMap.get(numField.field.name);
              if (fieldId) {
                this.github.setProjectNumberFieldValue(clonedProjectMetadata.id, projectItemId, fieldId, fieldValue.number).then(() => {
                  // Code inside the promise callback
                });
              } 
            } 
            break;
          
          case 'ProjectV2ItemFieldDateValue':
            const dateField = fieldValue as ProjectV2ItemFieldDateValue;
            
            if (fieldValue.date) {
              const fieldId = fieldIdMap.get(dateField.field.name);
              if (fieldId) {
                this.github.setProjectDateFieldValue(clonedProjectMetadata.id, projectItemId, fieldId, fieldValue.date).then(() => {
                  // Code inside the promise callback
                });
              } 
            } 
            break;
          
          case 'ProjectV2ItemFieldSingleSelectValue':
            const singleSelectField = fieldValue as ProjectV2ItemFieldSingleSelectValue;
            
            if (fieldValue.optionId) {
              const fieldId = fieldIdMap.get(singleSelectField.field.name);
              if (fieldId) {
                this.github.setProjectSingleSelectFieldValue(clonedProjectMetadata.id, projectItemId, fieldId, fieldValue.optionId).then(() => {
                  // Code inside the promise callback
                });
              } 
            } 
            break;
          
          case 'ProjectV2ItemFieldIterationValue':
            const iterationField = fieldValue as ProjectV2ItemFieldIterationValue;
            
            if (fieldValue.iterationId) {
              const fieldId = fieldIdMap.get(iterationField.field.name);
              if (fieldId) {
                this.github.setProjectIterationFieldValue(clonedProjectMetadata.id, projectItemId, fieldId, fieldValue.iterationId).then(() => {
                  // Code inside the promise callback
                });
              } 
            } 
            break;
        }
      }
    }
    
    // Are there more issues to retrieve?
    if(project?.data?.organization?.projectV2?.items.pageInfo?.hasNextPage) {
      // Wait for 30 seconds to avoid hitting the rate limit
      await new Promise(resolve => setTimeout(resolve, 15000));

      const issueCursor = project.data.organization.projectV2.items.pageInfo.endCursor;
      if (!issueCursor) {
        throw new Error(`Failed to retrieve next batch of issues from project ${this.template_project_number} within organization ${this.owner}. No cursor was returned`);
      }
  
      this.github.getProjectIssues(this.owner, this.template_project_number, issueCursor).then((project) => {
        if(!project) {
          throw new Error(`Failed to retrieve issues from project ${this.template_project_number} within organization ${this.owner}`);
        }
        this.cloneIssues(clonedRepoId, clonedProjectMetadata, fieldIdMap, project)
      });
    }
  }
}

