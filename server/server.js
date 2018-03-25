// 3rd party dependencies
const db = require('./util/db.js'),
	path = require('path'),
  express = require('express'),
  session = require('express-session'),
  pgSession = require('connect-pg-simple')(session),
	bodyParser = require('body-parser');

const Config = require('./model/config.js'),
  ExportResource = require('./rest/export.js'),
	ObjectResource = require('./rest/object.js'),
	LabelResource = require('./rest/label.js'),
  ImageResource = require('./rest/image.js'),
  ConfigResource = require('./rest/config.js');

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

// Setup HTTP server
const app = express();
app.set('port', process.env.PORT || 8080);

// Enable server-side sessions
const isHttps = (typeof process.env.HTTPS === 'undefined') ? true : (process.env.HTTPS.toLowerCase() === 'true');
app.use(session({
  store: new pgSession({ pool : db.getPool() }),
  secret: process.env.SESSION_SECRET_KEY,
  cookie: {
    secure: isHttps,
    maxAge: 2 * 60 * 60 * 1000 // 2 hours
  },
  resave: false,
  saveUninitialized: false
}));

// Serve HTML pages under root directory
app.use('/', express.static(path.join(__dirname, '../public')));
// Allow to parse JSON
app.use(bodyParser.json());

// Setup REST resources
const apiRoot = '/api/';
new ObjectResource(app, apiRoot);
new ImageResource(app, apiRoot);
new LabelResource(app, apiRoot);
new ExportResource(app, apiRoot);
new ConfigResource(app, apiRoot);

// Load configuration
Config.get('imageProvider').then(config => {
  if (config !== null) {
    const cloudinary = require('cloudinary');
    cloudinary.config(config.value);
  }
});

// Start HTTP server
app.listen(app.get('port'), function () {
	console.log('Server started: http://localhost:' + app.get('port') + '/');
});
