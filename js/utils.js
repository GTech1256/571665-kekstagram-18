'use strict';

(function () {

  /* CONSTANTS */

  var ESC_KEYCODE = 27;
  var MINUS_KEYCODE = 109;
  var PLUS_KEYCODE = 107;
  var ENTER_KEYCODE = 13;
  var errorClassName = '.error';


  /* VARIABLES */

  var errorTemplate = document.querySelector('#error').content;
  var errorNode = document.querySelector(errorClassName);


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
    return evt.target && (evt.target.name || evt.target.tagName === 'INPUT');
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
     * @return {function(KeyboardEvent)}
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
    errorNode = document.querySelector(errorClassName);
  }

  /**
   * @param {string} errorMessage
   */
  function setErrorNodeMessage(errorMessage) {
    errorNode.querySelector('.error__title').textContent = errorMessage;
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
    showErrorMessage: showErrorMessage
  };
})();

