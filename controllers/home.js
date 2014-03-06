/**
 * GET /
 * Home page.
 */

exports.index = function(req, res) {
  res.sendfile('src/index.html');
};
