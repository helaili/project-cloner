export class ProjectMetadata {
  public readonly id: string; 
  public readonly number: number;

  constructor(id: string, number: number) {
    this.id = id;
    this.number = number;
  }
}