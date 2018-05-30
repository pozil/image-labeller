const Session = require('../util/session.js'),
  { Config } = require('../model/config.js');

module.exports = class AuthResource {

	constructor(app, apiRoot) {
    const resourceUrl = apiRoot +'auth';
    app.post(resourceUrl, this.login);
    app.get(resourceUrl, this.isAuthenticated);
    app.delete(resourceUrl, this.logout);
	}

	login(request, response) {
    Config.authenticate(request.body)
      .then(isAuthenticated => {
        if (isAuthenticated) {
          Session.setAuthenticated(request);
          response.status(204).send();
        } else {
          response.status(401).send('Invalid credentials');
        }
      })
      .catch(e => logAndReportError(response, 'Auth.login', e));
  }
  
	isAuthenticated(request, response) {
    // Check for session
    const session = Session.getSession(request, response, false);
    if (session !== null) {
      return response.json({isAuthenticated: true});
    }
    // Auto authenticate user if app is not yet configured
    Config.getAll().then(configItems => {
      const isAuthenticated = (configItems.length === 0);
      if (isAuthenticated) {
        Session.setAuthenticated(request);
      }
      return response.json({isAuthenticated});
    });
  }
  
  logout(request, response) {
    Session.destroy(request);
    response.status(204).send();
  }
}

logAndReportError = (response, calledMethod, e) => {
  console.error(calledMethod, e.stack);
  response.status(500).json(e);
}
