const Session = require('../util/session.js'),
  Config = require('../model/config.js');

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
          Session.setAuthenticated(request, response);
          response.status(204).send();
        } else {
          response.status(401).send('Invalid credentials');
        }
      })
      .catch(e => {
        console.error(e.stack);
        response.status(500).json(e);
      });
  }
  
	isAuthenticated(request, response) {
    const session = Session.getSession(request, response, false);
    response.json({isAuthenticated: (session !== null)});
  }
  
  logout(request, response) {
    Session.destroy(request);
    response.status(204).send();
  }
}
