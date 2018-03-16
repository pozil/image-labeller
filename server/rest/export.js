const db = require('../util/db.js'),
	archiver = require('archiver'),
  fs = require('fs'),
  Image = require('../model/image.js');
  Label = require('../model/label.js');
  ObjectBox = require('../model/object-box.js');

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

module.exports = class ExportResource {

	constructor(app, apiRoot) {
		app.get(apiRoot +'export', this.exportZip);
	}

	async exportZip(request, response) {
		
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
    //archive.directory('public/img', false);
		// Finalize archive
		archive.finalize();
	}
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
    content += image.filename;
    
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
