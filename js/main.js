'use strict';

(function () {

  /* CONSTANTS */

  var PHOTOS_COUNT = 25;


  /* MAIN */

  var generatedPictures = window.pictureRender.getGeneratedPictures(PHOTOS_COUNT);

  window.pictureRender.renderGeneratedPictures(generatedPictures);
  window.picturePreview.fillBigPictureNodeBy(generatedPictures[0]);

  // Прячет блоки счётчика комментариев
  document.querySelector('.social__comment-count').classList.add('visually-hidden');
  // Прячет загрузку новых комментариев
  document.querySelector('.comments-loader').classList.add('visually-hidden');

  /* EVENTS:listeners */
  window.pictureFormValidator.snapListeners();
  window.pictureFormEffects.snapListeners();
  window.picturePreview.snapListeners();

})();


