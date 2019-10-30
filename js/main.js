'use strict';

(function () {

  /* CB FUNCTIONS */

  function loadPicturesEndHandler(pictures) {
    window.pictureRender.renderGeneratedPictures(pictures);
  }


  /* MAIN */

  window.backend.getPictures(
      loadPicturesEndHandler,
      window.notification.showErrorMessage,
      false
  );


  /* EVENTS:listeners */
  window.window.pictureRender.snapListeners();
  window.pictureFormValidator.snapListeners();
  window.pictureFormEffects.snapListeners();
  window.pictureFormSubmit.snapListeners();
  window.picturePreview.snapListeners();
  window.pictureFilter.snapListeners();

})();


