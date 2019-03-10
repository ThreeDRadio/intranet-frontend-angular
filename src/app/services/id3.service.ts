import * as id3 from 'jsmediatags';

export class Id3Service {
  async getMetadata(file) {
    const tags = await this.getTags(file);
    const duration = await this.getDuration(file);
    return { ...tags, duration };
  }
  getTags(file: File) {
    return new Promise((resolve, reject) => {
      new id3.Reader(file).read({
        onSuccess: tag => resolve(tag),
        onError: error => reject(error)
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
