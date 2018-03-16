const Label = require('../model/label.js');

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
    Label.create(request.body)
      .then(label => {
        response.json(label);
      })
      .catch(e => {
        console.log(e.stack);
        response.status(500).json(e);
      });
	}

	/**
	* Gets the list of available labels
	*/
	getLabels(request, response) {
    Label.getAll()
      .then(labels => {
        response.json(labels);
      })
      .catch(e => {
        console.log(e.stack);
        response.status(500).json(e);
      });
  }

  /**
	* Gets the number of objects using a label
	*/
	getUseCount(request, response) {
    if (typeof request.query.labelId === 'undefined') {
      // ALl labels
      Label.getUseCountForAll()
      .then(useCounts => {
        response.json(useCounts);
      })
      .catch(e => {
        console.log(e.stack);
        response.status(500).json(e);
      });
    } else {
      // Specific label
      Label.getUseCount(request.query.labelId)
      .then(count => {
        response.json(count);
      })
      .catch(e => {
        console.log(e.stack);
        response.status(500).json(e);
      });
    }
  }

  /*
	* Update label
	*/
	updateLabel(request, response) {
    Label.update(request.body)
      .then(() => {
        response.status(200).send();
      })
      .catch(e => {
        console.log(e.stack);
        response.status(500).json(e);
      });
	}

  /*
	* Delete label
	*/
	deleteLabel(request, response) {
    Label.delete(request.body.id)
      .then(() => {
        response.status(200).send();
      })
      .catch(e => {
        console.log(e.stack);
        response.status(500).json(e);
      });
  }
  
  /**
	* Gets the number of labels
	*/
	getCount(request, response) {
    Label.getCount()
      .then(count => {
        response.json(count);
      })
      .catch(e => {
        console.log(e.stack);
        response.status(500).json(e);
      });
  }
}
