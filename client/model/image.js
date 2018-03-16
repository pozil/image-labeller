import BaseModel from './base-model';

const RESOURCE_URL = '/api/images';

export default class Image extends BaseModel {
  static getAll() {
    return fetch(RESOURCE_URL).then(super.getJson);
  }

  static getCount() {
    return fetch(`${RESOURCE_URL}/count`).then(super.getJson);
  }

  static getFromFilename(filename) {
    return fetch(`${RESOURCE_URL}?filename=${filename}`).then(super.getJson);
  }
}
