export default class BaseModel {
  static getJson(response) {
    if (response.status > 199 && response.status < 299) {
      return response.json();
    }
    return BaseModel.handleErrorReponse(response);
  }

  static checkForSuccessNoResponse(response) {
    if (response.status > 199 && response.status < 299) {
      return null;
    }
    return BaseModel.handleErrorReponse(response);
  }

  static handleErrorReponse(response) {
    if (response.status === 401) {
      window.location = '/';
      return;
    }
    
    return response.text().then((bodyText) => {
      if (bodyText.length === 0) {
        return Promise.reject({ message: 'Unspecified server error' });
      }
      if (bodyText.charAt(0) === '{') {
        return Promise.reject(JSON.parse(bodyText));
      }
      return Promise.reject({ message: bodyText });
    });
  }

  static create(url, data) {
    const request = BaseModel.getJsonRequest('POST', url, data);
    return BaseModel.authFetch(request).then(BaseModel.getJson);
  }

  static update(url, data) {
    const request = BaseModel.getJsonRequest('PUT', url, data);
    return BaseModel.authFetch(request).then(BaseModel.getJson);
  }

  static delete(url, id) {
    const request = BaseModel.getJsonRequest('DELETE', url, { id });
    return BaseModel.authFetch(request).then(BaseModel.checkForSuccessNoResponse);
  }

  static authFetch(request) {
    return fetch(request, {credentials: 'same-origin'});
  }

  static getJsonRequest(method, url, data) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return new Request(url, {
      method,
      headers,
      body: JSON.stringify(data),
    });
  }
}
