import BaseModel from './base-model';

const RESOURCE_URL = '/api/images/cloudinary';

export default class ProvidedImage extends BaseModel {
  static getAll(maxResults = 20, nextCursor = null) {
    let url = `${RESOURCE_URL}?max_results=${maxResults}`;
    if (nextCursor !== null) {
      url += `&next_cursor=${nextCursor}`;
    }
    return fetch(url).then(super.getJson);
  }
}
