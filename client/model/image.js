import BaseModel from './base-model';

const RESOURCE_URL = '/api/images';

export default class Image extends BaseModel {
  static getAll() {
    return BaseModel.authFetch(RESOURCE_URL).then(super.getJson);
  }

  static getCount() {
    return BaseModel.authFetch(`${RESOURCE_URL}/count`).then(super.getJson);
  }

  static getFromFilename(filename) {
    return BaseModel.authFetch(`${RESOURCE_URL}?filename=${filename}`).then(super.getJson);
  }
}
