import { OrgIdQuery, OrgIdQueryVariables, RepoTemplateQuery, RepoTemplateQueryVariables, RepositoryVisibility, CloneRepoTemplateMutation, CloneRepoTemplateMutationVariables, CloneProjectTemplateMutation, CloneProjectTemplateMutationVariables, CreateIssueMutation, CreateIssueMutationVariables, AddIssueToProjectMutation, AddIssueToProjectMutationVariables, SetProjectTextFieldValueMutation, SetProjectTextFieldValueMutationVariables, SetProjectNumberFieldValueMutation, SetProjectNumberFieldValueMutationVariables, SetProjectDateFieldValueMutation, SetProjectDateFieldValueMutationVariables, SetProjectSingleSelectFieldValueMutation, SetProjectSingleSelectFieldValueMutationVariables, SetProjectIterationFieldValueMutation, SetProjectIterationFieldValueMutationVariables, ProjectIssuesQuery, ProjectIssuesQueryVariables, ProjectFieldDefinitionQuery, ProjectFieldDefinitionQueryVariables, OrgIdDocument, RepoTemplateDocument, CloneRepoTemplateDocument, CloneProjectTemplateDocument, CreateIssueDocument, AddIssueToProjectDocument, SetProjectTextFieldValueDocument, SetProjectNumberFieldValueDocument, SetProjectDateFieldValueDocument, SetProjectSingleSelectFieldValueDocument, SetProjectIterationFieldValueDocument, ProjectIssuesDocument, ProjectFieldDefinitionDocument, CloseIssueWithReasonDocument, CloseIssueWithReasonMutation, CloseIssueWithReasonMutationVariables, IssueClosedStateReason } from '../generated/gql/graphql.js';
import { ProjectMetadata } from './projectMetadata.js';
import { RepoMetadata } from './repoMetadata.js';
import type { ApolloQueryResult, NormalizedCacheObject } from "@apollo/client/core/index.js";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client/core/index.js";

export class GitHubAPI {
  private token : string;

  constructor(token: string) {
    this.token = token;
  }

  githubClient(): ApolloClient<NormalizedCacheObject> {
    return new ApolloClient({
      link: new HttpLink({
        uri: "https://api.github.com/graphql",
        headers: {
          'authorization': `token ${this.token}`,
          'X-Github-Next-Global-ID': '1'
        },
        fetch,
      }),
      cache: new InMemoryCache(),
    });
  }

  // Returns the organization id such as "O_kgDOAlIw4Q"
  async getOrgId(owner: string) : Promise<string> {
    const variables = {
      'org': owner
    }

    return this.githubClient().query<OrgIdQuery, OrgIdQueryVariables>({
      query: OrgIdDocument, 
      variables: variables
    }).then((result) => {
      if (!result.data.organization?.id) {
        throw new Error(`Failed to retrieve organization ${owner}`); 
      }
      
      return result.data.organization.id;
    });
  }

  // Retrieve the id and description of a repository.
  async getRepoTemplate(owner: string, repo: string) : Promise<RepoMetadata> {
    const variables = {
      'org': owner,
      'repo': repo
    }

    return this.githubClient().query<RepoTemplateQuery, RepoTemplateQueryVariables>({
      query: RepoTemplateDocument, 
      variables: variables
    }).then((result) => {
      if (!result.data.organization?.repository?.id) {
        throw new Error(`Failed to retrieve repository ${repo} within organization ${owner}`); 
      }
      return new RepoMetadata(result.data.organization?.repository?.id, result.data.organization.repository?.description);
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

    return this.githubClient().mutate<CloneRepoTemplateMutation, CloneRepoTemplateMutationVariables>({
      mutation: CloneRepoTemplateDocument, 
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

    return this.githubClient().mutate<CloneProjectTemplateMutation, CloneProjectTemplateMutationVariables>({
      mutation: CloneProjectTemplateDocument, 
      variables: variables
    }).then((result) => {
      if(result.data?.copyProjectV2?.projectV2) {
        return new ProjectMetadata(result.data.copyProjectV2.projectV2.id, result.data.copyProjectV2.projectV2.number, result.data.copyProjectV2.projectV2.url);
      }
    });
  }

  async createIssue(repositoryId: string, title: string, body: string) : Promise<string | undefined>  {
    const variables = {
      'repositoryId': repositoryId,
		  'title': title,
		  'body': body
    }

    return this.githubClient().mutate<CreateIssueMutation, CreateIssueMutationVariables>({
      mutation: CreateIssueDocument, 
      variables: variables
    }).then((result) => {
      return result.data?.createIssue?.issue?.id;
    });
  }

  async closeIssue(issueId: string, reason: IssueClosedStateReason) : Promise<string | undefined>  {
    const variables = {
      'issueId': issueId,
		  'stateReason': reason    
    }

    return this.githubClient().mutate<CloseIssueWithReasonMutation, CloseIssueWithReasonMutationVariables>({
      mutation: CloseIssueWithReasonDocument, 
      variables: variables
    }).then((result) => {
      return result.data?.closeIssue?.issue?.id;
    });
  }

  async addIssueToProject(projectId: string, issueId: string) : Promise<string | undefined>  {
    const variables = {
      'projectId': projectId,
		  'issueId': issueId
    }

    return this.githubClient().mutate<AddIssueToProjectMutation, AddIssueToProjectMutationVariables>({
      mutation: AddIssueToProjectDocument, 
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

    return this.githubClient().mutate<SetProjectTextFieldValueMutation, SetProjectTextFieldValueMutationVariables>({
      mutation: SetProjectTextFieldValueDocument, 
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

    return this.githubClient().mutate<SetProjectNumberFieldValueMutation, SetProjectNumberFieldValueMutationVariables>({
      mutation: SetProjectNumberFieldValueDocument, 
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

    return this.githubClient().mutate<SetProjectDateFieldValueMutation, SetProjectDateFieldValueMutationVariables>({
      mutation: SetProjectDateFieldValueDocument, 
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

    return this.githubClient().mutate<SetProjectSingleSelectFieldValueMutation, SetProjectSingleSelectFieldValueMutationVariables>({
      mutation: SetProjectSingleSelectFieldValueDocument, 
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

    return this.githubClient().mutate<SetProjectIterationFieldValueMutation, SetProjectIterationFieldValueMutationVariables>({
      mutation: SetProjectIterationFieldValueDocument, 
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
    
    return await this.githubClient().query<ProjectIssuesQuery, ProjectIssuesQueryVariables>({
      query: ProjectIssuesDocument, 
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
    
    return await this.githubClient().query<ProjectFieldDefinitionQuery, ProjectFieldDefinitionQueryVariables>({
      query: ProjectFieldDefinitionDocument, 
      variables: variables
    });
  } 
}