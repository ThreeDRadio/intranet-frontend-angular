import { Action } from '@ngrx/store';

import * as actions from '../actions/music-upload.actions';

export interface State {
  selectedFiles: Array<File>;
  metadata?: { [id: string]: Object };
  loading: boolean;
}

const INITIAL_STATE: State = {
  selectedFiles: [],
  metadata: {},
  loading: false
};

export function reducer(state: State = INITIAL_STATE, action: Action) {
  switch (action.type) {
    case actions.FILES_SELECTED:
      return {
        ...state,
        selectedFiles: (<actions.FilesSelectedAction>action).payload,
        loading: true
      };
    case actions.UPDATE_METADATA:
      return { ...state, metadata: (<actions.UpdateMetadataAction>action).payload, loading: false };
  }
  return state;
}
