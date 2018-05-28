import BaseModel from './base-model';

const RESOURCE_URL = '/api/labels';

export default class Label extends BaseModel {
  static getAll() {
    return BaseModel.authFetch(RESOURCE_URL).then(super.getJson);
  }

  static getUseCount(labelId) {
    return BaseModel.authFetch(`${RESOURCE_URL}/useCount?labelId=${labelId}`).then(super.getJson);
  }

  static getUseCountForAll() {
    return BaseModel.authFetch(`${RESOURCE_URL}/useCount`).then(super.getJson);
  }

  static create(label) {
    return super.create(RESOURCE_URL, label);
  }

  static update(label) {
    return super.update(RESOURCE_URL, label);
  }

  static delete(labelId) {
    return super.delete(RESOURCE_URL, labelId);
  }

  static getCount() {
    return BaseModel.authFetch(`${RESOURCE_URL}/count`).then(super.getJson);
  }
}
