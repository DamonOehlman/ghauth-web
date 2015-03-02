var xhr = require('xhr');
var EventEmitter = require('events').EventEmitter;

/**
  # ghauth-web

  A lightweight github authentication mechanism that works both in single page
  apps (that have been configured to work with a
  [gatekeeper](https://github.com/prose/gatekeeper)) and also chrome apps using
  the [`chrome.identity`](https://developer.chrome.com/apps/identity) API.

  ## Example Usage

  <<< examples/fake.js
**/
module.exports = function(config, token) {
  var isApp = typeof chrome != 'undefined' && chrome.identity;
  var subcfg = (config || {})[isApp ? 'app' : 'web'] || {};
  var url = require('url').parse(location.href, true);
  var auth = new EventEmitter();

  function buildUrl() {
    var scopes = (config || {}).scopes || [];
    var parts = [
      'https://github.com/login/oauth/authorize?client_id=' + subcfg.clientId,
    ].concat(scopes.map(createScopeParam));

    function createScopeParam(scope) {
      return 'scope=' + scope;
    }

    if (isApp) {
      parts.push('redirect_url=' + chrome.identity.getRedirectURL('provider_cb'));
    }

    return parts.join('&');
  }

  function resolveCode(code) {
    var xhrOpts = {
      uri: [
        'https://github.com/login/oauth/access_token?client_id=' + subcfg.clientId,
        'client_secret=' + subcfg.secret,
        'redirect_uri=' + chrome.identity.getRedirectURL('provider_cb'),
        'code=' + code
      ].join('&'),
      json: true,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    xhr(xhrOpts, function(err, resp, body) {
      if (err) {
        return auth.emit('error', err);
      }

      auth.emit('token', body.access_token);
    });
  }

  function resolveGatekeeperCode(code) {
    var xhrOpts = {
      uri: subcfg.gatekeeper + code,
      json: true
    };

    xhr(xhrOpts, function(err, res, body) {
      if (err) {
        return auth.emit.error(err);
      }

      auth.emit('token', body.token);
    });
  }

  function configOk() {
    // check the configuration
    if (isApp) {
      if (! subcfg.clientId) {
        return invalid('A valid clientId is required for config.app.clientId');
      }

      if (! subcfg.secret) {
        return invalid('A valid secret is required for config.app.secret');
      }
    }
    else {
      if (! subcfg.clientId) {
        return invalid('A valid clientId is required for config.web.clientId');
      }

      if (! subcfg.gatekeeper) {
        return invalid('A gatekeeper configuration is required for config.web.gatekeeper (see prose/gatekeeper)');
      }
    }

    return true;
  }

  function invalid(message) {
    auth.emit('error', new Error(message));
    return false;
  }

  auth.login = function() {
    if (! configOk()) {
      return;
    }

    if (isApp) {
      chrome.identity.launchWebAuthFlow({ url: buildUrl(), interactive: true }, function(redirectUrl) {
        if (chrome.runtime.lastError) {
          return auth.emit.error(new Error(chrome.runtime.lastError));
        }

        resolveCode(require('url').parse(redirectUrl, true).query.code);
      });

      return;
    }

    return window.location = buildUrl();
  };

  // if we are not an app, do not already have a token and have been supplied a code query param authenticate
  if ((! isApp) && (! token) && url.query.code) {
    resolveGatekeeperCode(url.query.code);
  }

  return auth;
};
