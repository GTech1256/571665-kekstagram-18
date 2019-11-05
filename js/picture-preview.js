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
  var socialCommentTemplate = document.querySelector('#social__comment').content;
  var socialCommentsNode = document.querySelector('.social__comments');
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
  var fillBigPictureNodeBy = function (payload) {
    currentComments = payload.comments;

    bigPictureNode.querySelector('.big-picture__img img').src = payload.url;
    bigPictureNode.querySelector('.likes-count').textContent = payload.likes;
    socialCommentCountNode.textContent = currentComments.length;
    bigPictureNode.querySelector('.social__caption').textContent = payload.description;


    resetBigPictureComments();

    addBigPictureComments();

    openBigPicture();
  };

  var addBigPictureComments = function () {
    var comments = currentComments.slice(offsetOfCommentsUploading, offsetOfCommentsUploading + COMMENTS_UPLOADING_COUNT);

    if (comments.length < COMMENTS_UPLOADING_COUNT) {
      hideCommentsLoader();
    }

    offsetOfCommentsUploading += comments.length;

    comments.forEach(function (item) {
      var socialCommentNode = socialCommentTemplate.cloneNode(true);
      var socialPictureNode = socialCommentNode.querySelector('.social__picture');

      socialCommentNode.querySelector('.social__text').textContent = item.message;
      socialPictureNode.src = item.avatar;
      socialPictureNode.alt = item.name;

      document.querySelector('.social__comments').appendChild(socialCommentNode);
    });

    showedCommentCountNode.textContent = offsetOfCommentsUploading;
  };

  var resetBigPictureComments = function () {
    offsetOfCommentsUploading = 0;
    socialCommentsNode.innerHTML = '';
    showCommentsLoader();
  };

  /* BUSINESS LOGIC */


  var openBigPicture = function () {
    document.body.classList.add(BODY_CLASS_MODAL_OPEN_VALUE);
    bigPictureNode.classList.remove(window.utils.CLASS_HIDDEN);

    document.addEventListener('keydown', closeBigPicture);
  };
  /**
   * @param {KeyboardEvent} evt
   */
  var closeBigPicture = function (evt) {
    console.log(evt, 'EVT');

    if (!window.utils.checkIsKeydownEscEvent(evt)) {
      return;
    }

    document.body.classList.remove(BODY_CLASS_MODAL_OPEN_VALUE);
    bigPictureNode.classList.add(window.utils.CLASS_HIDDEN);

    document.removeEventListener('keydown', closeBigPicture);
  };

  var hideCommentsLoader = function () {
    commentsLoaderNode.classList.add(window.utils.CLASS_HIDDEN);
  };

  var showCommentsLoader = function () {
    commentsLoaderNode.classList.remove(window.utils.CLASS_HIDDEN);
  };


  /* EVENTS */

  /* EVENTS:controls */

  var commentsLoaderClickHandler = function (evt) {
    evt.preventDefault();

    addBigPictureComments();
  };

  /**
   * @param {MouseEvent} evt
   */
  var bigPictureCancelClickHandler = function (evt) {
    closeBigPicture(evt);
  };

  /* EVENTS:listeners */

  /**
   * Экпортируемая функция модуля
   * Для запуска всех слушателей событий
   * Для этого модуля
   */
  var snapListeners = function () {
    bigPictureNode.querySelector('.big-picture__cancel').addEventListener('click', bigPictureCancelClickHandler);

    commentsLoaderNode.addEventListener('click', commentsLoaderClickHandler);
  };


  /* EXPORT */

  window.picturePreview = {
    fillBigPictureNodeBy: fillBigPictureNodeBy,
    snapListeners: snapListeners
  };

})();
