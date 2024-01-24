import { ProjectIssuesQuery, ProjectIssuesQueryVariables, ProjectIssues, CloneProjectTemplate, CloneProjectTemplateMutation, CloneProjectTemplateMutationVariables, CloneRepoTemplate, CloneRepoTemplateMutation, CloneRepoTemplateMutationVariables, OrgId, OrgIdQuery, OrgIdQueryVariables, RepoTemplateQuery, RepoTemplateQueryVariables, RepositoryVisibility, RepoTemplate, CreateIssue, CreateIssueMutationVariables, CreateIssueMutation, AddIssueToProjectMutation, AddIssueToProjectMutationVariables, AddIssueToProject, SetProjectTextFieldValue, SetProjectTextFieldValueMutation, SetProjectTextFieldValueMutationVariables, SetProjectNumberFieldValue, SetProjectNumberFieldValueMutation, SetProjectNumberFieldValueMutationVariables, ProjectFieldDefinition, ProjectFieldDefinitionQuery, ProjectFieldDefinitionQueryVariables, SetProjectDateFieldValueMutation, SetProjectDateFieldValue, SetProjectDateFieldValueMutationVariables, SetProjectSingleSelectFieldValue, SetProjectSingleSelectFieldValueMutation, SetProjectSingleSelectFieldValueMutationVariables, SetProjectIterationFieldValue, SetProjectIterationFieldValueMutation, SetProjectIterationFieldValueMutationVariables } from './../generated/graphql';
import { Octokit } from "@octokit/rest";
import { GitHubClient } from "../client";
import { ApolloQueryResult } from "@apollo/client";
import { ProjectMetadata } from './projectMetadata';


export class GitHubAPI {
  private octokit: Octokit;

  constructor(token: string) {
    this.octokit = new Octokit({ auth: token });
  }

  // Keeping that for reference in case we need to use the REST API
  async getRepo(owner: string, repo: string) {
    const response = await this.octokit.repos.get({ owner, repo });
    return response.data;
  }

  async getOrgId(owner: string) : Promise<string | undefined> {
    const variables = {
      'org': owner
    }

    return GitHubClient().query<OrgIdQuery, OrgIdQueryVariables>({
      query: OrgId, 
      variables: variables
    }).then((result) => {
      return result.data.organization?.id;
    });
  }

  async getRepoTemplate(owner: string, repo: string) : Promise<ApolloQueryResult<RepoTemplateQuery> | undefined> {
    const variables = {
      'org': owner,
      'repo': repo
    }

    return GitHubClient().query<RepoTemplateQuery, RepoTemplateQueryVariables>({
      query: RepoTemplate, 
      variables: variables
    })
  }

  async cloneRepoTemplate(templateRepoId: string, ownerId: string, repo: string, description?: string) : Promise<string | undefined> {
    if (!description) {
      description = '';
    }
    const variables = {
      'includeAllBranches': true,
      'repo': repo,
      'ownerId': ownerId,
      'repoId': templateRepoId,
      'description': description,
      'visibility': RepositoryVisibility.Private
    }

    return GitHubClient().mutate<CloneRepoTemplateMutation, CloneRepoTemplateMutationVariables>({
      mutation: CloneRepoTemplate, 
      variables: variables
    }).then((result) => {
      return result.data?.cloneTemplateRepository?.repository?.id;
    });
  }

  async cloneProjectTemplate(ownerId: string, projectId: string, title: string) : Promise<ProjectMetadata  | undefined> {
    const variables = {
      'includeDraftIssues': true,
		  'title': title,
		  'projectId': projectId,
		  'ownerId': ownerId
    }

    return GitHubClient().mutate<CloneProjectTemplateMutation, CloneProjectTemplateMutationVariables>({
      mutation: CloneProjectTemplate, 
      variables: variables
    }).then((result) => {
      if(result.data?.copyProjectV2?.projectV2?.id && result.data?.copyProjectV2?.projectV2?.number) {
        return new ProjectMetadata(result.data.copyProjectV2.projectV2.id, 
          result.data.copyProjectV2.projectV2.number);
      }
    });
  }

  async createIssue(repositoryId: string, title: string, body: string) : Promise<string | undefined>  {
    const variables = {
      'repositoryId': repositoryId,
		  'title': title,
		  'body': body
    }

    return GitHubClient().mutate<CreateIssueMutation, CreateIssueMutationVariables>({
      mutation: CreateIssue, 
      variables: variables
    }).then((result) => {
      return result.data?.createIssue?.issue?.id;
    });
  }

