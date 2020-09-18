const db = require('../util/db.js');
const bcrypt = require('bcrypt');

const CONFIG = Object.freeze({
  AUTHENTICATION: 'authentication',
  IMAGE_PROVIDER: 'imageProvider',
});

module.exports.CONFIG = CONFIG;

module.exports.Config = class {
  /**
	* Upsert a config
	*/
	static upsert(config) {
    // Hash password before saving it
    if (config.key === CONFIG.AUTHENTICATION) {
      config.value.password = bcrypt.hashSync(config.value.password, 10);
    }

    return db.query('INSERT INTO config(key, value) VALUES($1, $2) ON CONFLICT ON CONSTRAINT config_pkey DO UPDATE SET value=$2',
      [config.key, JSON.stringify(config.value)])
      .then(res => {
        return config;
      });
	}

	/**
	* Gets a config based on its key. Returns null is none is set.
	*/
	static get(key) {
    return db.query('SELECT key, value FROM config WHERE key=$1', [key])
      .then(res => {
        if (res.rows.length === 0) {
          return null;
        } else {
          let config = res.rows[0];
          switch (config.key) {
            case CONFIG.AUTHENTICATION:
              config.value.password = ''; // Never return the password
            break;
            default:
            break;
          }
          return config;
        }
      });
  }

  /**
	* Gets all config data as an array. Returns empty array is none is set.
	*/
	static getAll() {
    return db.query('SELECT key, value FROM config')
      .then(res => {
        return res.rows.map(item => {
          let updatedItem = item;
          switch (item.key) {
            case CONFIG.AUTHENTICATION:
              updatedItem.value.password = ''; // Never return the password
            break;
            default:
            break;
          }
          return updatedItem;
        });
      })
      .catch(error => {
        console.error('Failed to load configuration');
        console.error(error);
      })
  }

  /**
  * Performs authentication with user credentials
  * Returns true if authentication succeeded else false
  */
  static authenticate(credentials) {
    return db.query('SELECT key, value FROM config WHERE key=$1', [CONFIG.AUTHENTICATION])
      .then(res => {
        if (res.rows.length === 0) {
          return false;
        }
        let authConfig = res.rows[0].value;
        if (credentials.username !== authConfig.username) {
          return false;
        }
        return bcrypt.compare(credentials.password, authConfig.password)
          .then(result => {
            return result;    
          });
      });
  }
}
