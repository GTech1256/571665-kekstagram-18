'use strict';

(function () {

  /* CONSTANTS */

  var ESC_KEYCODE = 27;
  var MINUS_KEYCODE = 109;
  var PLUS_KEYCODE = 107;
  var ENTER_KEYCODE = 13;
  var CORRECT_FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png', 'wepb'];
  var ERROR_CLASS_NAME = '.error';


  /* VARIABLES */

  var errorTemplate = document.querySelector('#error').content;
  var errorNode = document.querySelector(ERROR_CLASS_NAME);


  /* FUNCTIONS */

  /**
   * @param {number} min
   * @param {number} max
   * @return {number}
   */
  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * @param {*[]} array
   * @return {*}
   */
  function getRandomValueFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * @param {number} min
   * @param {number} max
   * @param {number} percent > 0 && < 100
   * @param {number} percentMax
   * @return {number} значения между min и max по percent
   * @example getValueBetweenByPercent(1, 2, 50) === 1.5
   */
  function getValueBetweenByPercent(min, max, percent, percentMax) {
    return ((max - min) / percentMax * percent) + min;
  }

  /**
   * Проверяет является ли элемент target вводом данных
   *
   * @param {Event} evt
   * @return {boolean}
   */
  function isTargetInput(evt) {
    var targetIsInput = evt.target.name || evt.target.tagName === 'INPUT';

    return evt.target && targetIsInput && evt.target.getAttribute('type') !== 'file';
  }

  /**
     * Проверяет на нажатие ESC и target !== <input> as HTMLNode
     *
     * @param {KeyboardEvent} evt
     * @return {boolean}
     */
  function isKeydownEscEvent(evt) {
    return (evt.keyCode === ESC_KEYCODE && !isTargetInput(evt));
  }

  /**
     * Вызывает callback с переданным KeyboardEvent в 1 параметре, если был нажат ESC
     *
     * @param {Function} cb
     * @return {function(KeyboardEvent):void}
     */
  function keydownEscEventWrapper(cb) {
    return function (evt) {
      if (isKeydownEscEvent(evt)) {
        cb(evt);
      }
    };
  }

  /**
   * Вызывает callback с переданным Event в 1 параметре, если был нажат Enter
   *
   * @param {Function} callback
   * @return {function(Event)}
   */
  function keydownEnterEventWrapper(callback) {
    return function (evt) {
      if (evt.keyCode === ENTER_KEYCODE) {
        callback(evt);
      }
    };
  }

  /**
   * @param {string} errorMessage
   */
  function showErrorMessage(errorMessage) {
    if (!errorNode) {
      renderErrorNode();
    }

    setErrorNodeMessage(errorMessage);
  }

  function renderErrorNode() {
    var errorCloneNode = errorTemplate.cloneNode(true);

    document.body.appendChild(errorCloneNode);
    errorNode = document.querySelector(ERROR_CLASS_NAME);
  }

  /**
   * @param {string} errorMessage
   */
  function setErrorNodeMessage(errorMessage) {
    errorNode.querySelector('.error__title').textContent = errorMessage;
  }

  /**
   * количество элементов должно быть больше count
   * @param {Array} elements
   * @param {number} count
   * @return {Array}
   */
  function getRandomElements(elements, count) {
    var res = [];
    var localElements = elements.slice();

    for (var i = 0; i < count; i++) {
      res.push(
          localElements.splice(Math.floor(Math.random() * localElements.length - 1), 1)[0]
      );
    }

    return res;
  }

  /**
   * @param {Blob} blobFile
   * @param {function(string): void} loadHandler
   * @param {function(string): void} errorHandler
   */
  function readBlobFile(blobFile, loadHandler, errorHandler) {
    var fileName = blobFile.name.toLowerCase();

    var isCorrectFileType = CORRECT_FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });


    if (!isCorrectFileType) {
      errorHandler('Формат файла не подходит, нужен один из следующих: ' + CORRECT_FILE_TYPES.join(', '));
      return;
    }
    var reader = new FileReader();

    reader.onload = function () {
      loadHandler(reader.result);
    };

    reader.onerror = function () {
      errorHandler(reader.error.message);
    };

    reader.readAsDataURL(blobFile);
  }


  /* EXPORT */

  window.utils = {
    getRandomIntInclusive: getRandomIntInclusive,
    getRandomValueFromArray: getRandomValueFromArray,
    getValueBetweenByPercent: getValueBetweenByPercent,
    isKeydownEscEvent: isKeydownEscEvent,
    keydownEscEventWrapper: keydownEscEventWrapper,
    keydownEnterEventWrapper: keydownEnterEventWrapper,
    MINUS_KEYCODE: MINUS_KEYCODE,
    PLUS_KEYCODE: PLUS_KEYCODE,
    showErrorMessage: showErrorMessage,
    getRandomElements: getRandomElements,
    readBlobFile: readBlobFile
  };
})();

