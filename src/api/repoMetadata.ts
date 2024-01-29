export class RepoMetadata {
  public readonly id: string; 
  public readonly description: string;

  constructor(id: string, description: string | undefined | null) {
    this.id = id;
    this.description = description ?? '';
  }
}