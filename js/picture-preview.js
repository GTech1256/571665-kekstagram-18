'use strict';

/**
 * Комментарий к фотографии
 * @typedef {Object} PictureComment
 * @property {string} avatar   - адрес аватарки
 * @property {string} message  - предложение коментатора
 * @property {string} name     - имя коментатора
 */

/**
 * Описание фотографии.
 * @typedef {Object} Picture
 * @property {string} url               - адрес картинки
 * @property {string} description       - описание фотографии.
 * @property {number} likes             - количество лайков
 * @property {PictureComment[]} comments       - список комментариев, оставленных другими пользователями к этой фотографии.
 */

(function () {

  /* VARIABLES */

  var bigPictureNode = document.querySelector('.big-picture');
  var socialСommentTemplate = document.querySelector('#social__comment').content;


  /* FUNCTIONS */

  /**
   * заполняет информацией полноэкранную картинку из переданных данных
   *
   * @param {Picture} payload переданные данные
   */
  function fillBigPictureNodeBy(payload) {
    bigPictureNode.querySelector('.big-picture__img img').src = payload.url;
    bigPictureNode.querySelector('.likes-count').textContent = payload.likes;
    bigPictureNode.querySelector('.comments-count').textContent = payload.comments.length;
    bigPictureNode.querySelector('.social__caption').textContent = payload.description;

    payload.comments.forEach(function (item) {
      var socialСommentNode = socialСommentTemplate.cloneNode(true);
      var socialPictureNode = socialСommentNode.querySelector('.social__picture');

      socialСommentNode.querySelector('.social__text').textContent = item.message;
      socialPictureNode.src = item.avatar;
      socialPictureNode.alt = item.name;

      document.querySelector('.social__comments').appendChild(socialСommentNode);
    });

    openBigPicture();
  }

  /* BUSINESS LOGIC */

  /* - BigPicture */

  function openBigPicture() {
    bigPictureNode.classList.remove('hidden');
    document.addEventListener('keydown', bigPictureEscPressHandler);
  }

  function closeBigPicture() {
    bigPictureNode.classList.add('hidden');
    document.removeEventListener('keydown', bigPictureEscPressHandler);
  }

  /* EVENTS */

  /* EVENTS:controls */

  /**
   * @param {KeyboardEvent} evt
   */
  function bigPictureEscPressHandler(evt) {
    window.utils.keydownEscEventWrapper(closeBigPicture)(evt);
  }

  /* EXPORT */

  window.picturePreview = {
    fillBigPictureNodeBy: fillBigPictureNodeBy,
    /**
     * Экпортируемая функция модуля
     * Для запуска всех слушателей событий
     * Для этого модуля
     */
    snapListeners: function () {
      /* EVENTS:listeners */

      bigPictureNode.querySelector('.big-picture__cancel').addEventListener('click', function () {
        closeBigPicture();
      });
    }
  };

})();
