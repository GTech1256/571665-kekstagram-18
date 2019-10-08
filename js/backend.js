'use strict';

(function () {

  /* CONSTANTS */

  var TIMEOUT = 10000; // 10s
  var RESPONSE_TYPE = 'json';
  var API_LINK = {
    picture: 'https://js.dump.academy/kekstagram/data',
  };
  var METHOD = {
    get: 'GET',
    post: 'POST'
  };


  /* FUNCTIONS */

  /**
   * Создает инстанс XHR с обработчиками и делает запрос
   *
   * @param {function(*): void} onLoad
   * @param {function(string): void} onError
   * @param {string} url путь HTTP
   * @param {('GET'|'POST')} method Метод HTTP
   * @param {*} [data] данные HTTP
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
   */
  function loadPictures(onLoad, onError) {
    makeXHR(onLoad, onError, API_LINK.picture, METHOD.get);
  }

  /**
   * @param {FormData} data
   * @param {function(*): void} onLoad
   * @param {function(string): void} onError
   */
  // function save(data, onLoad, onError) {
  //   makeXHR(onLoad, onError, API_LINK.formSetupSend, METHOD.post, data);
  // }

  /* EXPORT */

  window.backend = {
    loadPictures: loadPictures,
    // save: save
  };
})();
