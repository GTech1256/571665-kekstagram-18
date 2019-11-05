'use strict';

(function () {

  /* VARIABLES */

  var pictureTemplate = document.querySelector('#picture').content;
  var picturesNode = document.querySelector('.pictures');


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
    var fragment = document.createDocumentFragment();

    generatedPictures.forEach(function (item, i) {
      fragment.appendChild(
          getFilledPictureNodeFromTemplate(
              generatedPictures[i]
          )
      );
    });

    removeAllRenderedPuctures();

    picturesNode.appendChild(fragment);
  }

  function removeAllRenderedPuctures() {
    Array.from(picturesNode.children).forEach(function (node) {

      if (node.tagName === 'A') {
        node.remove();
      }

    });
  }

  /**
   * @param {HTMLImageElement} imageNode
   * @return {number}
   */
  function getPictureIdFromImageNode(imageNode) {
    var imageName = new URL(imageNode.src)
    .pathname
    .match(/[0-9]{1,}.(jpg|png|gif)/g)
    .join('');

    return parseInt(imageName, 10);
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

    if (!evt.path) {
      return null;
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

    var pictureId = getPictureIdFromImageNode(target);

    window.backend.getPictures(
        function (pictures) {
          window.picturePreview.fillBigPictureNodeBy(pictures[pictureId - 1]);
        },
        window.notification.showErrorMessage,
        true
    );

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
    snapListeners: snapListeners,
  };

})();
