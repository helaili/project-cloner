import dotenv from 'dotenv';
import { ProjectCloner } from './projectCloner.js';
import { ProjectMetadata } from './api/projectMetadata.js';


async function main() {
  if(!process.env.GITHUB_ACTIONS) {
    dotenv.config();
    // Retrive the token from the environment variable using dotenv
    if (!process.env.GITHUB_TOKEN) {
      throw new Error('GITHUB_TOKEN is not set');
    }
    const token: string = process.env.GITHUB_TOKEN;
    
    if (!process.env.TEMPLATE_OWNER) {
      throw new Error('TEMPLATE_OWNER is not set');
    }
    const template_owner = process.env.TEMPLATE_OWNER;

    if (!process.env.TEMPLATE_REPO) {
      throw new Error('TEMPLATE_REPO is not set');
    }
    const template_repo = process.env.TEMPLATE_REPO;
    
    // Read TEMPLATE_PROJECT_NUMBER and convert it to a number
    if (!process.env.TEMPLATE_PROJECT_NUMBER) {
      throw new Error('TEMPLATE_PROJECT_NUMBER is not set');
    }
    const template_project_number = parseInt(process.env.TEMPLATE_PROJECT_NUMBER);
    if (isNaN(template_project_number)) {
      throw new Error('TEMPLATE_PROJECT_NUMBER is not a number');
    }

    const owner = process.env.OWNER;
    if (!owner) {
      throw new Error('OWNER is not set');
    }

    const repo = process.env.REPO;
    if (!repo) {
      throw new Error('REPO is not set');
    }

    const project = process.env.PROJECT;
    if (!project) {
      throw new Error('PROJECT is not set');
    }

    const projectCloner = new ProjectCloner(token, template_owner, template_repo, template_project_number, owner, repo, project);
    projectCloner.clone().then((projectMetadata) => {
      console.log(`Cloned project ${projectMetadata.number} with id ${projectMetadata.id} at ${projectMetadata.url}`);
    });
  }
}

main().catch(console.error);


export { ProjectCloner, ProjectMetadata }