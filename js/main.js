'use strict';

(function () {

  /* CB FUNCTIONS */

  function loadPicturesEndHandler(pictures) {
    window.pictureRender.renderGeneratedPictures(pictures);
    window.picturePreview.fillBigPictureNodeBy(pictures[0]);
  }


  /* MAIN */

  window.backend.getPictures(
      loadPicturesEndHandler,
      window.utils.showErrorMessage,
      false
  );

  // Прячет блоки счётчика комментариев
  document.querySelector('.social__comment-count').classList.add('visually-hidden');
  // Прячет загрузку новых комментариев
  document.querySelector('.comments-loader').classList.add('visually-hidden');


  /* EVENTS:listeners */
  window.window.pictureRender.snapListeners();
  window.pictureFormValidator.snapListeners();
  window.pictureFormEffects.snapListeners();
  window.picturePreview.snapListeners();

})();


