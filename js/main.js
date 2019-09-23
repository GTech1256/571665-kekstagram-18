'use strict';

/**
 * Комментарий к фотографии
 * @typedef {Object} PhotoComment
 * @property {string} avatar   - адрес аватарки
 * @property {string} message  - предложение коментатора
 * @property {string} name     - имя коментатора
 */

/**
 * Описание фотографии.
 * @typedef {Object} Photo
 * @property {string} url               - адрес картинки
 * @property {string} description       - описание фотографии.
 * @property {number} likes             - количество лайков
 * @property {PhotoComment[]} comments       - список комментариев, оставленных другими пользователями к этой фотографии.
 */

/* CONSTANTS */

var PHOTOS_COUNT = 25;
var MIN_COUNT_LIKES = 15;
var MAX_COUNT_LIKES = 200;
var COMMENTS = [
  'Всё отлично!', 'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];
var DESCRIPTION = 'описание фотографии.';
var NAMES = ['Артем', 'Иван', 'Хуан Себастьян', 'Мария', 'Кристоф', 'Виктор', 'Юлия', 'Люпита', 'Вашингтон'];

/* VARIABLES */

var pictureTemplate = document.querySelector('#picture')
  .content;

/* UTILS */

/**
 * @param {number} min
 * @param {number} max
 * @return {number}
 */
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * @param {*[]} array
 * @return {*}
 */
function getRandomValueFromArray(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/* FUNCTIONS */

/**
 * @param {number} count
 * @return {Photo[]}
 */
function getGeneratedPhotos(count) {
  var photos = [];

  for (var i = 0; i <= count - 1; i++) {
    photos.push({
      url: 'photos/' + (i + 1) + '.jpg',
      description: DESCRIPTION,
      likes: getRandomIntInclusive(MIN_COUNT_LIKES, MAX_COUNT_LIKES),
      comments: [{
        avatar: 'img/avatar-' + getRandomIntInclusive(1, 6) + '.svg',
        message: getRandomValueFromArray(COMMENTS),
        name: getRandomValueFromArray(NAMES),
      },
      {
        avatar: 'img/avatar-' + getRandomIntInclusive(1, 6) + '.svg',
        message: getRandomValueFromArray(COMMENTS),
        name: getRandomValueFromArray(NAMES),
      }]
    });
  }

  return photos;
}

/**
 * создает DOM-элемент,
 * соответствующий разметке фотографии и заполняет их данными:
 *
 * @param {Photo} payload
 * @param {DocumentFragment} template
 * @return {Node}
 */
function fillPictureDataInTemplate(payload, template) {
  var pictureNode = template.cloneNode(true);

  pictureNode.querySelector('.picture__img').src = payload.url;
  pictureNode.querySelector('.picture__likes').textContent = payload.likes;
  pictureNode.querySelector('.picture__comments').textContent = payload.comments.length;

  return pictureNode;
}

/**
 * Отрисовка, сгенерированных из темплейта #picture, DOM-элементов
 *
 * @param {number} count количество генераций DOM-элементов
 */
function renderGeneratedPictures(count) {
  var fragment = document.createDocumentFragment();

  var generatedPhotos = getGeneratedPhotos(count);

  generatedPhotos.forEach(function (item, i) {
    fragment.appendChild(
        fillPictureDataInTemplate(
            generatedPhotos[i],
            pictureTemplate
        )
    );
  });

  document.querySelector('.pictures').appendChild(fragment);
}

/* MAIN */

renderGeneratedPictures(PHOTOS_COUNT);
