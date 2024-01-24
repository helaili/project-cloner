import { GitHubAPI } from './api/github';
import dotenv from 'dotenv';
import { ProjectCloner } from './projectCloner';


async function main() {
  dotenv.config();
  // Retrive the token from the environment variable using dotenv
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error('GITHUB_TOKEN is not set');
  }
  const github = new GitHubAPI(token);

  const template_owner = process.env.TEMPLATE_OWNER;
  if (!template_owner) {
    throw new Error('TEMPLATE_OWNER is not set');
  }

  const template_repo = process.env.TEMPLATE_REPO;
  if (!template_repo) {
    throw new Error('TEMPLATE_REPO is not set');
  }

  // Read TEMPLATE_PROJECT_NUMBER and convert it to a number
  const template_project_number = parseInt(process.env.TEMPLATE_PROJECT_NUMBER || '');
  if (!template_project_number) {
    throw new Error('TEMPLATE_PROJECT_NUMBER is not set');
  }

  const owner = process.env.OWNER;
  if (!owner) {
    throw new Error('OWNER is not set');
  }

  const repo = process.env.REPO;
  if (!repo) {
    throw new Error('REPO is not set');
  }

  const projectCloner = new ProjectCloner(token, template_owner, template_repo, template_project_number, owner, repo);
  await projectCloner.clone();
}

main().catch(console.error);