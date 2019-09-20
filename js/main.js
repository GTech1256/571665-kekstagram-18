'use strict';

/**
 * Описание фотографии.
 * @typedef {Object} PhotoDescription
 * @property {string} url               - адрес картинки
 * @property {string} description       - описание фотографии.
 * @property {number} likes             - количество лайков
 * @property {Object[]} comments        - список комментариев, оставленных другими пользователями к этой фотографии.
 * @property {string} comments.avatar   - адрес аватарки
 * @property {string} comments.message  - предложение коментатора
 * @property {string} comments.name     - имя коментатора
 */

/* CONSTANTS */

var COUNT_GENERATIONS_PHOTO_DESCRIPTION = 25;
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
 * Получение случайного числа между двумя значениями, включительно
 * @param {number} min включительно
 * @param {number} max включительно
 * @return {number} случайное числа между двумя значениями, включительно
 */
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Возвращает рандомное значение из масива
 *
 * @param {Array} array Массив значений
 * @return {*} рандомное значение из масива
 */
function getRandomValueFromArray(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/* FUNCTIONS */

/**
 * Возвращает случайно сгенерированные описания фотографий
 *
 * @param {number} count
 * @return {PhotoDescription[]}
 */
function getGeneratedPhotoDescription(count) {
  var result = [];

  for (var i = 0; i <= count; i++) {
    result.push({
      url: 'photos/' + i + '.jpg',
      description: DESCRIPTION,
      likes: getRandomIntInclusive(MIN_COUNT_LIKES, MAX_COUNT_LIKES),
      comments: [{
        avatar: 'img/avatar-' + getRandomIntInclusive(1, 6) + '.svg',
        message: getRandomValueFromArray(COMMENTS),
        name: getRandomValueFromArray(NAMES),
      },
      {
        url: 'photos/' + i + '.jpg',
        description: DESCRIPTION,
        likes: getRandomIntInclusive(MIN_COUNT_LIKES, MAX_COUNT_LIKES),
      }]
    });
  }


  return result;
}

/**
 * создает DOM-элемент,
 * соответствующий фотографиям и заполняет их данными:
 *
 * @param {PhotoDescription} payload
 * @param {DocumentFragment} template
 */
function fillPictureTemplate(payload, template) {
  var pictureNode = template.cloneNode(true);

  pictureNode.querySelector('.picture__img').src = payload.url;
  pictureNode.querySelector('.picture__likes').src = payload.likes;
  pictureNode.querySelector('.picture__comments').src = payload.comments.length;
}
