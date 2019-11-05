'use strict';

/**
 * @typedef VALIDATION_SCHEMA_ELEMENT
 * @property {string} description
 * @property {function(string, number=, Array=):boolean} validateIt Проходит ли проверку
 */

/**
 * @typedef {Object<string, VALIDATION_SCHEMA_ELEMENT>} VALIDATION_SCHEMA
 */

(function () {

  /* CONSTANTS */

  var HASHTAGS_MAXIMUM_LENGTH = 5;
  var ONE_HASHTAG_MAXIMUM_LENGTH = 20;
  var COMMENT_MAXIMUM_LENGTH = 140;
  var CLEAR_CUSTOM_VALIDITY_VALUE = '';
  var INCORRECT_INPUT_OUTLINE_VALUE = '3px solid red';
  var CORRECT_INPUT_OUTLINE_VALUE = '0px solid red';
  /** @type {VALIDATION_SCHEMA} */
  var DESCRIPTION_VALIDATION_SCHEMA = {
    tooLong: {
      description: 'Длина комментария не может составлять больше 140 символов',
      validateIt: function (payload) {
        return payload.length <= COMMENT_MAXIMUM_LENGTH;
      }
    }
  };
  /** @type {VALIDATION_SCHEMA} */
  var HASHTAG_VALIDATION_SCHEMA = {
    tooMany: {
      description: 'Нельзя указать больше пяти хэш-тегов',
      /**
       * @param {string} payload
       * @param {number} index
       * @param {string[]} payloads
       * @return {boolean} Проходит ли проверку
       */
      validateIt: function (payload, index, payloads) {
        return payloads.length <= HASHTAGS_MAXIMUM_LENGTH;
      }
    },
    tooLong: {
      description: 'максимальная длина одного хэш-тега 20 символов, включая решётку',
      validateIt: function (payload) {
        return payload.length <= ONE_HASHTAG_MAXIMUM_LENGTH;
      }
    },
    firstSymbol: {
      description: 'хэш-тег должен начинатся с символа # (решётка)',
      validateIt: function (payload) {
        return payload[0] === '#';
      }
    },
    spaceRequire: {
      description: 'хеш-тег должны разделяться пробелами',
      validateIt: function (payload) {
        return payload.split('#').length <= 2;
      }
    },
    unique: {
      description: 'один и тот же хэш-тег не может быть использован дважды',
      /**
       * @param {string} payload
       * @param {number} index
       * @param {string[]} payloads
       * @return {boolean} Проходит ли проверку
       */
      validateIt: function (payload, index, payloads) {
        return payloads
        .findIndex(function (item, i) {
          return item.toLocaleLowerCase() === payload.toLocaleLowerCase() &&
            i !== index;
        }) === -1;
      }
    },
    notOnlyHash: {
      description: 'хеш-тег не может состоять только из одной решётки',
      validateIt: function (payload) {
        return payload.length > 1;
      }
    }
  };


  /* VARIABLES */

  var textHashtagInputNode = document.querySelector('.text__hashtags');
  var textDescriptionInputNode = document.querySelector('.text__description');


  /* FUNCTIONS */

  /**
   * @param {string} payload
   * @param {number} indexOfPayload
   * @param {string[]} payloads
   * @param {VALIDATION_SCHEMA} VALIDATION_SCHEMA
   * @return {string}
   */
  var getCustomValidity = function (payload, indexOfPayload, payloads, VALIDATION_SCHEMA) {
    var validationSchemaTypes = Object.keys(VALIDATION_SCHEMA);

    for (var i = 0; i < validationSchemaTypes.length; i++) {
      var currentValidation = VALIDATION_SCHEMA[validationSchemaTypes[i]];
      var isValidValueByType = currentValidation.validateIt(payload, indexOfPayload, payloads);

      if (!isValidValueByType) {
        return currentValidation.description;
      }
    }

    return CLEAR_CUSTOM_VALIDITY_VALUE;
  };

  /**
   * @param {HTMLInputElement} inputNode
   * @param {boolean} isCorrect
   */
  var setInputNodeOutline = function (inputNode, isCorrect) {
    inputNode.style.outline = isCorrect ? CORRECT_INPUT_OUTLINE_VALUE : INCORRECT_INPUT_OUTLINE_VALUE;
  };

  /**
   * @param {HTMLInputElement} inputNode
   * @param {string[]} values
   * @param {VALIDATION_SCHEMA} schema
   */
  var makeValidateInputNodeBySchema = function (inputNode, values, schema) {
    setInputNodeOutline(inputNode, true);

    if (!values[0]) {
      inputNode.setCustomValidity(CLEAR_CUSTOM_VALIDITY_VALUE);
      setInputNodeOutline(inputNode, true);

      return;
    }

    for (var i = 0; i < values.length; i++) {
      var customValidity = getCustomValidity(values[i], i, values, schema);

      inputNode.setCustomValidity(customValidity);

      if (customValidity !== CLEAR_CUSTOM_VALIDITY_VALUE) {
        setInputNodeOutline(inputNode, false);
        break;
      }
    }
  };

  /* EVENTS */


  /* EVENTS:controls */

  /**
   *
   * @param {InputEvent} evt
   */
  var textHashtagInputHandler = function (evt) {
    var hashtags = evt.target.value.trim().toLowerCase().split(' ');

    makeValidateInputNodeBySchema(textHashtagInputNode, hashtags, HASHTAG_VALIDATION_SCHEMA);
  };

  var textDescriptionInputHandler = function (evt) {
    var values = [evt.target.value];

    makeValidateInputNodeBySchema(textDescriptionInputNode, values, DESCRIPTION_VALIDATION_SCHEMA);
  };


  /* EVENTS:listeners */

  /**
   * Экпортируемая функция модуля
   * Для запуска всех слушателей событий
   * Для этого модуля
   */
  var snapListeners = function () {
    textHashtagInputNode.addEventListener('input', textHashtagInputHandler);

    textDescriptionInputNode.addEventListener('input', textDescriptionInputHandler);
  };


  /* EXPORT */

  window.pictureFormValidator = {
    snapListeners: snapListeners,
    textHashtagInputNode: textHashtagInputNode,
    textDescriptionInputNode: textDescriptionInputNode,
    setInputNodeOutline: setInputNodeOutline
  };

})();
