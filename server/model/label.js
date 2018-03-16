const db = require('../util/db.js');

module.exports = class Label {
  /**
	* Creates a label
	*/
	static create(label) {
    return db.query('INSERT INTO labels(label) VALUES($1) RETURNING id', [label.label])
      .then(res => {
        label.id = res.rows[0].id;
        return label;
      });
  }
  
  /**
	* Gets the list of available labels
	*/
	static getAll(request, response) {
    return db.query('SELECT * FROM labels')
      .then(res => {
        return res.rows;
      });
  }

  /**
	* Updates a label
	*/
	static update(label) {
    return db.query('UPDATE labels SET label=$1 WHERE id=$2', [label.label, label.id]);
  }
  
  /**
	* Delete a label
	*/
	static delete(labelId) {
    return db.query('DELETE FROM object_boxes WHERE label_id=$1', [labelId])
      .then(() => {
        return db.query('DELETE FROM labels WHERE id=$1', [labelId]).
        then(() => {
          return db.query('DELETE FROM images WHERE id NOT IN (SELECT DISTINCT image_id FROM object_boxes);');
        });
      });
  }
  
  /**
	* Gets the number of objects using a label
	*/
	static getUseCount(labelId) {
		return db.query('SELECT COUNT(id) FROM object_boxes WHERE label_id=$1', [labelId])
      .then(res => {
        return res.rows[0];
      });
  }

  /**
	* Gets the number of objects for all labels
	*/
	static getUseCountForAll() {
		return db.query('SELECT COUNT(id), label_id FROM object_boxes GROUP BY label_id')
      .then(res => {
        return res.rows;
      });
  }

  /**
	* Gets the number of labels
	*/
	static getCount() {
		return db.query('SELECT COUNT(id) FROM labels')
      .then(res => {
        return res.rows[0].count;
      });
  }
}
