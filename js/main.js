'use strict';

/**
 * Комментарий к фотографии
 * @typedef {Object} PictureComment
 * @property {string} avatar   - адрес аватарки
 * @property {string} message  - предложение коментатора
 * @property {string} name     - имя коментатора
 */

/**
 * Описание фотографии.
 * @typedef {Object} Picture
 * @property {string} url               - адрес картинки
 * @property {string} description       - описание фотографии.
 * @property {number} likes             - количество лайков
 * @property {PictureComment[]} comments       - список комментариев, оставленных другими пользователями к этой фотографии.
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

var bigPictureNode = document.querySelector('.big-picture');

var pictureTemplate = document.querySelector('#picture').content;
var socialСommentTemplate = document.querySelector('#social__comment').content;

var pictureUploadInputNode = document.querySelector('#upload-file');
var pictureEditorNode = document.querySelector('.img-upload__overlay');
var pictureUploadPreviewNode = document.querySelector('.img-upload__preview img');
var pictureEffectPreviewNodes = document.querySelectorAll('.effects__preview');

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
 * @return {Picture[]}
 */
function getGeneratedPictures(count) {
  var pictures = [];

  for (var i = 0; i <= count - 1; i++) {
    pictures.push({
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

  return pictures;
}

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

/**
 * заполняет информацией полноэкранную картинку из переданных данных
 *
 * @param {Picture} payload переданные данные
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

function setUploadFilePictureToPreviewsNodes(file) {
  var reader = new FileReader();

  reader.onload = function (readerEvt) {
    pictureUploadPreviewNode.src = readerEvt.target.result;
    pictureEffectPreviewNodes.forEach(function (node) {
      node.style.backgroundImage = 'url(' + readerEvt.target.result + ')';
    });

    pictureEditorNode.classList.remove('hidden');
  };

  reader.readAsDataURL(file);
}

/* EVENTS */
/* EVENTS:controls */
function closePictureEditignForm() {
  pictureUploadInputNode.value = '';
  pictureEditorNode.classList.add('hidden');
}

function uploadFileChangeHandler(evt) {
  if (evt.target.files && evt.target.files[0]) {
    setUploadFilePictureToPreviewsNodes(evt.target.files[0]);
  }
}
/* EVENTS:listeners */
pictureUploadInputNode.addEventListener('change', uploadFileChangeHandler);

document.querySelector('.img-upload__cancel.cancel').addEventListener('click', function () {
  closePictureEditignForm();
});


/* MAIN */
var generatedPictures = getGeneratedPictures(PHOTOS_COUNT);

renderGeneratedPictures(generatedPictures);
// fillBigPictureNodeBy(generatedPictures[0]);

// Прячет блоки счётчика комментариев
document.querySelector('.social__comment-count').classList.add('visually-hidden');
// Прячет загрузку новых комментариев
document.querySelector('.comments-loader').classList.add('visually-hidden');
