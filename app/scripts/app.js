/*
Instructions:
(1) Wrap an XHR in a Promise in the get() function below. See: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest
  (a) Resolve on load and reject on error.
(2) If the XHR resolves, use addSearchHeader to add the search header to the page.
(3) If the XHR fails, console.log the error and pass 'unknown' to addSearchHeader
 */

// Inline configuration for jshint below. Prevents `gulp jshint` from failing with quiz starter code.
/* jshint unused: false */

(function(document) {
  'use strict';

  var home = null;

  /**
   * Helper function to show the search query.
   * @param {String} response - The unparsed JSON response from get.
   */
  function addSearchHeader(response) {
    try {
      response = JSON.parse(response).query;  // you'll be moving this line out of here in the next quiz!
    } catch (e) {
      // it's 'unknown', so leave it alone
    }
    home.innerHTML = '<h2 class="page-title">query: ' + response + '</h2>';
  }

  /**
   * XHR wrapped in a promise.
   * @param  {String} url - The URL to fetch.
   * @return {Promise}    - A Promise that resolves when the XHR succeeds and fails otherwise.
   */
  function get(url) {
    console.log('In GET function');
    return new Promise((resolve, reject) => {   // wrap request in promise
      var req = new XMLHttpRequest();
      req.open('GET', url);
      req.onload = function() {
        if (req.status === 200) {
          resolve(req.response);    // it worked! - .then with the response text
        } else {
          reject(req.statusText);   // it failed! - .catch with the status text
        }
      };
      req.onerror = function () {
        reject('Network Error');    // failed! - pass a 'Network Error' to reject
      };
      req.send();
    });
  }

  window.addEventListener('WebComponentsReady', function() {
    home = document.querySelector('section[data-route="home"]');
    /*
    The next line starts chaining and testing!
    You'll need to add a .then and a .catch. Pass the response to addSearchHeader on resolve or
    pass 'unknown' to addSearchHeader if it rejects.
     */
    get('../data/earth-like-results.json')
    .then(responseText => console.log(`${responseText}`))
    .catch(errorText => console.log(`${errorText}`));
  });
})(document);
