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

  /* CONSTANTS */

  var COUNT_OF_COMMENTS_UPLOADING = 5;


  /* VARIABLES */

  var bigPictureNode = document.querySelector('.big-picture');
  var socialСommentTemplate = document.querySelector('#social__comment').content;
  var socialСommentsNode = document.querySelector('.social__comments');
  var commentsLoaderNode = document.querySelector('.comments-loader');
  var socialCommentCountNode = document.querySelector('.comments-count');
  var showedCommentCountNode = document.querySelector('.showed-comments-count');

  var offsetOfCommentsUploading = 0;
  /** @type {PictureComment[]} */
  var currentComments = [];


  /* FUNCTIONS */

  /**
   * заполняет информацией полноэкранную картинку из переданных данных
   *
   * @param {Picture} payload переданные данные
   */
  function fillBigPictureNodeBy(payload) {
    currentComments = payload.comments;

    bigPictureNode.querySelector('.big-picture__img img').src = payload.url;
    bigPictureNode.querySelector('.likes-count').textContent = payload.likes;
    socialCommentCountNode.textContent = currentComments.length;
    bigPictureNode.querySelector('.social__caption').textContent = payload.description;


    resetBigPictureComments();

    addBigPictureComments();

    openBigPicture();
  }

  function addBigPictureComments() {
    var comments = currentComments.slice(offsetOfCommentsUploading, offsetOfCommentsUploading + COUNT_OF_COMMENTS_UPLOADING);

    if (comments.length < COUNT_OF_COMMENTS_UPLOADING) {
      hideCommentsLoader();
    }

    offsetOfCommentsUploading += comments.length;

    comments.forEach(function (item) {
      var socialСommentNode = socialСommentTemplate.cloneNode(true);
      var socialPictureNode = socialСommentNode.querySelector('.social__picture');

      socialСommentNode.querySelector('.social__text').textContent = item.message;
      socialPictureNode.src = item.avatar;
      socialPictureNode.alt = item.name;

      document.querySelector('.social__comments').appendChild(socialСommentNode);
    });

    showedCommentCountNode.textContent = offsetOfCommentsUploading;
  }

  function resetBigPictureComments() {
    offsetOfCommentsUploading = 0;
    socialСommentsNode.innerHTML = '';
    showCommentsLoader();
  }

  /* BUSINESS LOGIC */


  function openBigPicture() {

    bigPictureNode.classList.remove('hidden');
    document.addEventListener('keydown', window.utils.keydownEscEventWrapper(closeBigPicture));
  }

  function closeBigPicture() {
    bigPictureNode.classList.add('hidden');
    document.removeEventListener('keydown', window.utils.keydownEscEventWrapper(closeBigPicture));
  }

  function hideCommentsLoader() {
    commentsLoaderNode.classList.add('hidden');
  }

  function showCommentsLoader() {
    commentsLoaderNode.classList.remove('hidden');
  }

  /* EVENTS */


  /* EVENTS:controls */

  function commentsLoaderClickHandler(evt) {
    evt.preventDefault();

    addBigPictureComments();
  }


  /* EVENTS:listeners */

  /**
   * Экпортируемая функция модуля
   * Для запуска всех слушателей событий
   * Для этого модуля
   */
  function snapListeners() {
    bigPictureNode.querySelector('.big-picture__cancel').addEventListener('click', function () {
      closeBigPicture();
    });

    commentsLoaderNode.addEventListener('click', commentsLoaderClickHandler);
  }


  /* EXPORT */

  window.picturePreview = {
    fillBigPictureNodeBy: fillBigPictureNodeBy,
    snapListeners: snapListeners
  };

})();
