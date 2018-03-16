const db = require('../util/db.js');

module.exports = class Image {
  /**
	* Creates a image
	*/
	static create(image) {
    return db.query('INSERT INTO images(filename) VALUES($1) RETURNING id', [image.filename])
      .then(res => {
        image.id = res.rows[0].id;
        return image;
      });
  }
  
  /**
	* Gets the list of available images
	*/
	static getAll() {
    return db.query('SELECT * FROM images')
      .then(res => {
        return res.rows;
      });
  }

  /**
	* Gets image from file name
	*/
	static getFromFilename(filename) {
    return db.query('SELECT * FROM images WHERE filename=$1', [filename])
      .then(res => {
        if (res.rows.length === 0) {
          return null;
        }
        return res.rows[0];
      });
  }
  
  /**
	* Delete a image
	*/
	static delete(imageId) {
    return db.query('DELETE FROM object_boxes WHERE image_id=$1', [imageId])
      .then(res => {
        return db.query('DELETE FROM images WHERE id=$1', [imageId]);
      });
  }
  
  /**
	* Gets the number of images
	*/
	static getCount() {
		return db.query('SELECT COUNT(id) FROM images')
      .then(res => {
        return res.rows[0].count;
      });
  }
}
