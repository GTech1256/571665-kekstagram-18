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

  var THE_MAXIMUM_LENGTH_OF_A_HASHTAGS = 5;
  var THE_MAXIMUM_LENGTH_OF_A_HASHTAG = 20;
  var THE_MAXIMUM_LENGTH_OF_THE_COMMENT = 140;
  var CLEAR_CUSTOM_VALIDITY = '';
  /** @type {VALIDATION_SCHEMA} */
  var DESCRIPTION_VALIDATION_SCHEMA = {
    tooLong: {
      description: 'Длина комментария не может составлять больше 140 символов',
      validateIt: function (payload) {
        return payload.length <= THE_MAXIMUM_LENGTH_OF_THE_COMMENT;
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
        return payloads.length <= THE_MAXIMUM_LENGTH_OF_A_HASHTAGS;
      }
    },
    tooLong: {
      description: 'максимальная длина одного хэш-тега 20 символов, включая решётку',
      validateIt: function (payload) {
        return payload.length <= THE_MAXIMUM_LENGTH_OF_A_HASHTAG;
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
  function getCustomValidity(payload, indexOfPayload, payloads, VALIDATION_SCHEMA) {
    var validationSchemaTypes = Object.keys(VALIDATION_SCHEMA);

    for (var i = 0; i < validationSchemaTypes.length; i++) {
      var currentValidation = VALIDATION_SCHEMA[validationSchemaTypes[i]];
      var isValidValueByType = currentValidation.validateIt(payload, indexOfPayload, payloads);

      if (!isValidValueByType) {
        return currentValidation.description;
      }
    }

    return CLEAR_CUSTOM_VALIDITY;
  }


  /* EVENTS */


  /* EVENTS:controls */

  /**
   *
   * @param {InputEvent} evt
   */
  function textHashtagInputHandler(evt) {
    var hashtags = evt.target.value.trim().toLowerCase().split(' ');

    for (var i = 0; i < hashtags.length; i++) {
      var customValidity = getCustomValidity(hashtags[i], i, hashtags, HASHTAG_VALIDATION_SCHEMA);

      textHashtagInputNode.setCustomValidity(customValidity);

      if (customValidity !== CLEAR_CUSTOM_VALIDITY) {
        break;
      }
    }
  }

  function textDescriptionInputHandler(evt) {
    var values = [evt.target.value];

    textDescriptionInputNode.setCustomValidity(
        getCustomValidity(values[0], values.length, values, DESCRIPTION_VALIDATION_SCHEMA)
    );
  }


  /* EVENTS:listeners */

  /**
   * Экпортируемая функция модуля
   * Для запуска всех слушателей событий
   * Для этого модуля
   */
  function snapListeners() {
    textHashtagInputNode.addEventListener('input', textHashtagInputHandler);

    textDescriptionInputNode.addEventListener('input', textDescriptionInputHandler);
  }


  /* EXPORT */

  window.pictureFormValidator = {
    snapListeners: snapListeners,
    textHashtagInputNode: textHashtagInputNode,
    textDescriptionInputNode: textDescriptionInputNode
  };

})();
