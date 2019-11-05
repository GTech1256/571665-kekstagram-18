'use strict';

(function () {
  /* CONSTANTS */


  /* VARIABLES */

  var imgUploadFormNode = document.querySelector('.img-upload__form');
  var closePictureEditorForm = window.pictureFormEffects.closePictureEditorForm;
  var clearPictureUploadInput = window.pictureFormEffects.clearPictureUploadInput;
  var resetPictureEffects = window.pictureFormEffects.resetPictureEffects;

  /* BUSINESS LOGIC */

  var closePictureForm = function () {
    closePictureEditorForm();
    clearPictureUploadInput();
    resetPictureEffects();
    window.notification.showSuccessMessage();
  };

  /* EVENTS */


  /* EVENTS:controls */

  var imgUploadFormSubmitHandler = function (evt) {
    evt.preventDefault();

    window.backend.sendForm(
        closePictureForm,
        window.notification.showErrorMessage,
        new FormData(imgUploadFormNode)
    );
  };

  /* EVENTS:listeners */

  /**
   * Экпортируемая функция модуля
   * Для запуска всех слушателей событий
   * Для этого модуля
   */
  var snapListeners = function () {
    imgUploadFormNode.addEventListener('submit', imgUploadFormSubmitHandler);
  };


  /* EXPORT */

  window.pictureFormSubmit = {
    snapListeners: snapListeners
  };
})();
