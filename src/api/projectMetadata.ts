export class ProjectMetadata {
  public readonly id: string; 
  public readonly number: number;
  public readonly url: string;

  constructor(id: string, number: number, url: string) {
    this.id = id;
    this.number = number;
    this.url = url;
  }
}