import BaseModel from './base-model';

const RESOURCE_URL = '/api/config';

export const CONFIG = Object.freeze({
  AUTHENTICATION: 'authentication',
  IMAGE_PROVIDER: 'imageProvider',
});

export class Config extends BaseModel {
  constructor(key, value) {
    super();
    this.key = key;
    this.value = value;
  }

  clone = () => JSON.parse(JSON.stringify(this))

  static get(key) {
    return BaseModel.authFetch(`${RESOURCE_URL}/${key}`).then(super.getJson);
  }

  static check() {
    return BaseModel.authFetch(`${RESOURCE_URL}Check`).then(super.getJson);
  }

  static upsert(config) {
    return super.update(RESOURCE_URL, config);
  }
}
