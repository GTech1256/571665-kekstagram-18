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

/**
 * @typedef {Object} FILTER_CONTRUCTOR
 * @property {string} name имя фильтра
 * @property {number} min имя фильтра
 * @property {number} max имя фильтра
 * @property {sting} units
 * @property {_getCssViaFilterContructor} getValue имя фильтра
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
var ESC_KEYCODE = 27;
var MINUS_KEYCODE = 109;
var PLUS_KEYCODE = 107;
// var ENTER_KEYCODE = 13;
var PICTURE_UPLOAD_PREVIEW_IMG_DEFAULT_CLASS_NAME = 'img-upload__preview';
var MAX_PERCENT_OF_FILTER_VALUE = 100;
var FILTER_DEFAULT = {
  min: 0,
  max: 1,
  units: '',
  getValue: function (newPercent, filterName) {
    return filterName + '(' + newPercent / MAX_PERCENT_OF_FILTER_VALUE + ')';
  }
};
var FILTER_INVERT = {
  name: 'invert',
  min: 0,
  max: 100,
  units: '%',
  getValue: _getCssViaFilterContructor
};
var FILTER_BLUR = {
  name: 'blur',
  min: 0,
  max: 3,
  units: 'px',
  getValue: _getCssViaFilterContructor
};
var FILTER_BRIGHTNESS = {
  name: 'brightness',
  min: 1,
  max: 3,
  units: '',
  getValue: _getCssViaFilterContructor
};
/**
 * @type {Object<string, FILTER_CONTRUCTOR>}
 */
var FILTER_MAP = {
  invert: FILTER_INVERT,
  blur: FILTER_BLUR,
  brightness: FILTER_BRIGHTNESS,
  default: FILTER_DEFAULT
};
var SCALE_CONTROL_CONSTRAINTS = {
  min: 25,
  max: 100,
  step: 25,
  default: 100
};
var HASHTAG_VALIDATOR_MESSAGE = {
  toMany: 'Нельзя указать больше пяти хэш-тегов',
  toLong: 'максимальная длина одного хэш-тега 20 символов, включая решётку',
  firstSymbol: 'хэш-тег должен начинатся с символа # (решётка)',
  spaceRequire: 'хеш-тег должны разделяться пробелами',
  unique: 'один и тот же хэш-тег не может быть использован дважды'
};

/* VARIABLES */

var bigPictureNode = document.querySelector('.big-picture');

var pictureTemplate = document.querySelector('#picture').content;
var socialСommentTemplate = document.querySelector('#social__comment').content;

var pictureUploadInputNode = document.querySelector('#upload-file');
var pictureEditorNode = document.querySelector('.img-upload__overlay');
var pictureUploadPreviewNode = document.querySelector('.img-upload__preview');
var pictureUploadPreviewImgNode = document.querySelector('.img-upload__preview img');
var pictureEffectPreviewNodes = document.querySelectorAll('.effects__preview');

var effectLevel = document.querySelector('.effect-level');
var effectLevelLPin = document.querySelector('.effect-level__pin');
var effectLevelLine = document.querySelector('.effect-level__line');
var effectLevelLDepth = document.querySelector('.effect-level__depth');
var effectLevelLValue = document.querySelector('.effect-level__value');

var scaleControlValue = document.querySelector('.scale__control--value');
var scaleControlBigger = document.querySelector('.scale__control--bigger');
var scaleControlSmaller = document.querySelector('.scale__control--smaller');

var textHashtagInputNode = document.querySelector('.text__hashtags');

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

/**
 * @param {number} min
 * @param {number} max
 * @param {number} percent > 0 && < percentMax
 * @param {number} percentMax
 * @return {number} значения между min и max по percent
 */
function getValueBetweenByPercent(min, max, percent, percentMax) {
  if (percent > percentMax) {
    return max;
  }
  if (percent < 0) {
    return min;
  }
  return ((max - min) / percentMax * percent) + min;
}

/**
 * Проверяет является ли элемент target вводом данных
 *
 * @param {Event} evt
 * @return {boolean}
 */
function isTargetInput(evt) {
  return evt.target && (evt.target.name || evt.target.tagName === 'INPUT');
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

  openBigPicture();
}

/**
 * Реализует отображение настоящего изображения,
 * переданого в file[type="file"]
 *
 * @param {*} file
 */
function setUploadFilePictureToPreviewsNodes(file) {
  var reader = new FileReader();

  reader.onload = function (readerEvt) {
    pictureUploadPreviewImgNode.src = readerEvt.target.result;
    pictureEffectPreviewNodes.forEach(function (node) {
      node.style.backgroundImage = 'url(' + readerEvt.target.result + ')';
    });

    openPictureEditorForm();
  };

  reader.readAsDataURL(file);
}

/**
 * @param {number} newValue 0 - 100
 */
