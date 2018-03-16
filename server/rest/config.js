const db = require('../util/db.js'),
  Config = require('../model/config.js'),
  cloudinary = require('cloudinary');

const IMAGE_PROVIDER = 'imageProvider';

module.exports = class ConfigResource {

	constructor(app, apiRoot) {
    const resourceUrl = apiRoot +'config';
    app.get(resourceUrl +'/:key', this.getConfig);
    app.put(resourceUrl, this.upsertConfig);
	}

	/**
	* Upsert a config
	*/
	upsertConfig(request, response) {
    Config.upsert(request.body).then(config => {
      // Test image provider config
      if (config.key === IMAGE_PROVIDER) {
        ConfigResource.testConfig(response, config);
      } else {
        response.json(config);
      }
    })
    .catch(e => {
      console.log(e.stack);
      response.status(500).json(e);
    });
	}

	/**
	* Gets a config based on its key. Returns a new config is none is set.
	*/
	getConfig(request, response) {
    Config.get(request.params.key).then(config => {
      if (config === null) {
        response.json({label: request.params.key, value: null});
      } else {
        response.json(config);
      }
    })
    .catch(e => {
      console.log(e.stack);
      response.status(500).json(e);
    });
  }

  static testConfig(response, config) {
    const baseError = 'Image provider configuration test failed';
    try {
      cloudinary.config(config.value);
      cloudinary.v2.api.usage((error, result) => {
        if (error) {
          console.error('config.testConfig', error);
          if (typeof error.message === 'undefined') {
            error.message = baseError;
          } else {
            error.message = baseError +': '+ error.message;
          }
          response.status(500).json(error);
          return;
        }
        response.json(config);
      });
    } catch (error) {
      response.status(500).json({message: baseError +': '+ error});
    }
  }
}
