'use strict';

(function () {
  /* CONSTANTS */


  /* VARIABLES */

  var imgUploadFormNode = document.querySelector('.img-upload__form');
  var closePictureEditorForm = window.pictureFormEffects.closePictureEditorForm;
  var clearPictureUploadInput = window.pictureFormEffects.clearPictureUploadInput;
  var resetPictureEffects = window.pictureFormEffects.resetPictureEffects;

  /* BUSINESS LOGIC */

  function closePictureForm() {
    closePictureEditorForm();
    clearPictureUploadInput();
    resetPictureEffects();
    window.notification.showSuccessMessage();
  }

  /* EVENTS */


  /* EVENTS:controls */

  function imgUploadFormSubmitHandler(evt) {
    evt.preventDefault();

    window.backend.sendForm(
        closePictureForm,
        window.notification.showErrorMessage,
        new FormData(imgUploadFormNode)
    );
  }

  /* EVENTS:listeners */

  /**
   * Экпортируемая функция модуля
   * Для запуска всех слушателей событий
   * Для этого модуля
   */
  function snapListeners() {
    imgUploadFormNode.addEventListener('submit', imgUploadFormSubmitHandler);
  }


  /* EXPORT */

  window.pictureFormSubmit = {
    snapListeners: snapListeners
  };
})();
