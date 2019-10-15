'use strict';

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

  var COUNT_OF_RANDOM_PICTURES = 10;
  var DEBOUNCE_TIMEOUT = 500;

  /* VARIABLES */
  var imgFiltersButtonNodes = document.querySelectorAll('.img-filters__button');
  var pictureFilterLastDebounce = null;


  /* FUNCTIONS */

  /**
   * @param {Picture[]} pictures
   * @return {Picture[]}
   */
  function getSortedPicturesByComments(pictures) {
    return pictures.slice().sort(function (leftPicture, rightPicture) {
      return rightPicture.comments.length - leftPicture.comments.length;
    });
  }

  /* EVENTS */


  /* EVENTS:controls */

  /**
   * @param {MouseEvent} evt
   */
  function imgFiltersButtonClickHandler(evt) {
    if (pictureFilterLastDebounce) {
      clearTimeout(pictureFilterLastDebounce);
    }

    pictureFilterLastDebounce = setTimeout(function (localEvt) {
      window.backend.getPictures(
          setPuctureFilter(localEvt),
          window.utils.showErrorMessage,
          true
      );
    }, DEBOUNCE_TIMEOUT, evt);
  }

  /**
   * @param {MouseEvent} evt
   * @return {function(Picture[]):void}
   */
  function setPuctureFilter(evt) {
    return function (pictures) {
      switch (evt.target.id) {
        case 'filter-random':
          window.pictureRender.renderGeneratedPictures(
              window.utils.getRandomElements(pictures, COUNT_OF_RANDOM_PICTURES)
          );
          break;
        case 'filter-discussed':
          window.pictureRender.renderGeneratedPictures(
              getSortedPicturesByComments(pictures)
          );
          break;
        default:
          // 'filter-discussed'
          window.pictureRender.renderGeneratedPictures(pictures);
          break;
      }
    };
  }


  /* EVENTS:listeners */

  /**
   * Экпортируемая функция модуля
   * Для запуска всех слушателей событий
   * Для этого модуля
   */
  function snapListeners() {


    imgFiltersButtonNodes.forEach(function (imgFiltersButtonNode) {
      imgFiltersButtonNode.addEventListener('click', imgFiltersButtonClickHandler);
    });
  }


  /* EXPORT */

  window.pictureFilter = {
    snapListeners: snapListeners
  };

})();
