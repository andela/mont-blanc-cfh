/**
 * Redirect users to /#!/app (forcing Angular to reload the page)
 * @returns {void} description
 * @export
 * @param {any} req
 * @param {any} res
 */
export function play(req, res) {
  if (Object.keys(req.query)[0] === 'custom') {
    res.redirect('/#!/app?custom');
  } else {
    res.redirect('/#!/app');
  }
}

/**
 * @returns {void} description
 * @export
 * @param {any} req
 * @param {any} res
 */
export function render(req, res) {
  res.render('index', {
    user: req.user ? JSON.stringify(req.user) : 'null'
  });
}
