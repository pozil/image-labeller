// 3rd party dependencies
const httpClient = require("request"),
  path = require('path'),
  express = require('express'),
  bodyParser = require('body-parser'),
  fs = require('fs'),
  archiver = require('archiver');


/**
* Assembles the zip of available images
*/
const createZip = async (request, response) => {
  console.log('Zipping model.zip...');
  
  response.set({
    'Content-Type': 'application/zip',
    'Content-Disposition': 'attachment; filename="model.zip"'
  });
  
  
  const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
  });

  // good practice to catch warnings (ie stat failures and other non-blocking errors)
  archive.on('warning', function(err) {
    if (err.code === 'ENOENT') {
      // log warning
      console.error(err);
    } else {
      // throw error
      throw err;
    }
  });

  archive.on('error', function(err) {
    throw err;
  });

  archive.pipe(response);

  archive.directory('public/img', false);

  archive.finalize();
};

// Setup HTTP server
const app = express();
app.set('port', process.env.PORT || 8080);

// Serve HTML pages under root directory
app.use('/', express.static(path.join(__dirname, '../public')));
// Allow to parse request JSON
app.use(bodyParser.json());

// Setup REST resources
app.get('/zip', createZip);

app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
