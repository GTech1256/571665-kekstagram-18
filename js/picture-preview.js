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

  var COMMENTS_UPLOADING_COUNT = 5;
  var BODY_CLASS_MODAL_OPEN_VALUE = 'modal-open';


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
    var comments = currentComments.slice(offsetOfCommentsUploading, offsetOfCommentsUploading + COMMENTS_UPLOADING_COUNT);

    if (comments.length < COMMENTS_UPLOADING_COUNT) {
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
    document.body.classList.add(BODY_CLASS_MODAL_OPEN_VALUE);
    bigPictureNode.classList.remove(window.utils.CLASS_HIDDEN);

    document.addEventListener('keydown', window.utils.getKeydownEscEventWrapper(closeBigPicture));
  }

  function closeBigPicture() {
    document.body.classList.remove(BODY_CLASS_MODAL_OPEN_VALUE);
    bigPictureNode.classList.add(window.utils.CLASS_HIDDEN);

    document.removeEventListener('keydown', window.utils.getKeydownEscEventWrapper(closeBigPicture));
  }

  function hideCommentsLoader() {
    commentsLoaderNode.classList.add(window.utils.CLASS_HIDDEN);
  }

  function showCommentsLoader() {
    commentsLoaderNode.classList.remove(window.utils.CLASS_HIDDEN);
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
