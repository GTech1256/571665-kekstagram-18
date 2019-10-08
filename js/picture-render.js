'use strict';

(function () {

  /* VARIABLES */

  var pictureTemplate = document.querySelector('#picture').content;
  var picturesNode = document.querySelector('.pictures');
  /** @type {Picture[]} */
  var generatedPicturesFromBackend = [];


  /* FUNCTIONS */

  /**
   * создает DOM-элемент,
   * соответствующий разметке фотографии и заполняет их данными:
   *
   * @param {Picture} payload
   * @return {Node}
   */
  function getFilledPictureNodeFromTemplate(payload) {
    var pictureNode = pictureTemplate.cloneNode(true);

    pictureNode.querySelector('.picture__img').src = payload.url;
    pictureNode.querySelector('.picture__likes').textContent = payload.likes;
    pictureNode.querySelector('.picture__comments').textContent = payload.comments.length;

    return pictureNode;
  }

  /**
   * Отрисовка, сгенерированных из темплейта #picture, DOM-элементов
   *
   * @param {Picture[]} generatedPictures
   */
  function renderGeneratedPictures(generatedPictures) {
    generatedPicturesFromBackend = generatedPictures;

    var fragment = document.createDocumentFragment();

    generatedPictures.forEach(function (item, i) {
      fragment.appendChild(
          getFilledPictureNodeFromTemplate(
              generatedPictures[i]
          )
      );
    });

    picturesNode.appendChild(fragment);
  }

  /**
   * @param {HTMLImageElement} imageNode
   * @return {string}
   */
  function getPictureIDFromImageNode(imageNode) {
    return new URL(imageNode.src)
    .pathname
    .match(/[1-9]/g)
    .join('');
  }

  /**
   * @param {(MouseEvent|KeyboardEvent)} evt
   * @return {(HTMLImageElement|null)}
   */
  function getPictureNodeFromPicturesClick(evt) {
    var potentialTarget = evt.target;

    if (potentialTarget.classList.contains('picture__img')) {
      return potentialTarget;
    }

    evt.path.forEach(function (node) {

      if (node.classList && node.classList.contains('picture')) {
        potentialTarget = node.children[0];
      }
    });

    if (potentialTarget.classList.contains('picture__img')) {
      return potentialTarget;
    }

    return null;
  }


  /* EVENTS */


  /* EVENTS:controls */

  /**
   * @param {(MouseEvent|KeyboardEvent)} evt
   */
  function picturesNodeDelegatedClickHandler(evt) {
    var target = getPictureNodeFromPicturesClick(evt);

    if (!target) {
      return;
    }

    var pictureId = getPictureIDFromImageNode(target);

    window.picturePreview.fillBigPictureNodeBy(generatedPicturesFromBackend[pictureId - 1]);
  }


  /* EVENTS:listeners */

  /**
   * Экпортируемая функция модуля
   * Для запуска всех слушателей событий
   * Для этого модуля
   */
  function snapListeners() {
    picturesNode.addEventListener('click', picturesNodeDelegatedClickHandler, true);
  }


  /* EXPORT */

  window.pictureRender = {
    renderGeneratedPictures: renderGeneratedPictures,
    snapListeners: snapListeners
  };

})();
