import { Injectable } from '@angular/core';

import * as id3 from 'id3js';

export class Id3Service {
  getTags(file: File) {
    return new Promise((resolve, reject) => {
      id3(file, (err, tags) => {
        if (err) {
          return reject(err);
        }
        resolve(tags);
      });
    });
  }
}
