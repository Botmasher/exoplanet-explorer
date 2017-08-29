/*
Challenge:

Use what you've learned about Promises to request thumbnails in parallel but create them in the
proper order even if all the requests haven't finished.
 */

// Inline configuration for jshint below. Prevents `gulp jshint` from failing with quiz starter code.
/* jshint unused: false */

(function(document) {
  'use strict';

  var home = null;

  /**
   * Helper function to show the search query.
   * @param {String} query - The search query.
   */
  function addSearchHeader(query) {
    home.innerHTML = '<h2 class="page-title">query: ' + query + '</h2>';
  }

  /**
   * Helper function to create a planet thumbnail.
   * @param  {Object} data - The raw data describing the planet.
   */
  function createPlanetThumb(data) {
    return new Promise((resolve) => {
      var pT = document.createElement('planet-thumb');
      for (var d in data) {
        pT[d] = data[d];
      }
      home.appendChild(pT);
      resolve();
    });
  }

  /**
   * XHR wrapped in a promise
   * @param  {String} url - The URL to fetch.
   * @return {Promise}    - A Promise that resolves when the XHR succeeds and fails otherwise.
   */
  function get(url) {
    return fetch(url);
  }

  /**
   * Performs an XHR for a JSON and returns a parsed JSON response.
   * @param  {String} url - The JSON URL to fetch.
   * @return {Promise}    - A promise that passes the parsed JSON response.
   */
  function getJSON(url) {
    // hold off one img to test if parallel loading vs serial thumbing worked
    return get(url).then((response) => {
      if (url.substring('-69c') !== -1) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(response.json());
          }, 1000);
        });
      } else {
        return response.json;
      }
    });
  }

  window.addEventListener('WebComponentsReady', function() {
    home = document.querySelector('section[data-route="home"]');
    
    /* Your code goes here! */
    getJSON('../data/earth-like-results.json')
    .then((response) => {
      addSearchHeader(response.query);
      return response;
    })
    .then((response) => {
      var promises = Promise.resolve();
      var promiseArray = response.results.map((result) => {
        return getJSON(result);
      });
      promiseArray.forEach((jsonreq) => {
        promises = promises.then(() => {
          return jsonreq.then(createPlanetThumb);
        });
      });
    })
    .catch((e) => {
      console.log(e);
    });
  });
})(document);
