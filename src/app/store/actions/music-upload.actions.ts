import { Action } from '@ngrx/store';

export const REQUEST_SUBMIT_RELEASE = '[MusicUpload] request submit release';
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

export class RequestSubmitRelease implements Action {
  readonly type = REQUEST_SUBMIT_RELEASE;
  constructor(
    public payload: {
      album: {
        artist: string;
        company: string;
        compilation: number;
        cpa: string;
        female: number;
        local: number;
        title: string;
        year: number;
      };
      tracks: Array<{
        tracknum: number;
        trackartist: string;
        tracktitle: string;
        file: File;
      }>;
    }
  ) {}
}
