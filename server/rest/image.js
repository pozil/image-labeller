const Session = require('../util/session.js'),
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
    const curSession = Session.getSession(request, response);
    if (curSession == null)
      return;
    
    const params = {};
    if (typeof request.query.next_cursor !== 'undefined') {
      params.next_cursor = request.query.next_cursor;
    }
    if (typeof request.query.max_results !== 'undefined') {
      params.max_results = request.query.max_results;
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
    const curSession = Session.getSession(request, response);
    if (curSession == null)
      return;
    
    Image.getFromFilename(request.query.filename)
      .then(image => {
        response.json({image});
      })
      .catch(e => logAndReportError(response, 'Image.getFromFilename', e));
  }
  
  /**
	* Gets the number of images
	*/
	getCount(request, response) {
    const curSession = Session.getSession(request, response);
    if (curSession == null)
      return;
    
    Image.getCount()
      .then(count => {
        response.json(count);
      })
      .catch(e => logAndReportError(response, 'Image.getCount', e));
  }
}

logAndReportError = (response, calledMethod, e) => {
  console.error(calledMethod, e.stack);
  response.status(500).json(e);
}
