import { Injectable } from '@angular/core';

import * as id3 from 'id3js';

export class Id3Service {
  async getMetadata(file) {
    const tags = await this.getTags(file);
    const duration = await this.getDuration(file);
    return { ...tags, duration };
  }
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
  getDuration(file: File) {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      const objectUrl = URL.createObjectURL(file);
      audio.src = objectUrl;
      audio.addEventListener('canplaythrough', () => {
        resolve(audio.duration);
      });
    });
  }
}
