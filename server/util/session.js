
/**
*  Attemps to retrieves the server session.
*  If there is no session, return HTTP 401 and an error message
*/
module.exports.getSession = (request, response, isRedirectOnMissingSession = true) => {
  if (typeof request.session.isAuthenticated === 'undefined') {
    if (isRedirectOnMissingSession) {
      response.status(401).send('No active session');
    }
    return null;
  }
  return request.session;
}

module.exports.setAuthenticated = (request, response) => {
  request.session.isAuthenticated = true;
}

module.exports.destroy = (request) => {
  request.session.destroy();
}
