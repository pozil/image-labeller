const db = require('../util/db.js');

module.exports = class ObjectBox {
  /**
	* Create new object
	*/
	static create(object) {
		return db.query('INSERT INTO object_boxes(image_id, label_id, x, y, w, h) VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      [object.image_id, object.label_id, object.x, object.y, object.w, object.h])
      .then(res => {
        object.id = res.rows[0].id;
        return object;
      });
  }
  
  /**
	* Gets the list of objects for this image
	*/
	static getFromImage(imageId) {
		return db.query('SELECT * FROM object_boxes WHERE image_id=$1', [imageId])
      .then(res => {
        return res.rows;
      });
  }
  
  /**
  * Delete an object. Returns true if object was the last image object. In that case, image is deleted as well.
	*/
	static delete(object) {
    return db.query('DELETE FROM object_boxes WHERE id=$1', [object.id])
    .then(() => {
      return db.query('SELECT COUNT(*) as boxcount FROM object_boxes WHERE image_id=$1', [object.image_id])
    })
    .then((res) => {
      if (res.rows[0].boxcount === 0) {
        return db.query('DELETE FROM images WHERE id=$1', [object.image_id]).then(() => {
          return true;
        });
      } else {
        return false;
      }
    });
  }
  
  /**
	* Gets the number of object boxes
	*/
	static getCount() {
		return db.query('SELECT COUNT(id) FROM object_boxes')
      .then(res => {
        return res.rows[0].count;
      });
  }
}
