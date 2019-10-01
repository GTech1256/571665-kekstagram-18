'use strict';

(function () {

  /* CONSTANTS */

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


  /* FUNCTIONS */

  /**
   * Реализация callback'а для Array.forEach
   * Валидация каждого хэштега
   *
   * @param {string} hashtag
   * @param {number} index
   * @param {string[]} allHashtags
   */
  function hashtagValidator(hashtag, index, allHashtags) {

    inputNodeValidatorConstruct(textHashtagInputNode)
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
   * @param {Node} inputNode
   * @return {{ makeCandidateVerification: function(boolean, string) }}
   */
  function inputNodeValidatorConstruct(inputNode) {

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
    textHashtagInputNode.setCustomValidity('');

    if (evt.target.value.trim() === '') {
      return;
    }

    var hashtags = evt.target.value.trim().toLowerCase().split(' ');

    if (hashtags.length > 5) {
      textHashtagInputNode.setCustomValidity(HASHTAG_VALIDATOR_MESSAGE.toMany);
      return;
    }

    hashtags.forEach(hashtagValidator);
  }

  /* EVENTS:listeners */

  textHashtagInputNode.addEventListener('input', textHashtagInputHandler);
})();
