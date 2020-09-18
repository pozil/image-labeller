// 3rd party dependencies
const db = require('./util/db.js'),
	path = require('path'),
  express = require('express'),
  expressSession = require('express-session'),
  pgSession = require('connect-pg-simple')(expressSession),
	bodyParser = require('body-parser'),
  cloudinary = require('cloudinary');

const { Config, CONFIG } = require('./model/config.js'),
  ExportResource = require('./rest/export.js'),
	ObjectResource = require('./rest/object.js'),
	LabelResource = require('./rest/label.js'),
  ImageResource = require('./rest/image.js'),
  ConfigResource = require('./rest/config.js'),
  AuthResource = require('./rest/auth.js');

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

// Setup HTTP server
const app = express();
app.set('port', process.env.PORT || 8080);

// Enable server-side sessions
const isHttps = (typeof process.env.HTTPS === 'undefined') ? true : (process.env.HTTPS.toLowerCase() === 'true');
app.use(expressSession({
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
new AuthResource(app, apiRoot);

// Load configuration
Config.getAll()
  .then(configItems => {
    console.log('Config loaded', JSON.stringify(configItems));

    if (configItems.length === 0) {
      console.warn('Configuration is not set (first time start?)');
    }
    else {
      // Init image provider
      const imageProvider = configItems.find(item => item.key === CONFIG.IMAGE_PROVIDER);
      if (typeof imageProvider !== 'undefined') {
        console.log('Loading image provider...');
        cloudinary.config(imageProvider.value);
      }
    }
  })
  .catch(error => {
    console.error('Failed to load configuration');
    console.error(error);
    process.exit(-1);
  });

// Start HTTP server
app.listen(app.get('port'), () => {
	console.log('Server started on port ' + app.get('port'));
});
