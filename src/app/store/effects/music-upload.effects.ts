import { Observable } from 'rxjs';
import * as actions from '../actions/music-upload.actions';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';

import { map, switchMap } from 'rxjs/operators';

import { Id3Service } from '../../services/index';

@Injectable()
export class MusicUploadEffects {
  @Effect()
  getMetadataForFiles = this.actions$.ofType(actions.FILES_SELECTED).pipe(
    switchMap(async (action: actions.FilesSelectedAction) => {
      const entities = {};
      for (const file of action.payload) {
        entities[file.name] = await this.id3.getTags(file);
      }
      return entities;
    }),
    map(data => new actions.UpdateMetadataAction(data))
  );

  constructor(private actions$: Actions, private id3: Id3Service) {}
}
