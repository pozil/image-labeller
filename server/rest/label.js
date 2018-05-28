const Label = require('../model/label.js'),
  Session = require('../util/session.js');

module.exports = class LabelResource {

	constructor(app, apiRoot) {
    const resourceUrl = apiRoot +'labels';
		app.post(resourceUrl, this.createLabel);
    app.get(resourceUrl, this.getLabels);
    app.get(resourceUrl + '/useCount', this.getUseCount);
    app.put(resourceUrl, this.updateLabel);
    app.delete(resourceUrl, this.deleteLabel);
    app.get(resourceUrl+ '/count', this.getCount);
	}

	/*
	* Create new label
	*/
	createLabel(request, response) {
    const curSession = Session.getSession(request, response);
    if (curSession == null)
      return;
    
    Label.create(request.body)
      .then(label => {
        response.json(label);
      })
      .catch(e => logAndReportError('Label.create', e));
	}

	/**
	* Gets the list of available labels
	*/
	getLabels(request, response) {
    const curSession = Session.getSession(request, response);
    if (curSession == null)
      return;
    
    Label.getAll()
      .then(labels => {
        response.json(labels);
      })
      .catch(e => logAndReportError('Label.getAll', e));
  }

  /**
	* Gets the number of objects using a label
	*/
	getUseCount(request, response) {
    const curSession = Session.getSession(request, response);
    if (curSession == null)
      return;
    
    if (typeof request.query.labelId === 'undefined') {
      // ALl labels
      Label.getUseCountForAll()
      .then(useCounts => {
        response.json(useCounts);
      })
      .catch(e => logAndReportError('Label.getUseCountForAll', e));
    } else {
      // Specific label
      Label.getUseCount(request.query.labelId)
      .then(count => {
        response.json(count);
      })
      .catch(e => logAndReportError('Label.getUseCount', e));
    }
  }

  /*
	* Update label
	*/
	updateLabel(request, response) {
    const curSession = Session.getSession(request, response);
    if (curSession == null)
      return;
    
    Label.update(request.body)
      .then(() => {
        response.status(200).send();
      })
      .catch(e => logAndReportError('Label.update', e));
	}

  /*
	* Delete label
	*/
	deleteLabel(request, response) {
    const curSession = Session.getSession(request, response);
    if (curSession == null)
      return;
    
    Label.delete(request.body.id)
      .then(() => {
        response.status(200).send();
      })
      .catch(e => logAndReportError('Label.delete', e));
  }
  
  /**
	* Gets the number of labels
	*/
	getCount(request, response) {
    const curSession = Session.getSession(request, response);
    if (curSession == null)
      return;
    
    Label.getCount()
      .then(count => {
        response.json(count);
      })
      .catch(e => logAndReportError('Label.getCount', e));
  }

  static logAndReportError(calledMethod, e) {
    console.error(calledMethod, e.stack);
    response.status(500).json(e);
  }
}
