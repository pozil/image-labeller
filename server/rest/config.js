const db = require('../util/db.js'),
  Session = require('../util/session.js'),
  { Config, CONFIG } = require('../model/config.js'),
  cloudinary = require('cloudinary');

module.exports = class ConfigResource {

	constructor(app, apiRoot) {
    const resourceUrl = apiRoot +'config';
    app.get(resourceUrl +'/:key', this.getConfig);
    app.put(resourceUrl, this.upsertConfig);
    app.get(resourceUrl +'Check', this.checkConfig);
	}

	/**
	* Upsert a config
	*/
	upsertConfig(request, response) {
    const curSession = Session.getSession(request, response);
    if (curSession == null)
      return;
    
    Config.upsert(request.body).then(config => {
      // Test image provider config
      if (config.key === CONFIG.IMAGE_PROVIDER) {
        ConfigResource.testImageProviderConfig(response, config);
      } else {
        response.json(config);
      }
    })
    .catch(e => logAndReportError(response, 'Config.upsertConfig', e));
	}

	/**
	* Gets a config based on its key. Returns a new config is none is set.
	*/
	getConfig(request, response) {
    const curSession = Session.getSession(request, response);
    if (curSession == null)
      return;
    
    Config.get(request.params.key).then(config => {
      if (config === null) {
        response.json({label: request.params.key, value: null});
      } else {
        response.json(config);
      }
    })
    .catch(e => logAndReportError(response, 'Config.getConfig', e));
  }

  /**
	* Checks app configuration
	*/
	checkConfig(request, response) {
    const curSession = Session.getSession(request, response);
    if (curSession == null)
      return;
    
    Config.getAll().then(configItems => {
      const configStatus = [];  
      Object.keys(CONFIG).forEach(keyName => {
        const key = CONFIG[keyName];
        const configItem = configItems.find(item => item.key === key);
        const status = (typeof configItem === 'undefined') ? 'missing' : 'valid';
        configStatus.push({key, status});
      });
      response.json(configStatus);
    })
    .catch(e => logAndReportError(response, 'Config.checkConfig', e));
  }

  static testImageProviderConfig(response, config) {
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

logAndReportError = (response, calledMethod, e) => {
  console.error(calledMethod, e.stack);
  response.status(500).json(e);
}
