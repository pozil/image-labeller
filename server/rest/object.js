const Session = require('../util/session.js'),  
  ObjectBox = require('../model/object-box.js'),
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
    const curSession = Session.getSession(request, response);
    if (curSession == null)
      return;
    
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
        .catch(e => logAndReportError(response, 'ObjectBox.create', e));
      });
    } else {
      // Create box with existing image id
      ObjectBox.create(box)
      .then(object => {
        response.json(object);
      })
      .catch(e => logAndReportError(response, 'ObjectBox.create', e));
    }
	}

	/**
	* Gets the list of objects for this image
	*/
	getObjectsFromImage(request, response) {
    const curSession = Session.getSession(request, response);
    if (curSession == null)
      return;
    
    ObjectBox.getFromImage(request.query.imageId)
      .then(objects => {
        response.json(objects);
      })
      .catch(e => logAndReportError(response, 'ObjectBox.getFromImage', e));
	}

	/**
	* Delete object
	*/
	deleteObject(request, response) {
    const curSession = Session.getSession(request, response);
    if (curSession == null)
      return;
    
    ObjectBox.delete(request.body)
      .then((wasLastObject) => {
        response.json({wasLastObject: wasLastObject});
      })
      .catch(e => logAndReportError(response, 'ObjectBox.delete', e));
  }
  
  /**
	* Gets the number of objects
	*/
	getCount(request, response) {
    const curSession = Session.getSession(request, response);
    if (curSession == null)
      return;
    
    ObjectBox.getCount()
      .then(count => {
        response.json(count);
      })
      .catch(e => logAndReportError(response, 'ObjectBox.getCount', e));
  }
}

logAndReportError = (response, calledMethod, e) => {
  console.error(calledMethod, e.stack);
  response.status(500).json(e);
}
