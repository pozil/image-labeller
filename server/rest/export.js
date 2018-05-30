const db = require('../util/db.js'),
  Session = require('../util/session.js'),
  httpClient = require('request'),
	archiver = require('archiver'),
  fs = require('fs'),
  { Config, CONFIG } = require('../model/config.js');
  Image = require('../model/image.js');
  Label = require('../model/label.js');
  ObjectBox = require('../model/object-box.js');

module.exports = class ExportResource {

	constructor(app, apiRoot) {
		app.get(apiRoot +'export', this.exportZip);
	}

	async exportZip(request, response) {  
    const curSession = Session.getSession(request, response);
    if (curSession == null)
      return;

		// Generate annotations CSV
		const annotations = await getAnnotationsCsv();

		response.set({
			'Content-Type': 'application/zip',
			'Content-Disposition': 'attachment; filename="model.zip"'
		});

		const archive = archiver('zip', {
			zlib: { level: 9 } // Sets the compression level.
		});

		// Warning & error handling
		archive.on('warning', function (err) {
			if (err.code === 'ENOENT') {
				console.error(err);
				throw err;
			}
		});
		archive.on('error', function (err) {
			throw err;
		});

		// Write archive to server response
		archive.pipe(response);
		// Add annotation CSV
    archive.append(annotations, { name: 'annotations.csv' });
    await addImageFiles(archive);
		// Finalize archive
		archive.finalize();
  }
}

async function addImageFiles(archive) {
  const images = (await db.query('SELECT * FROM images')).rows;
  const imageBaseUrl = await Config.get(CONFIG.IMAGE_PROVIDER).then(config => {
    if (config !== null) {
      return 'https://res.cloudinary.com/'+ config.value.cloud_name +'/';
    }
  });

  for (let i=0; i<images.length; i++) {
    const image = images[i];
    const objectCount = (await db.query('SELECT COUNT(*) AS objectcount FROM object_boxes WHERE image_id=$1', [image.id])).rows[0].objectcount;
    if (objectCount > 0) {
      const imageUrl = imageBaseUrl + image.filename;
      let imageFilename = image.filename;
      const slashIndex = imageFilename.lastIndexOf('/');
      if (slashIndex !== -1) {
        imageFilename = imageFilename.substring(slashIndex+1);
      }
      await addRemoteUrlToArchive(archive, imageUrl, imageFilename);
    }
  }
}

function addRemoteUrlToArchive(archive, imageUrl, imageFilename) {
  return new Promise((resolve, reject) => {
    const stream = httpClient.get(imageUrl);
    archive.append(stream, { name: imageFilename});
    archive.once('entry', () => {
      return resolve();
    });
  });
}

async function getAnnotationsCsv() {
  const images = (await db.query('SELECT * FROM images')).rows;
  const labels = (await db.query('SELECT * FROM labels')).rows;
  const objectCount = (await db.query('SELECT MAX(c) AS objectcount FROM (SELECT COUNT(id) AS c FROM object_boxes GROUP BY image_id) AS objBoxes')).rows[0].objectcount;

  // Write header
  let content = 'image_url';
  for (let objIndex=0; objIndex < objectCount; objIndex++) {
    content += ',box' + objIndex;
  }
  content += '\n';

  // Write image rows
  for (let i=0; i<images.length; i++) {
    const image = images[i];
    let imageFilename = image.filename;
    const slashIndex = imageFilename.lastIndexOf('/');
    if (slashIndex !== -1) {
      imageFilename = imageFilename.substring(slashIndex+1);
    }
    content += imageFilename;
    
    const objects = (await db.query('SELECT * FROM object_boxes WHERE image_id=$1', [image.id])).rows;
    objects.forEach(object => {
      const labelData = labels.find(label => label.id === object.label_id);
      const objectData = {
        label: labelData.label,
        x: object.x,
        y: object.y,
        width: object.w,
        height: object.h
      };
      const objectDataAsString = JSON.stringify(objectData).replace(/"/g, '""');
      content += ',"'+ objectDataAsString +'"';
    });
    content += '\n';
  }

  content += '\n';
  return content;
}
