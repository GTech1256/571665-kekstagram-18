'use strict';

(function () {

  /* CONSTANTS */

  var TIMEOUT = 10000; // 10s
  var RESPONSE_TYPE = 'json';
  var API_LINK_MAP = {
    picture: 'https://js.dump.academy/kekstagram/data',
    form: 'https://js.dump.academy/kekstagram',
  };
  var METHOD = {
    get: 'GET',
    post: 'POST'
  };


  /* VARIABLES */

  var cachedPictures = {
    lastUpdate: -1,
    data: []
  };


  /* FUNCTIONS */

  /**
   * Создает инстанс XHR с обработчиками и делает запрос
   *
   * @param {function(*): void} onLoad
   * @param {function(string): void} onError
   * @param {string} url путь HTTP
   * @param {('GET'|'POST')} method Метод HTTP
   * @param {FormData} [data]
   */
  function makeXHR(onLoad, onError, url, method, data) {
    var xhr = new XMLHttpRequest();

    XMLHttpRequest.responseType = RESPONSE_TYPE;
    xhr.timeout = TIMEOUT; // 10s

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(JSON.parse(xhr.response));
        return;
      }

      onError('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.open(method, url);
    xhr.send(data);
  }

  /**
   * @param {function(*): void} onLoad
   * @param {function(string): void} onError
   * @param {boolean} isUseCachedData
   */
  function getPictures(onLoad, onError, isUseCachedData) {
    if (isUseCachedData && cachedPictures.lastUpdate > 0) {
      onLoad(cachedPictures.data);
      return;
    }

    makeXHR(
        function (pictures) {
          cachedPictures = {
            lastUpdate: new Date().getTime(),
            data: pictures
          };

          onLoad(cachedPictures.data);
        },
        onError,
        API_LINK_MAP.picture,
        METHOD.get
    );
  }

  /**
   * @param {function(*): void} onLoad
   * @param {function(string): void} onError
   * @param {FormData} data
   */
  function sendForm(onLoad, onError, data) {
    makeXHR(onLoad, onError, API_LINK_MAP.form, METHOD.post, data);
  }

  /* EXPORT */

  window.backend = {
    getPictures: getPictures,
    sendForm: sendForm
  };
})();
