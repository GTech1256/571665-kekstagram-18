'use strict';

(function () {

  /* CONSTANTS */

  var ESC_KEYCODE = 27;
  var MINUS_KEYCODE = 109;
  var PLUS_KEYCODE = 107;
  var CORRECT_FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png', 'wepb'];
  var CLASS_HIDDEN = 'hidden';

  /* FUNCTIONS */

  /**
   * @param {number} min
   * @param {number} max
   * @param {number} percent > 0 && < 100
   * @param {number} percentMax
   * @return {number} значения между min и max по percent
   * @example getValueBetweenByPercent(1, 2, 50) === 1.5
   */
  var getValueBetweenByPercent = function (min, max, percent, percentMax) {
    return ((max - min) / percentMax * percent) + min;
  };

  /**
   * Проверяет является ли элемент target вводом данных
   *
   * @param {Event} evt
   * @return {boolean}
   */
  var checkIsTargetInput = function (evt) {
    var targetIsInput = evt.target.name || evt.target.tagName === 'INPUT';

    return evt.target && targetIsInput && !evt.target.readOnly && evt.target.getAttribute('type') !== 'file';
  };

  /**
     * Проверяет на нажатие ESC и target !== <input> as HTMLNode
     *
     * @param {KeyboardEvent} evt
     * @return {boolean}
     */
  var checkIsKeydownEscEvent = function (evt) {
    return (evt.keyCode === ESC_KEYCODE && !checkIsTargetInput(evt));
  };

  /**
     * Вызывает callback с переданным KeyboardEvent в 1 параметре, если был нажат ESC
     *
     * @param {Function} cb
     * @return {function(KeyboardEvent):void}
     */
  var getKeydownEscEventWrapper = function (cb) {
    return function (evt) {
      if (checkIsKeydownEscEvent(evt)) {
        cb(evt);
      }
    };
  };


  /**
   * количество элементов должно быть больше count
   * @param {Array} elements
   * @param {number} count
   * @return {Array}
   */
  var getRandomElements = function (elements, count) {
    var res = [];
    var localElements = elements.slice();

    for (var i = 0; i < count; i++) {
      res.push(
          localElements.splice(Math.floor(Math.random() * localElements.length - 1), 1)[0]
      );
    }

    return res;
  };

  /**
   * @param {Blob} blobFile
   * @param {function(string): void} loadHandler
   * @param {function(string): void} errorHandler
   */
  var readBlobFile = function (blobFile, loadHandler, errorHandler) {
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
  };


  /* EXPORT */

  window.utils = {
    getValueBetweenByPercent: getValueBetweenByPercent,
    checkIsKeydownEscEvent: checkIsKeydownEscEvent,
    getKeydownEscEventWrapper: getKeydownEscEventWrapper,
    MINUS_KEYCODE: MINUS_KEYCODE,
    PLUS_KEYCODE: PLUS_KEYCODE,
    getRandomElements: getRandomElements,
    readBlobFile: readBlobFile,
    CLASS_HIDDEN: CLASS_HIDDEN
  };

})();