function setEffectLevelNewValue(newValue) {
  setEffectLevelPinPosition(newValue);

  effectLevelLValue.value = newValue;

  setEffectLevelInPictureEditor(newValue);
}

/**
 * @param {number} newPercentWidth 0 - 100
 */
function setEffectLevelPinPosition(newPercentWidth) {
  effectLevelLPin.style.left = newPercentWidth + '%';
  effectLevelLDepth.style.width = newPercentWidth + '%';
}

/**
   * @typedef {Function} _getCssViaFilterContructor
   * @this {FILTER_CONTRUCTOR}
   * @param {number} newPercent
   * @return {string} <filtername>(value + units)
   */
function _getCssViaFilterContructor(newPercent) {
  var isCalculateCss = this.min !== 0 || this.max !== MAX_PERCENT_OF_FILTER_VALUE;
  var value = newPercent;

  if (isCalculateCss) {
    value = getValueBetweenByPercent(this.min, this.max, newPercent, MAX_PERCENT_OF_FILTER_VALUE);
  }

  if (this.max === 1) {
    value /= MAX_PERCENT_OF_FILTER_VALUE;
  }

  return this.name + '(' + value + this.units + ')';
}

/**
 * Заменяет текущий уровень фильтра на новый
 * grayscale(1) => grayscale(newPercent)
 * @param {number} newPercent 0 - 100
 */
function setEffectLevelInPictureEditor(newPercent) {
  var currentFilter = window.getComputedStyle(pictureUploadPreviewNode).filter;
  var filterName = currentFilter.match(/([a-z]+)/)[1];

  // При выборе эффекта «Оригинал» слайдер скрывается.
  if (filterName === 'none') {
    hideEffectLevelLine();
  } else {
    showEffectLevelLine();
  }

  pictureUploadPreviewNode.style.filter = FILTER_MAP[filterName] ?
    FILTER_MAP[filterName].getValue(newPercent) :
    FILTER_MAP.default.getValue(newPercent, filterName);
}

/**
 *
 * @param {boolean} toUp При true повышает значение на 1 шаг
 */
function changeByStepPictureScale(toUp) {
  var currentValue = parseInt(scaleControlValue.value, 10);

  setPictureScale(
      toUp ?
        currentValue + SCALE_CONTROL_CONSTRAINTS.step :
        currentValue - SCALE_CONTROL_CONSTRAINTS.step
  );
}

/**
 *
 * @param {number} newScale 0 - 100
 */
function setPictureScale(newScale) {
  scaleControlBigger.disabled = newScale === SCALE_CONTROL_CONSTRAINTS.max;
  scaleControlSmaller.disabled = newScale === SCALE_CONTROL_CONSTRAINTS.min;

  if (newScale > SCALE_CONTROL_CONSTRAINTS.max || newScale < SCALE_CONTROL_CONSTRAINTS.min) {
    return;
  }

  scaleControlValue.value = newScale;
  scaleControlValue.dispatchEvent(new Event('change'));
}

/**
 * Реализация callback'а для forEach
 * Валидация каждого хэштега
 *
 * @param {string} hashtag
 * @param {number} index
 * @param {string[]} allHashtags
 */
function hashtagValidator(hashtag, index, allHashtags) {
  if (hashtag[0] !== '#') {
    textHashtagInputNode.setCustomValidity(hashtag + ': ' + HASHTAG_VALIDATOR_MESSAGE.firstSymbol);
    return;
  }

  if (hashtag.length > 20) {
    textHashtagInputNode.setCustomValidity(hashtag + ': ' + HASHTAG_VALIDATOR_MESSAGE.toLong);
    return;
  }

  var manyHashInTagRegExp = /(?:\s|^)#[A-Za-z0-9\-\.\_]+(?:\s|$)/g;
  if (!manyHashInTagRegExp.test(hashtag)) {
    textHashtagInputNode.setCustomValidity(hashtag + ': ' + HASHTAG_VALIDATOR_MESSAGE.spaceRequire);
    return;
  }

  if (allHashtags.indexOf(hashtag.toLowerCase()) !== index) {
    textHashtagInputNode.setCustomValidity(hashtag + ': ' + HASHTAG_VALIDATOR_MESSAGE.unique);
    return;
  }
}


/* BUSINESS LOGIC */

/* - BigPicture */

function openBigPicture() {
  bigPictureNode.classList.remove('hidden');
  document.addEventListener('keydown', bigPictureEscPressHandler);
}

function closeBigPicture() {
  bigPictureNode.classList.add('hidden');
  document.removeEventListener('keydown', bigPictureEscPressHandler);
}

/* - PictureEditorForm */
function openPictureEditorForm() {
  setPictureScale(SCALE_CONTROL_CONSTRAINTS.default);
  setEffectLevelNewValue(MAX_PERCENT_OF_FILTER_VALUE);
  pictureEditorNode.classList.remove('hidden');
  document.addEventListener('keydown', pictureEditorFormKeyboardPressHandler);
}

