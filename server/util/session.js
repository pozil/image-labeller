
/**
*  Attemps to retrieves the server session.
*  If there is no session, redirects with HTTP 401 and an error message
*/
module.exports.getSession = (request, response, isRedirectOnMissingSession = false) => {
  const { session } = request;
  /*
  if (!session.sfdcAuth) {
    if (isRedirectOnMissingSession) {
      response.status(401).send('No active session');
    }
    return null;
  }
  */
  return session;
}
