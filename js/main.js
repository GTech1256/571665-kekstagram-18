'use strict';

(function () {

  /* CB FUNCTIONS */

  var loadPicturesEndHandler = function (pictures) {
    window.pictureRender.renderGeneratedPictures(pictures);
    document.querySelector('.img-filters').classList.remove('img-filters--inactive');
  };


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


