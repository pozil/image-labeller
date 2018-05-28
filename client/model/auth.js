import BaseModel from './base-model';
import { Cookies, COOKIES } from '../util/cookies';

const RESOURCE_URL = '/api/auth';

export default class Auth extends BaseModel {
  static authenticate(credentials) {
    const request = BaseModel.getJsonRequest('POST', RESOURCE_URL, credentials);
    return BaseModel.authFetch(request).then(response => {
      if (response.status === 204) {
        return Promise.resolve();
      }
      return Promise.reject();
    });
  }

  static isAuthenticated() {
    return fetch(RESOURCE_URL, {cache: "no-store", credentials: 'same-origin'}).then(super.getJson);
  }

  static logout() {
    const request = new Request(RESOURCE_URL, {method: 'DELETE'});
    BaseModel.authFetch(request).then(response => {
      Cookies.deleteAll();
      window.location = '/';
    });
  }
}
