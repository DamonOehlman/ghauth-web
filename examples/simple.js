var authConfig = {
  web: {
    clientId: 'foobar',
    gatekeeper: 'http://foobar.gatekeeper.com/authenticate/'
  },

  app: {
    clientId: 'foobar2',
    secret: 'foobarsecret'
  }
};

// initialise auth, passing the current token value stored in localStorage
// NOTE: localStorage doesn't work directly in chrome apps (you need chrome.storage.local)
var auth = require('..')(authConfig, localStorage.token);
var h = require('hyperscript');

auth.on('token', function(token) {
  console.log('got the token value: ' + token);
});

document.body.appendChild(h('button', {
  onclick: auth.login
}, 'Login'));
