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

var bigPictureNode = document.querySelector('.big-picture');
var pictureTemplate = document.querySelector('#picture')
  .content;
var socialСommentTemplate = document.querySelector('#social__comment')
  .content;

/* UTILS */

/**
 * Получение случайного числа между двумя значениями, включительно
 * @param {number} min минимальное значение, включительно
 * @param {number} max максимальное значение, включительно
 * @return {number} случайное числа между двумя значениями, включительно
 */
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Возвращает случайное значение из масива
 *
 * @param {Array} array Массив значений
 * @return {*} случайное значение из масива
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

  for (var i = 0; i <= count - 1; i++) {
    result.push({
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

  return result;
}

/**
 * создает DOM-элемент,
 * соответствующий разметке фотографии и заполняет их данными:
 *
 * @param {PhotoDescription} payload
 * @param {DocumentFragment} template
 * @return {Node}
 */
function fillTemplateFromPictureData(payload, template) {
  var pictureNode = template.cloneNode(true);

  pictureNode.querySelector('.picture__img').src = payload.url;
  pictureNode.querySelector('.picture__likes').textContent = payload.likes;
  pictureNode.querySelector('.picture__comments').textContent = payload.comments.length;

  return pictureNode;
}

/**
 * Отрисовка, сгенерированных из темплейта #picture, DOM-элементов
 *
 * @param {PhotoDescription} pictures количество генераций DOM-элементов
 */
function renderGeneratedPictures(pictures) {
  var fragment = document.createDocumentFragment();

  pictures.forEach(function (item, i) {
    fragment.appendChild(
        fillTemplateFromPictureData(
            pictures[i],
            pictureTemplate
        )
    );
  });

  document.querySelector('.pictures').appendChild(fragment);
}

/**
 * заполняет информацией полноэкранную картинку из переданных данных
 *
 * @param {PhotoDescription} payload переданные данные
 */
function fillBigPictureNodeBy(payload) {
  bigPictureNode.classList.remove('hidden');

  bigPictureNode.querySelector('.big-picture__img img').src = payload.url;
  bigPictureNode.querySelector('.likes-count').textContent = payload.likes;
  bigPictureNode.querySelector('.comments-count').textContent = payload.comments.length;
  bigPictureNode.querySelector('.social__caption').textContent = payload.description;

  payload.comments.forEach(function (item) {
    var socialСommentNode = socialСommentTemplate.cloneNode(true);
    var socialPictureNode = socialСommentNode.querySelector('.social__picture');

    socialСommentNode.querySelector('.social__text').textContent = item.message;
    socialPictureNode.src = item.avatar;
    socialPictureNode.alt = item.name;

    document.querySelector('.social__comments').appendChild(socialСommentNode);
  });
}

/* MAIN */
var generatedPhotosDescription = getGeneratedPhotoDescription(COUNT_GENERATIONS_PHOTO_DESCRIPTION);
renderGeneratedPictures(generatedPhotosDescription);

fillBigPictureNodeBy(generatedPhotosDescription[0]);

document.querySelector('.social__comment-count').classList.add('visually-hidden');
document.querySelector('.comments-loader').classList.add('visually-hidden');
