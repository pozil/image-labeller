const db = require('../util/db.js');
const bcrypt = require('bcrypt');

const AUTHENTICATION = 'authentication';

module.exports = class Config {
  /**
	* Upsert a config
	*/
	static upsert(config) {
    // Hash password before saving it
    if (config.key === AUTHENTICATION) {
      config.value.password = bcrypt.hashSync(config.value.password, 10);
    }

    return db.query('INSERT INTO config(key, value) VALUES($1, $2) ON CONFLICT ON CONSTRAINT config_pkey DO UPDATE SET value=$2',
      [config.key, JSON.stringify(config.value)])
      .then(res => {
        return config;
      });
	}

	/**
	* Gets a config based on its key. Returns a new config is none is set.
	*/
	static get(key) {
    return db.query('SELECT key, value FROM config WHERE key=$1', [key])
      .then(res => {
        if (res.rows.length === 0) {
          return null;
        } else {
          let config = res.rows[0];
          switch (key) {
            case AUTHENTICATION:
              config.value.password = ''; // Never return the password to the client
            break;
            default:
            break;
          }
          return config;
        }
      });
  }

  /**
  * Performs authentication with user credentials
  * Returns true if authentication succeeded else false
  */
  static authenticate(credentials) {
    return db.query('SELECT key, value FROM config WHERE key=$1', [AUTHENTICATION])
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
