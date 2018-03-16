import BaseModel from './base-model';

const RESOURCE_URL = '/api/config';

export default class Config extends BaseModel {
  constructor(key, value) {
    super();
    this.key = key;
    this.value = value;
  }

  clone = () => JSON.parse(JSON.stringify(this))

  static get(key) {
    return fetch(`${RESOURCE_URL}/${key}`).then(super.getJson);
  }

  static upsert(config) {
    return super.update(RESOURCE_URL, config);
  }
}
