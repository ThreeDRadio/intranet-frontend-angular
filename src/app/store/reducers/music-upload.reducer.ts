import * as actions from '../actions/music-upload.actions';

export interface State {
  selectedFiles: Array<File>;
  metadata?: { [id: string]: Object };
  loading: boolean;
  progress?: number;
  log?: Array<string>;
}

const INITIAL_STATE: State = {
  selectedFiles: [],
  metadata: {},
  loading: false
};

export function reducer(state: State = INITIAL_STATE, action: actions.MusicUploadAction) {
  switch (action.type) {
    case actions.FILES_SELECTED:
      return {
        ...state,
        selectedFiles: action.payload,
        loading: true
      };
    case actions.REQUEST_SUBMIT_RELEASE:
      return { ...state, loading: true, progress: 0, log: [] };

    case actions.REPORT_UPLOAD_LOG:
      return { ...state, log: [...state.log, action.payload] };
    case actions.REPORT_UPLOAD_PROGRESS:
      return { ...state, progress: action.payload };
    case actions.RESPONSE_SUCCESS_SUBMIT_RELEASE:
      return { ...state, progress: 100, loading: false };
    case actions.UPDATE_METADATA:
      return { ...state, metadata: action.payload, loading: false };
    case actions.RESET_UPLOAD:
      return { ...INITIAL_STATE };
  }
  return state;
}