  async addIssueToProject(projectId: string, issueId: string) : Promise<string | undefined>  {
    const variables = {
      'projectId': projectId,
		  'issueId': issueId
    }

    return GitHubClient().mutate<AddIssueToProjectMutation, AddIssueToProjectMutationVariables>({
      mutation: AddIssueToProject, 
      variables: variables
    }).then((result) => {
      return result.data?.addProjectV2ItemById?.item?.id;
    });
  }

  async setProjectTextFieldValue(projectId: string, itemId: string, fieldId: string, text: string) : Promise<string | undefined>  {
    const variables = {
      'projectId': projectId,
		  'itemId': itemId,
      'fieldId': fieldId,
      'text': text
    }

    return GitHubClient().mutate<SetProjectTextFieldValueMutation, SetProjectTextFieldValueMutationVariables>({
      mutation: SetProjectTextFieldValue, 
      variables: variables
    }).then((result) => {
      return result.data?.updateProjectV2ItemFieldValue?.projectV2Item?.id
    });
  }

  async setProjectNumberFieldValue(projectId: string, itemId: string, fieldId: string, num: number) : Promise<string | undefined>  {
    const variables = {
      'projectId': projectId,
		  'itemId': itemId,
      'fieldId': fieldId,
      'num': num
    }

    return GitHubClient().mutate<SetProjectNumberFieldValueMutation, SetProjectNumberFieldValueMutationVariables>({
      mutation: SetProjectNumberFieldValue, 
      variables: variables
    }).then((result) => {
      return result.data?.updateProjectV2ItemFieldValue?.projectV2Item?.id
    });
  }

  async setProjectDateFieldValue(projectId: string, itemId: string, fieldId: string, date: Date) : Promise<string | undefined>  {
    const variables = {
      'projectId': projectId,
		  'itemId': itemId,
      'fieldId': fieldId,
      'date': date
    }

    return GitHubClient().mutate<SetProjectDateFieldValueMutation, SetProjectDateFieldValueMutationVariables>({
      mutation: SetProjectDateFieldValue, 
      variables: variables
    }).then((result) => {
      return result.data?.updateProjectV2ItemFieldValue?.projectV2Item?.id
    });
  }

  async setProjectSingleSelectFieldValue(projectId: string, itemId: string, fieldId: string, optionId: string) : Promise<string | undefined>  {
    const variables = {
      'projectId': projectId,
		  'itemId': itemId,
      'fieldId': fieldId,
      'optionId': optionId
    }

    return GitHubClient().mutate<SetProjectSingleSelectFieldValueMutation, SetProjectSingleSelectFieldValueMutationVariables>({
      mutation: SetProjectSingleSelectFieldValue, 
      variables: variables
    }).then((result) => {
      return result.data?.updateProjectV2ItemFieldValue?.projectV2Item?.id
    });
  }

  async setProjectIterationFieldValue(projectId: string, itemId: string, fieldId: string, iterationId: string) : Promise<string | undefined>  {
    const variables = {
      'projectId': projectId,
		  'itemId': itemId,
      'fieldId': fieldId,
      'iterationId': iterationId
    }

    return GitHubClient().mutate<SetProjectIterationFieldValueMutation, SetProjectIterationFieldValueMutationVariables>({
      mutation: SetProjectIterationFieldValue, 
      variables: variables
    }).then((result) => {
      return result.data?.updateProjectV2ItemFieldValue?.projectV2Item?.id
    });
  }

  async getProjectIssues(owner: string, number: number, issueCursor?: string, fieldCursor?: string) : Promise<ApolloQueryResult<ProjectIssuesQuery> | undefined> {
    const variables: ProjectIssuesQueryVariables = {
      'org': owner,
      'number': number
    }

    if (issueCursor) {
      variables.issueCursor = issueCursor;
      if (fieldCursor) {
        variables.fieldCursor = fieldCursor;
      }
    }
    
    return await GitHubClient().query<ProjectIssuesQuery, ProjectIssuesQueryVariables>({
      query: ProjectIssues, 
      variables: variables
    });
  }

  async getProjectFieldDefinition(owner: string, number: number, fieldCursor?: string) : Promise<ApolloQueryResult<ProjectFieldDefinitionQuery> | undefined> {
    const variables: ProjectFieldDefinitionQueryVariables = {
      'org': owner,
      'number': number
    }

    if (fieldCursor) {
      variables.fieldCursor = fieldCursor;
    }
    
    return await GitHubClient().query<ProjectFieldDefinitionQuery, ProjectFieldDefinitionQueryVariables>({
      query: ProjectFieldDefinition, 
      variables: variables
    });
  }

  
}