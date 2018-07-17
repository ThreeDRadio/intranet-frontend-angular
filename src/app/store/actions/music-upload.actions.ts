import { Action } from '@ngrx/store';

export const FILES_SELECTED = '[MusicUpload] files selected';
export const UPDATE_METADATA = '[MusicUpload update metadata';

export class FilesSelectedAction implements Action {
  readonly type = FILES_SELECTED;
  constructor(public payload: Array<File>) {}
}

export class UpdateMetadataAction implements Action {
  readonly type = UPDATE_METADATA;
  constructor(public payload: { [id: string]: Object }) {}
}
