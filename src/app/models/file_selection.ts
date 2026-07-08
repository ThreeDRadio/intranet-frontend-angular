// Wrapper class to hide the direct File reference in the file selected action. Ngrx 13 introduced Object.freeze as a default.    
export class FileSelection {
  public file_reference: File;
  constructor(public input: File) {
    this.file_reference = input
  }
}