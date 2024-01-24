import { GithubAPI } from '../../src/api/github';

describe('GithubAPI', () => {
  let githubAPI: GithubAPI;

  beforeEach(() => {
    githubAPI = new GithubAPI();
  });

  test('getRepo returns correct data', async () => {
    const data = await githubAPI.getRepo('owner', 'repo');
    expect(data).toBeDefined();
    // Add more assertions based on your expected data
  });

  test('createIssue creates an issue', async () => {
    const issue = await githubAPI.createIssue('owner', 'repo', 'title', 'body');
    expect(issue).toBeDefined();
    // Add more assertions based on your expected data
  });

  // Add more tests for other methods of GithubAPI
});