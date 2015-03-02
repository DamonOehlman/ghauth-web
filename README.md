# ghauth-web

A lightweight github authentication mechanism that works both in single page
apps (that have been configured to work with a
[gatekeeper](https://github.com/prose/gatekeeper)) and also chrome apps using
the [`chrome.identity`](https://developer.chrome.com/apps/identity) API.


[![NPM](https://nodei.co/npm/ghauth-web.png)](https://nodei.co/npm/ghauth-web/)



## Example Usage

```js
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
var auth = require('ghauth-web')(authConfig, localStorage.token);
var h = require('hyperscript');

auth.on('token', function(token) {
  console.log('got the token value: ' + token);
});

document.body.appendChild(h('button', {
  onclick: auth.login
}, 'Login'));

```

## CLI Usage

Then you'd be looking for [`ghauth`](https://github.com/rvagg/ghauth).

## License(s)

### ISC

Copyright (c) 2015, Damon Oehlman <damon.oehlman@gmail.com>

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
