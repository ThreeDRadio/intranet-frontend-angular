import { createSelector } from 'reselect';

import { State } from '../reducers';

export const musicUploadState = (state: State) => state.musicUpload;

export const selectedFiles = createSelector(musicUploadState, state => state.selectedFiles);
export const selectedMetadata = createSelector(musicUploadState, state => state.metadata);
export const isLoading = createSelector(musicUploadState, state => state.loading);
export const uploadProgress = createSelector(musicUploadState, state => state.progress || 0);
export const uploadLog = createSelector(musicUploadState, state => state.log);

export const selectedFilesWithMetadata = createSelector(
  selectedFiles,
  selectedMetadata,
  (files, metadata) => {
    const entities = [];
    for (const file of files) {
      entities.push({
        file: file,
        metadata: metadata[file.name]
      });
    }
    return entities;
  }
);

export const isSelectedCompilation = createSelector(selectedFilesWithMetadata, data => {
  if (data.length > 0 && data[0].metadata) {
    const artist = data[0].metadata['artist'];
    for (const file of data) {
      if (file.metadata['artist'] !== artist) {
        return true;
      }
    }
  }
  return false;
});

export const selectedArtist = createSelector(
  selectedFilesWithMetadata,
  isSelectedCompilation,
  (data, comp) => {
    if (comp) {
      return 'Various';
    }
    if (data.length > 0 && data[0].metadata) {
      return data[0].metadata['artist'];
    }
    return '';
  }
);

export const selectedAlbum = createSelector(selectedFilesWithMetadata, data => {
  if (data.length > 0 && data[0].metadata) {
    return data[0].metadata['album'];
  }
  return '';
});
