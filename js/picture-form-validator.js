'use strict';

(function () {

  /* CONSTANTS */

  var DESCRIPTION_VALIDATOR_MESSAGE = {
    toLong: 'Длина комментария не может составлять больше 140 символов'
  };
  var HASHTAG_VALIDATOR_MESSAGE = {
    toMany: 'Нельзя указать больше пяти хэш-тегов',
    toLong: 'максимальная длина одного хэш-тега 20 символов, включая решётку',
    firstSymbol: 'хэш-тег должен начинатся с символа # (решётка)',
    spaceRequire: 'хеш-тег должны разделяться пробелами',
    unique: 'один и тот же хэш-тег не может быть использован дважды',
    notOnlyHash: 'хеш-тег не может состоять только из одной решётки'
  };


  /* VARIABLES */

  var textHashtagInputNode = document.querySelector('.text__hashtags');
  var textDescriptionInputNode = document.querySelector('.text__description');


  /* FUNCTIONS */

  /**
   * Реализация callback'а для Array.forEach
   * Валидация каждого хэштега
   *
   * @param {string} hashtag
   * @param {number} index
   * @param {string[]} allHashtags
   */
  function validateHashtag(hashtag, index, allHashtags) {

    getInputNodeValidatorConstructor(textHashtagInputNode)
    .makeCandidateVerification(
        hashtag.length > 20,
        hashtag + ': ' + HASHTAG_VALIDATOR_MESSAGE.toLong
    )
    .makeCandidateVerification(
        hashtag.split('#').length > 2,
        hashtag + ': ' + HASHTAG_VALIDATOR_MESSAGE.spaceRequire
    )
    .makeCandidateVerification(
        allHashtags.indexOf(hashtag.toLowerCase()) !== index,
        hashtag + ': ' + HASHTAG_VALIDATOR_MESSAGE.unique
    )

    .makeCandidateVerification(
        hashtag.length === 1,
        hashtag + ': ' + HASHTAG_VALIDATOR_MESSAGE.notOnlyHash
    )
    .makeCandidateVerification(
        hashtag[0] !== '#',
        hashtag + ': ' + HASHTAG_VALIDATOR_MESSAGE.firstSymbol
    );
  }

  /**
   * Валидация каждого комментария
   *
   * @param {string} comment
   */
  function validateDescription(comment) {

    getInputNodeValidatorConstructor(textDescriptionInputNode)
    .makeCandidateVerification(
        comment.length > 140,
        DESCRIPTION_VALIDATOR_MESSAGE.toLong
    );
  }

  /**
   * @param {Node} inputNode
   * @return {{ makeCandidateVerification: function(boolean, string) }}
   */
  function getInputNodeValidatorConstructor(inputNode) {
    inputNode.setCustomValidity('');

    function makeCandidateVerification(condition, message) {
      if (condition) {
        inputNode.setCustomValidity(message);
      }

      return {makeCandidateVerification: makeCandidateVerification};
    }

    return {makeCandidateVerification: makeCandidateVerification};
  }


  /* EVENTS */


  /* EVENTS:controls */

  /**
   *
   * @param {InputEvent} evt
   */
  function textHashtagInputHandler(evt) {
    var hashtags = evt.target.value.trim().toLowerCase().split(' ');

    if (hashtags.length > 5) {
      textHashtagInputNode.setCustomValidity(HASHTAG_VALIDATOR_MESSAGE.toMany);
      return;
    }

    hashtags.forEach(validateHashtag);
  }

  function textDescriptionInputHandler(evt) {
    validateDescription(evt.target.value);
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
    snapListeners: snapListeners
  };

})();
