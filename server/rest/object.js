const ObjectBox = require('../model/object-box.js'),
  Image = require('../model/image.js');

module.exports = class ObjectResource {

	constructor(app, apiRoot) {
    const resourceUrl = apiRoot +'objects';
    app.post(resourceUrl, this.createObject);
		app.get(resourceUrl, this.getObjectsFromImage);
    app.delete(resourceUrl, this.deleteObject);
    app.get(resourceUrl+ '/count', this.getCount);
	}

	/**
	* Create new object
	*/
	createObject(request, response) {
    const box = request.body;
    // Check if box has an image id, if not create image in DB first
    if (box.image_id === null) {
      if (typeof box.image_filename === 'undefined') {
        throw new Error('Can\'t create object box on unknown image: missing image id and filename');
      }

      // Create image and get its id
      Image.create({filename: box.image_filename})
      .then(image => {
        box.image_id = image.id;
        // Create box
        ObjectBox.create(box)
        .then(object => {
          response.json(object);
        })
        .catch(e => {
          console.log(e.stack);
          response.status(500).json(e);
        });
      });
    } else {
      // Create box with existing image id
      ObjectBox.create(box)
      .then(object => {
        response.json(object);
      })
      .catch(e => {
        console.log(e.stack);
        response.status(500).json(e);
      });
    }
	}

	/**
	* Gets the list of objects for this image
	*/
	getObjectsFromImage(request, response) {
    ObjectBox.getFromImage(request.query.imageId)
      .then(objects => {
        response.json(objects);
      })
      .catch(e => {
        console.log(e.stack);
        response.status(500).json(e);
      });
	}

	/**
	* Delete object
	*/
	deleteObject(request, response) {
    ObjectBox.delete(request.body)
      .then((wasLastObject) => {
        response.json({wasLastObject: wasLastObject});
      })
      .catch(e => {
        console.log(e.stack);
        response.status(500).json(e);
      });
  }
  
  /**
	* Gets the number of objects
	*/
	getCount(request, response) {
    ObjectBox.getCount()
      .then(count => {
        response.json(count);
      })
      .catch(e => {
        console.log(e.stack);
        response.status(500).json(e);
      });
  }
}
