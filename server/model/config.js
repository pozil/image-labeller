const db = require('../util/db.js');

module.exports = class Config {
  /**
	* Upsert a config
	*/
	static upsert(config) {
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
          return res.rows[0];
        }
      });
  }
}