function closePictureEditiorForm() {
  pictureEditorNode.classList.add('hidden');

  pictureUploadInputNode.value = '';

  document.removeEventListener('keydown', pictureEditorFormKeyboardPressHandler);
}

/* - EffectLevelLine */
function hideEffectLevelLine() {
  effectLevel.classList.add('hidden');
}

function showEffectLevelLine() {
  effectLevel.classList.remove('hidden');
}

/* EVENTS */

/* EVENTS:controls */

/**
 * @param {Event} evt
 */
function bigPictureEscPressHandler(evt) {
  // Если фокус находится на форме ввода, то окно закрываться не должно.
  if (evt.keyCode === ESC_KEYCODE && !isTargetInput(evt)) {
    closeBigPicture();
  }
}

/**
 * @param {Event} evt
 */
function pictureEditorFormKeyboardPressHandler(evt) {
  // Если фокус находится на форме ввода, то окно закрываться не должно.
  if (evt.keyCode === ESC_KEYCODE && !isTargetInput(evt)) {
    closePictureEditiorForm();
    return;
  }

  var isPressedMinus = evt.keyCode === MINUS_KEYCODE;
  var isPressedPlus = evt.keyCode === PLUS_KEYCODE;
  if (isPressedMinus || isPressedPlus) {
    changeByStepPictureScale(isPressedPlus);
  }
}

/**
 * Получает фаил-изображение для обработки
 * @param {Event} evt
 */
function uploadFileChangeHandler(evt) {
  if (evt.target.files && evt.target.files[0]) {
    setUploadFilePictureToPreviewsNodes(evt.target.files[0]);
  }
}

/* - effectLevelPin */

/**
 * Изменять уровень насыщенности фильтра для изображения,
 * при отпускании мыши на линию
 *
 * @param {Event} evt
 */
function effectLevelLineMouseupHandler(evt) {
  if (evt.target === effectLevelLPin) {
    return;
  }

  var percentsOffset = MAX_PERCENT_OF_FILTER_VALUE / effectLevelLine.offsetWidth * evt.offsetX;

  setEffectLevelNewValue(percentsOffset);
}

/* - pictureEffectPreviewNode */

/**
 * Обрабатывает нажатие на любой из предпросмотров фильтра
 * @param {Event} evt
 */
function pictureEffectPreviewClickHandler(evt) {
  pictureUploadPreviewNode.className = PICTURE_UPLOAD_PREVIEW_IMG_DEFAULT_CLASS_NAME + ' ' + evt.target.classList[1];

  /*
  При переключении эффектов,
  уровень насыщенности сбрасывается до начального значения (100%):
  слайдер,
  CSS-стиль изображения и
  значение поля должны обновляться.
  */
  pictureUploadPreviewNode.style.filter = '';
  setEffectLevelNewValue(MAX_PERCENT_OF_FILTER_VALUE);
}

/**
 *
 * @param {Event} evt
 */
function textHashtagInputHandler(evt) {
  textHashtagInputNode.setCustomValidity('');

  if (evt.target.value.trim() === '') {
    return;
  }

  var hashtags = evt.target.value.trim().toLowerCase().split(' ');

  if (hashtags.length > 5) {
    textHashtagInputNode.setCustomValidity(HASHTAG_VALIDATOR_MESSAGE.toMany);
    return;
  }

  hashtags.forEach(hashtagValidator);
}

/* EVENTS:listeners */
pictureUploadInputNode.addEventListener('change', uploadFileChangeHandler);

document.querySelector('.img-upload__cancel.cancel').addEventListener('click', function () {
  closePictureEditiorForm();
});

bigPictureNode.querySelector('.big-picture__cancel').addEventListener('click', function () {
  closeBigPicture();
});

pictureEffectPreviewNodes.forEach(function (node) {
  node.addEventListener('click', pictureEffectPreviewClickHandler);
});

effectLevelLine.addEventListener('mouseup', effectLevelLineMouseupHandler);

scaleControlBigger.addEventListener('click', function () {
  changeByStepPictureScale(true);
});
scaleControlSmaller.addEventListener('click', function () {
  changeByStepPictureScale(false);
});

scaleControlValue.addEventListener('change', function () {
  pictureUploadPreviewImgNode.style.transform = 'scale(' + scaleControlValue.value / 100 + ')';
});

textHashtagInputNode.addEventListener('input', textHashtagInputHandler);


/* MAIN */
var generatedPictures = getGeneratedPictures(PHOTOS_COUNT);

renderGeneratedPictures(generatedPictures);
fillBigPictureNodeBy(generatedPictures[0]);

// Прячет блоки счётчика комментариев
document.querySelector('.social__comment-count').classList.add('visually-hidden');
// Прячет загрузку новых комментариев
document.querySelector('.comments-loader').classList.add('visually-hidden');
