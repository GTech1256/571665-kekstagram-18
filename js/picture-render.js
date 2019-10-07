'use strict';

(function () {

  /* CONSTANTS */

  // var MIN_COUNT_LIKES = 15;
  // var MAX_COUNT_LIKES = 200;
  // var COMMENTS = [
  //   'Всё отлично!', 'В целом всё неплохо. Но не всё.',
  //   'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  //   'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  //   'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  //   'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  // ];
  // var DESCRIPTION = 'описание фотографии.';
  // var NAMES = ['Артем', 'Иван', 'Хуан Себастьян', 'Мария', 'Кристоф', 'Виктор', 'Юлия', 'Люпита', 'Вашингтон'];


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
