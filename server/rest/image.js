const db = require('../util/db.js'),
	fs = require('fs'),
  cloudinary = require('cloudinary'),
  Image = require('../model/image.js');

module.exports = class ImageResource {

	constructor(app, apiRoot) {
    const resourceUrl = apiRoot +'images';
    app.get(resourceUrl, this.getFromFilename);
    app.get(resourceUrl +'/count', this.getCount);
    app.get(resourceUrl +'/cloudinary', this.getImagesFromCloudinary);
	}

  getImagesFromCloudinary(request, response) {
    const params = {};
    if (typeof request.query.next_cursor !== 'undefined') {
      params.next_cursor = request.query.next_cursor;
    }
    cloudinary.v2.api.resources(params, (error, result) => {
      if (error) {
        console.error(error);
        response.status(500).json(error);
        return;
      }
      response.json(result);
    });
  }

  getFromFilename(request, response) {
    Image.getFromFilename(request.query.filename)
      .then(image => {
        response.json({image});
      })
      .catch(e => {
        console.log(e.stack);
        response.status(500).json(e);
      });
  }

	/**
	* Gets the list of available images from filesystem
  */
/*
	getImagesFromFS(request, response) {
		// Get images from file system
		const fsImages = [];
		fs.readdirSync('public/img/').forEach(file => {
			if (/.*\.(png|jpg|jpeg)$/im.test(file))
				fsImages.push(file);
		});
		// Get DB images
    db.connect()
			.then(client => {
				return client.query('SELECT * FROM images')
					.then(res => {
						const dbImages = res.rows;

						// Get new images (the ones that are not id DB)
						const newImages = [];
						fsImages.forEach(imageFile => {
              const dbImage = dbImages.find(dbImage => dbImage.file === imageFile);
							if (typeof dbImage === 'undefined') {
                newImages.push([imageFile]);
              }
						});

						// Check for new images
						if (newImages.length === 0) {
							client.release();
							response.json(dbImages);
							return;
						}
						else { // Create new images in DB
							const insertImagesSql = format('INSERT INTO images (file) VALUES %L', newImages);
							client.query(insertImagesSql)
								.then(res => {
									// Return all images from DB
									return client.query('SELECT * FROM images')
										.then(res => {
											client.release();
											response.json(res.rows);
											return;
										})
										.catch(e => {
											client.release();
											console.log(e.stack);
											response.status(500).json(e);
										});
								})
								.catch(e => {
									client.release();
									console.log(e.stack);
									response.status(500).json(e);
								});
						}

					})
					.catch(e => {
						client.release();
						console.log(e.stack);
						response.status(500).json(e);
					});
			});
  }
*/
  
  /**
	* Gets the number of images
	*/
	getCount(request, response) {
    Image.getCount()
      .then(count => {
        response.json(count);
      })
      .catch(e => {
        console.log(e.stack);
        response.status(500).json(e);
      });
  }
}
