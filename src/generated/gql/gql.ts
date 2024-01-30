/* eslint-disable */
import * as types from './graphql.js';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "mutation addIssueToProject($projectId: ID!, $issueId: ID!) {\n  addProjectV2ItemById(input: {projectId: $projectId, contentId: $issueId}) {\n    item {\n      id\n    }\n  }\n}": types.AddIssueToProjectDocument,
    "mutation cloneProjectTemplate($ownerId: ID!, $projectId: ID!, $title: String!, $includeDraftIssues: Boolean!) {\n  copyProjectV2(\n    input: {includeDraftIssues: $includeDraftIssues, title: $title, projectId: $projectId, ownerId: $ownerId}\n  ) {\n    projectV2 {\n      id\n      number\n      url\n    }\n  }\n}": types.CloneProjectTemplateDocument,
    "mutation cloneRepoTemplate($ownerId: ID!, $repoId: ID!, $repo: String!, $description: String!, $includeAllBranches: Boolean, $visibility: RepositoryVisibility!) {\n  cloneTemplateRepository(\n    input: {includeAllBranches: $includeAllBranches, name: $repo, ownerId: $ownerId, description: $description, repositoryId: $repoId, visibility: $visibility}\n  ) {\n    repository {\n      id\n    }\n  }\n}": types.CloneRepoTemplateDocument,
    "mutation createIssue($repositoryId: ID!, $title: String!, $body: String!) {\n  createIssue(input: {repositoryId: $repositoryId, title: $title, body: $body}) {\n    issue {\n      id\n    }\n  }\n}": types.CreateIssueDocument,
    "mutation setProjectDateFieldValue($projectId: ID!, $itemId: ID!, $fieldId: ID!, $date: Date!) {\n  updateProjectV2ItemFieldValue(\n    input: {fieldId: $fieldId, itemId: $itemId, projectId: $projectId, value: {date: $date}}\n  ) {\n    projectV2Item {\n      id\n    }\n  }\n}": types.SetProjectDateFieldValueDocument,
    "mutation setProjectIterationFieldValue($projectId: ID!, $itemId: ID!, $fieldId: ID!, $iterationId: String!) {\n  updateProjectV2ItemFieldValue(\n    input: {fieldId: $fieldId, itemId: $itemId, projectId: $projectId, value: {iterationId: $iterationId}}\n  ) {\n    projectV2Item {\n      id\n    }\n  }\n}": types.SetProjectIterationFieldValueDocument,
    "mutation setProjectNumberFieldValue($projectId: ID!, $itemId: ID!, $fieldId: ID!, $num: Float!) {\n  updateProjectV2ItemFieldValue(\n    input: {fieldId: $fieldId, itemId: $itemId, projectId: $projectId, value: {number: $num}}\n  ) {\n    projectV2Item {\n      id\n    }\n  }\n}": types.SetProjectNumberFieldValueDocument,
    "mutation setProjectSingleSelectFieldValue($projectId: ID!, $itemId: ID!, $fieldId: ID!, $optionId: String!) {\n  updateProjectV2ItemFieldValue(\n    input: {fieldId: $fieldId, itemId: $itemId, projectId: $projectId, value: {singleSelectOptionId: $optionId}}\n  ) {\n    projectV2Item {\n      id\n    }\n  }\n}": types.SetProjectSingleSelectFieldValueDocument,
    "mutation setProjectTextFieldValue($projectId: ID!, $itemId: ID!, $fieldId: ID!, $text: String!) {\n  updateProjectV2ItemFieldValue(\n    input: {fieldId: $fieldId, itemId: $itemId, projectId: $projectId, value: {text: $text}}\n  ) {\n    projectV2Item {\n      id\n    }\n  }\n}": types.SetProjectTextFieldValueDocument,
    "query orgId($org: String!) {\n  organization(login: $org) {\n    id\n  }\n}": types.OrgIdDocument,
    "query ProjectFieldDefinition($org: String!, $number: Int!, $fieldCursor: String) {\n  organization(login: $org) {\n    projectV2(number: $number) {\n      title\n      id\n      fields(first: 100, after: $fieldCursor) {\n        pageInfo {\n          hasNextPage\n          endCursor\n        }\n        nodes {\n          ... on ProjectV2Field {\n            id\n            name\n          }\n          ... on ProjectV2IterationField {\n            id\n            name\n          }\n          ... on ProjectV2SingleSelectField {\n            id\n            name\n          }\n        }\n      }\n    }\n  }\n}": types.ProjectFieldDefinitionDocument,
    "query ProjectIssues($org: String!, $number: Int!, $issueCursor: String, $fieldCursor: String) {\n  organization(login: $org) {\n    projectV2(number: $number) {\n      title\n      id\n      owner {\n        id\n      }\n      items(first: 5, after: $issueCursor) {\n        pageInfo {\n          hasNextPage\n          endCursor\n        }\n        nodes {\n          content {\n            __typename\n            ... on DraftIssue {\n              title\n              body\n            }\n            ... on Issue {\n              title\n              body\n            }\n            ... on PullRequest {\n              title\n              body\n            }\n          }\n          fieldValues(first: 100, after: $fieldCursor) {\n            pageInfo {\n              hasNextPage\n              endCursor\n            }\n            nodes {\n              __typename\n              ... on ProjectV2ItemFieldRepositoryValue {\n                repository {\n                  name\n                }\n              }\n              ... on ProjectV2ItemFieldTextValue {\n                id\n                text\n                field {\n                  ... on ProjectV2Field {\n                    id\n                    name\n                  }\n                }\n              }\n              ... on ProjectV2ItemFieldDateValue {\n                date\n                field {\n                  ... on ProjectV2Field {\n                    id\n                    name\n                  }\n                }\n              }\n              ... on ProjectV2ItemFieldIterationValue {\n                iterationId\n                title\n                startDate\n                duration\n                field {\n                  ... on ProjectV2IterationField {\n                    id\n                    name\n                  }\n                }\n              }\n              ... on ProjectV2ItemFieldSingleSelectValue {\n                name\n                optionId\n                field {\n                  ... on ProjectV2SingleSelectField {\n                    id\n                    name\n                  }\n                }\n              }\n              ... on ProjectV2ItemFieldNumberValue {\n                id\n                number\n                field {\n                  ... on ProjectV2Field {\n                    id\n                    name\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}": types.ProjectIssuesDocument,
    "query repoTemplate($org: String!, $repo: String!) {\n  organization(login: $org) {\n    repository(name: $repo) {\n      id\n      description\n    }\n  }\n}": types.RepoTemplateDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation addIssueToProject($projectId: ID!, $issueId: ID!) {\n  addProjectV2ItemById(input: {projectId: $projectId, contentId: $issueId}) {\n    item {\n      id\n    }\n  }\n}"): (typeof documents)["mutation addIssueToProject($projectId: ID!, $issueId: ID!) {\n  addProjectV2ItemById(input: {projectId: $projectId, contentId: $issueId}) {\n    item {\n      id\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation cloneProjectTemplate($ownerId: ID!, $projectId: ID!, $title: String!, $includeDraftIssues: Boolean!) {\n  copyProjectV2(\n    input: {includeDraftIssues: $includeDraftIssues, title: $title, projectId: $projectId, ownerId: $ownerId}\n  ) {\n    projectV2 {\n      id\n      number\n      url\n    }\n  }\n}"): (typeof documents)["mutation cloneProjectTemplate($ownerId: ID!, $projectId: ID!, $title: String!, $includeDraftIssues: Boolean!) {\n  copyProjectV2(\n    input: {includeDraftIssues: $includeDraftIssues, title: $title, projectId: $projectId, ownerId: $ownerId}\n  ) {\n    projectV2 {\n      id\n      number\n      url\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation cloneRepoTemplate($ownerId: ID!, $repoId: ID!, $repo: String!, $description: String!, $includeAllBranches: Boolean, $visibility: RepositoryVisibility!) {\n  cloneTemplateRepository(\n    input: {includeAllBranches: $includeAllBranches, name: $repo, ownerId: $ownerId, description: $description, repositoryId: $repoId, visibility: $visibility}\n  ) {\n    repository {\n      id\n    }\n  }\n}"): (typeof documents)["mutation cloneRepoTemplate($ownerId: ID!, $repoId: ID!, $repo: String!, $description: String!, $includeAllBranches: Boolean, $visibility: RepositoryVisibility!) {\n  cloneTemplateRepository(\n    input: {includeAllBranches: $includeAllBranches, name: $repo, ownerId: $ownerId, description: $description, repositoryId: $repoId, visibility: $visibility}\n  ) {\n    repository {\n      id\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation createIssue($repositoryId: ID!, $title: String!, $body: String!) {\n  createIssue(input: {repositoryId: $repositoryId, title: $title, body: $body}) {\n    issue {\n      id\n    }\n  }\n}"): (typeof documents)["mutation createIssue($repositoryId: ID!, $title: String!, $body: String!) {\n  createIssue(input: {repositoryId: $repositoryId, title: $title, body: $body}) {\n    issue {\n      id\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation setProjectDateFieldValue($projectId: ID!, $itemId: ID!, $fieldId: ID!, $date: Date!) {\n  updateProjectV2ItemFieldValue(\n    input: {fieldId: $fieldId, itemId: $itemId, projectId: $projectId, value: {date: $date}}\n  ) {\n    projectV2Item {\n      id\n    }\n  }\n}"): (typeof documents)["mutation setProjectDateFieldValue($projectId: ID!, $itemId: ID!, $fieldId: ID!, $date: Date!) {\n  updateProjectV2ItemFieldValue(\n    input: {fieldId: $fieldId, itemId: $itemId, projectId: $projectId, value: {date: $date}}\n  ) {\n    projectV2Item {\n      id\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation setProjectIterationFieldValue($projectId: ID!, $itemId: ID!, $fieldId: ID!, $iterationId: String!) {\n  updateProjectV2ItemFieldValue(\n    input: {fieldId: $fieldId, itemId: $itemId, projectId: $projectId, value: {iterationId: $iterationId}}\n  ) {\n    projectV2Item {\n      id\n    }\n  }\n}"): (typeof documents)["mutation setProjectIterationFieldValue($projectId: ID!, $itemId: ID!, $fieldId: ID!, $iterationId: String!) {\n  updateProjectV2ItemFieldValue(\n    input: {fieldId: $fieldId, itemId: $itemId, projectId: $projectId, value: {iterationId: $iterationId}}\n  ) {\n    projectV2Item {\n      id\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation setProjectNumberFieldValue($projectId: ID!, $itemId: ID!, $fieldId: ID!, $num: Float!) {\n  updateProjectV2ItemFieldValue(\n    input: {fieldId: $fieldId, itemId: $itemId, projectId: $projectId, value: {number: $num}}\n  ) {\n    projectV2Item {\n      id\n    }\n  }\n}"): (typeof documents)["mutation setProjectNumberFieldValue($projectId: ID!, $itemId: ID!, $fieldId: ID!, $num: Float!) {\n  updateProjectV2ItemFieldValue(\n    input: {fieldId: $fieldId, itemId: $itemId, projectId: $projectId, value: {number: $num}}\n  ) {\n    projectV2Item {\n      id\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation setProjectSingleSelectFieldValue($projectId: ID!, $itemId: ID!, $fieldId: ID!, $optionId: String!) {\n  updateProjectV2ItemFieldValue(\n    input: {fieldId: $fieldId, itemId: $itemId, projectId: $projectId, value: {singleSelectOptionId: $optionId}}\n  ) {\n    projectV2Item {\n      id\n    }\n  }\n}"): (typeof documents)["mutation setProjectSingleSelectFieldValue($projectId: ID!, $itemId: ID!, $fieldId: ID!, $optionId: String!) {\n  updateProjectV2ItemFieldValue(\n    input: {fieldId: $fieldId, itemId: $itemId, projectId: $projectId, value: {singleSelectOptionId: $optionId}}\n  ) {\n    projectV2Item {\n      id\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation setProjectTextFieldValue($projectId: ID!, $itemId: ID!, $fieldId: ID!, $text: String!) {\n  updateProjectV2ItemFieldValue(\n    input: {fieldId: $fieldId, itemId: $itemId, projectId: $projectId, value: {text: $text}}\n  ) {\n    projectV2Item {\n      id\n    }\n  }\n}"): (typeof documents)["mutation setProjectTextFieldValue($projectId: ID!, $itemId: ID!, $fieldId: ID!, $text: String!) {\n  updateProjectV2ItemFieldValue(\n    input: {fieldId: $fieldId, itemId: $itemId, projectId: $projectId, value: {text: $text}}\n  ) {\n    projectV2Item {\n      id\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query orgId($org: String!) {\n  organization(login: $org) {\n    id\n  }\n}"): (typeof documents)["query orgId($org: String!) {\n  organization(login: $org) {\n    id\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query ProjectFieldDefinition($org: String!, $number: Int!, $fieldCursor: String) {\n  organization(login: $org) {\n    projectV2(number: $number) {\n      title\n      id\n      fields(first: 100, after: $fieldCursor) {\n        pageInfo {\n          hasNextPage\n          endCursor\n        }\n        nodes {\n          ... on ProjectV2Field {\n            id\n            name\n          }\n          ... on ProjectV2IterationField {\n            id\n            name\n          }\n          ... on ProjectV2SingleSelectField {\n            id\n            name\n          }\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query ProjectFieldDefinition($org: String!, $number: Int!, $fieldCursor: String) {\n  organization(login: $org) {\n    projectV2(number: $number) {\n      title\n      id\n      fields(first: 100, after: $fieldCursor) {\n        pageInfo {\n          hasNextPage\n          endCursor\n        }\n        nodes {\n          ... on ProjectV2Field {\n            id\n            name\n          }\n          ... on ProjectV2IterationField {\n            id\n            name\n          }\n          ... on ProjectV2SingleSelectField {\n            id\n            name\n          }\n        }\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query ProjectIssues($org: String!, $number: Int!, $issueCursor: String, $fieldCursor: String) {\n  organization(login: $org) {\n    projectV2(number: $number) {\n      title\n      id\n      owner {\n        id\n      }\n      items(first: 5, after: $issueCursor) {\n        pageInfo {\n          hasNextPage\n          endCursor\n        }\n        nodes {\n          content {\n            __typename\n            ... on DraftIssue {\n              title\n              body\n            }\n            ... on Issue {\n              title\n              body\n            }\n            ... on PullRequest {\n              title\n              body\n            }\n          }\n          fieldValues(first: 100, after: $fieldCursor) {\n            pageInfo {\n              hasNextPage\n              endCursor\n            }\n            nodes {\n              __typename\n              ... on ProjectV2ItemFieldRepositoryValue {\n                repository {\n                  name\n                }\n              }\n              ... on ProjectV2ItemFieldTextValue {\n                id\n                text\n                field {\n                  ... on ProjectV2Field {\n                    id\n                    name\n                  }\n                }\n              }\n              ... on ProjectV2ItemFieldDateValue {\n                date\n                field {\n                  ... on ProjectV2Field {\n                    id\n                    name\n                  }\n                }\n              }\n              ... on ProjectV2ItemFieldIterationValue {\n                iterationId\n                title\n                startDate\n                duration\n                field {\n                  ... on ProjectV2IterationField {\n                    id\n                    name\n                  }\n                }\n              }\n              ... on ProjectV2ItemFieldSingleSelectValue {\n                name\n                optionId\n                field {\n                  ... on ProjectV2SingleSelectField {\n                    id\n                    name\n                  }\n                }\n              }\n              ... on ProjectV2ItemFieldNumberValue {\n                id\n                number\n                field {\n                  ... on ProjectV2Field {\n                    id\n                    name\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query ProjectIssues($org: String!, $number: Int!, $issueCursor: String, $fieldCursor: String) {\n  organization(login: $org) {\n    projectV2(number: $number) {\n      title\n      id\n      owner {\n        id\n      }\n      items(first: 5, after: $issueCursor) {\n        pageInfo {\n          hasNextPage\n          endCursor\n        }\n        nodes {\n          content {\n            __typename\n            ... on DraftIssue {\n              title\n              body\n            }\n            ... on Issue {\n              title\n              body\n            }\n            ... on PullRequest {\n              title\n              body\n            }\n          }\n          fieldValues(first: 100, after: $fieldCursor) {\n            pageInfo {\n              hasNextPage\n              endCursor\n            }\n            nodes {\n              __typename\n              ... on ProjectV2ItemFieldRepositoryValue {\n                repository {\n                  name\n                }\n              }\n              ... on ProjectV2ItemFieldTextValue {\n                id\n                text\n                field {\n                  ... on ProjectV2Field {\n                    id\n                    name\n                  }\n                }\n              }\n              ... on ProjectV2ItemFieldDateValue {\n                date\n                field {\n                  ... on ProjectV2Field {\n                    id\n                    name\n                  }\n                }\n              }\n              ... on ProjectV2ItemFieldIterationValue {\n                iterationId\n                title\n                startDate\n                duration\n                field {\n                  ... on ProjectV2IterationField {\n                    id\n                    name\n                  }\n                }\n              }\n              ... on ProjectV2ItemFieldSingleSelectValue {\n                name\n                optionId\n                field {\n                  ... on ProjectV2SingleSelectField {\n                    id\n                    name\n                  }\n                }\n              }\n              ... on ProjectV2ItemFieldNumberValue {\n                id\n                number\n                field {\n                  ... on ProjectV2Field {\n                    id\n                    name\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query repoTemplate($org: String!, $repo: String!) {\n  organization(login: $org) {\n    repository(name: $repo) {\n      id\n      description\n    }\n  }\n}"): (typeof documents)["query repoTemplate($org: String!, $repo: String!) {\n  organization(login: $org) {\n    repository(name: $repo) {\n      id\n      description\n    }\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;