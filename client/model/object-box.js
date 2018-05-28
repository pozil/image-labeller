import BaseModel from './base-model';

const RESOURCE_URL = '/api/objects';

export default class ObjectBox extends BaseModel {
  constructor(object) {
    super();
    this.id = object.id;
    this.x = object.x;
    this.y = object.y;
    this.w = object.w;
    this.h = object.h;
    this.label_id = object.label_id;
    this.image_id = object.image_id;
  }

  clone = () => ({
    id: this.id,
    x: this.x,
    y: this.y,
    w: this.w,
    h: this.h,
    label_id: this.label_id,
    image_id: this.image_id,
  })

  toScreenScale = (scale) => {
    this.x = Math.round(this.x * scale.x);
    this.y = Math.round(this.y * scale.y);
    this.w = Math.round(this.w * scale.x);
    this.h = Math.round(this.h * scale.y);
  }

  toImageScale = (scale) => {
    this.x = Math.round(this.x / scale.x);
    this.y = Math.round(this.y / scale.y);
    this.w = Math.round(this.w / scale.x);
    this.h = Math.round(this.h / scale.y);
  }

  static getFromImage(imageId) {
    return BaseModel.authFetch(`${RESOURCE_URL}?imageId=${imageId}`).then(super.getJson);
  }

  static create(box) {
    return super.create(RESOURCE_URL, box);
  }

  static delete(box) {
    const request = BaseModel.getJsonRequest('DELETE', RESOURCE_URL, box);
    return BaseModel.authFetch(request).then(super.getJson);
  }

  static getCount() {
    return BaseModel.authFetch(`${RESOURCE_URL}/count`).then(super.getJson);
  }
}
