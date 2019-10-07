'use strict';

(function () {

  /* VARIABLES */

  var pictureTemplate = document.querySelector('#picture').content;


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

    document.querySelector('.pictures').appendChild(fragment);
  }


  /* EXPORT */

  window.pictureRender = {
    renderGeneratedPictures: renderGeneratedPictures
  };

})();
