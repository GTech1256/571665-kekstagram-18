'use strict';

(function () {

  /* CB FUNCTIONS */

  function loadPicturesEndHandler(pictures) {
    window.pictureRender.renderGeneratedPictures(pictures);
    window.picturePreview.fillBigPictureNodeBy(pictures[0]);

    document.querySelector('.img-filters').classList.remove('img-filters--inactive');
  }


  /* MAIN */

  window.backend.getPictures(
      loadPicturesEndHandler,
      window.notification.showErrorMessage,
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
  window.pictureFormSubmit.snapListeners();
  window.picturePreview.snapListeners();
  window.pictureFilter.snapListeners();

})();


