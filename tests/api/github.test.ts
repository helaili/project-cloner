import { GitHubAPI } from '../../src/api/github';
import dotenv from 'dotenv';

describe('GitHubAPI', () => {
  let githubAPI: GitHubAPI;

  beforeEach(() => {
    dotenv.config();
    // Retrive the token from the environment variable using dotenv
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      throw new Error('GITHUB_TOKEN is not set');
    } 
    githubAPI = new GitHubAPI(token);
  });

  test('getOrgId returns correct data', async () => {
    const data = await githubAPI.getOrgId('octodemo');
    expect(data).toBeDefined();
    expect(data).toBe('O_kgDOAlIw4Q');
  });

  test('getRepoTemplate returns correct data', async () => {
    const data = await githubAPI.getRepoTemplate('octodemo', 'Mona-Kart');
    expect(data).toBeDefined();
    expect(data.id).toBe('R_kgDOLG4gLg');
    expect(data.description).toBe('The most addictive video game');
  });
});