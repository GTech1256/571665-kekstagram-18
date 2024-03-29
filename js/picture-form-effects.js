'use strict';

/**
 * @typedef {Object} FILTER_DESCRIPTOR
 * @property {string} name
 * @property {number} min
 * @property {number} max
 * @property {string} units
 */

/**
  * @typedef {('chrome'|'sepia'|'marvin'|'phobos'|'heat'|'none')} FilterName
  */

(function () {

  /* CONSTANTS */

  var PICTURE_UPLOAD_PREVIEW_IMG_DEFAULT_CLASS_NAME = 'img-upload__preview';
  var MAX_PERCENT_OF_FILTER_VALUE = 100;
  var MIN_PERCENT_OF_FILTER_VALUE = 0;
  var INIT_START_COORD_OF_PIN_ON_X_PLANE = 0;
  var FILTER_DEFAULT = {
    min: 0,
    max: 1,
    units: '',
  };
  var FILTER_INVERT = {
    min: 0,
    max: 100,
    units: '%',
  };
  var FILTER_BLUR = {
    min: 0,
    max: 3,
    units: 'px',
  };
  var FILTER_BRIGHTNESS = {
    min: 1,
    max: 3,
    units: '',
  };
  /**
   * @type {Object<string, FILTER_DESCRIPTOR>}
   */
  var FILTER_MAP = {
    invert: FILTER_INVERT,
    blur: FILTER_BLUR,
    brightness: FILTER_BRIGHTNESS,
    none: FILTER_DEFAULT
  };
  var SCALE_CONTROL_CONSTRAINTS = {
    min: 25,
    max: 100,
    step: 25,
    default: 100
  };

  /**
   * @type {Object<FilterName, string>}
   */
  var EFFECT_NAME_TO_FILTER_MAP = {
    chrome: 'grayscale',
    sepia: 'sepia',
    marvin: 'invert',
    phobos: 'blur',
    heat: 'brightness',
    none: 'none',
  };

  /* VARIABLES */
  var pictureUploadInputNode = document.querySelector('#upload-file');
  var pictureEditorNode = document.querySelector('.img-upload__overlay');
  var pictureUploadPreviewNode = document.querySelector('.img-upload__preview img');
  var pictureUploadPreviewImgNode = document.querySelector('.img-upload__preview img');
  var pictureEffectPreviewNodes = document.querySelectorAll('.effects__preview');
  var pictureEffectPreviewInputNodes = document.querySelectorAll('.effects__radio');

  var effectLevelNode = document.querySelector('.effect-level');
  var effectLevelLPinNode = document.querySelector('.effect-level__pin');
  var effectLevelLineNode = document.querySelector('.effect-level__line');
  var effectLevelLDepthNode = document.querySelector('.effect-level__depth');
  var effectLevelLValueNode = document.querySelector('.effect-level__value');

  var scaleControlValueNode = document.querySelector('.scale__control--value');
  var scaleControlBiggerNode = document.querySelector('.scale__control--bigger');
  var scaleControlSmallerNode = document.querySelector('.scale__control--smaller');

  var currentFilter = EFFECT_NAME_TO_FILTER_MAP.none;
  var startCoordsOfPinOnXPlane = INIT_START_COORD_OF_PIN_ON_X_PLANE;


  /* FUNCTIONS */

  /**
   * @param {String} pictureSrc
   */
  var setPictureToPreviewsNodes = function (pictureSrc) {

    pictureUploadPreviewImgNode.src = pictureSrc;

    pictureEffectPreviewNodes.forEach(function (node) {
      node.style.backgroundImage = 'url(' + pictureSrc + ')';
    });

    openPictureEditorForm();
  };

  /**
   * @param {number} newValue 0 - 100
   */
  var setEffectLevelNewValue = function (newValue) {
    if (newValue > MAX_PERCENT_OF_FILTER_VALUE || newValue < MIN_PERCENT_OF_FILTER_VALUE) {
      return;
    }

    setEffectLevelPinPosition(newValue);

    effectLevelLValueNode.value = Math.round(newValue);

    setEffectLevelInPictureEditor(newValue);
  };

  /**
   * @param {number} newPercentWidth 0 - 100
   */
  var setEffectLevelPinPosition = function (newPercentWidth) {
    effectLevelLPinNode.style.left = newPercentWidth + '%';
    effectLevelLDepthNode.style.width = newPercentWidth + '%';
  };

  /**
   * @param {number} newPercent 0 - 100
   */
  var setEffectLevelInPictureEditor = function (newPercent) {

    if (currentFilter === EFFECT_NAME_TO_FILTER_MAP.none) {
      setFilterToPictureUploadPreviewNode(0);
      hideEffectLevelLine();
      return;
    }

    showEffectLevelLine();
    setFilterToPictureUploadPreviewNode(newPercent);
  };

  /**
   * @param {number} newPercent 0 - 100
   */
  var setFilterToPictureUploadPreviewNode = function (newPercent) {
    switch (currentFilter) {
      case EFFECT_NAME_TO_FILTER_MAP.none:
        pictureUploadPreviewNode.style.filter = '';
        break;
      case EFFECT_NAME_TO_FILTER_MAP.chrome:
      case EFFECT_NAME_TO_FILTER_MAP.sepia:
        pictureUploadPreviewNode.style.filter = currentFilter + '(' + newPercent / MAX_PERCENT_OF_FILTER_VALUE + ')';
        break;
      default:
        var filter = FILTER_MAP[currentFilter];
        newPercent = window.utils.getValueBetweenByPercent(filter.min, filter.max, newPercent, MAX_PERCENT_OF_FILTER_VALUE);
        pictureUploadPreviewNode.style.filter = currentFilter + '(' + newPercent + filter.units + ')';
        break;
    }
  };

  /**
   *
   * @param {boolean} toUp При true повышает значение на 1 шаг
   */
  var changeByStepPictureScale = function (toUp) {
    var currentValue = parseInt(scaleControlValueNode.value, 10);

    setPictureScale(
        toUp ?
          currentValue + SCALE_CONTROL_CONSTRAINTS.step :
          currentValue - SCALE_CONTROL_CONSTRAINTS.step
    );
  };

  /**
   *
   * @param {number} newScale 0 - 100
   */
  var setPictureScale = function (newScale) {
    scaleControlBiggerNode.disabled = newScale === SCALE_CONTROL_CONSTRAINTS.max;
    scaleControlSmallerNode.disabled = newScale === SCALE_CONTROL_CONSTRAINTS.min;

    if (newScale > SCALE_CONTROL_CONSTRAINTS.max || newScale < SCALE_CONTROL_CONSTRAINTS.min) {
      return;
    }

    scaleControlValueNode.value = newScale;
    scaleControlValueNode.dispatchEvent(new Event('change'));
  };

  /**
   * @param {FilterName} effectName
   */
  var setEffectPicture = function (effectName) {
    currentFilter = EFFECT_NAME_TO_FILTER_MAP[effectName];
    pictureUploadPreviewNode.className = PICTURE_UPLOAD_PREVIEW_IMG_DEFAULT_CLASS_NAME + ' effects__preview--' + effectName;
  };


  /* BUSINESS LOGIC */

  /* - PictureEditorForm */
  var openPictureEditorForm = function () {
    resetPictureEffects();

    pictureEditorNode.classList.remove(window.utils.CLASS_HIDDEN);
    document.addEventListener('keydown', pictureEditorFormKeyboardPressHandler);
  };

  var closePictureEditorForm = function () {
    pictureEditorNode.classList.add(window.utils.CLASS_HIDDEN);

    clearPictureUploadInput();

    document.removeEventListener('keydown', pictureEditorFormKeyboardPressHandler);
  };

  var clearPictureUploadInput = function () {
    pictureUploadInputNode.value = '';
  };

  var resetPictureEffects = function () {
    setEffectPicture(EFFECT_NAME_TO_FILTER_MAP.none);
    setPictureScale(SCALE_CONTROL_CONSTRAINTS.default);
    setEffectLevelNewValue(MAX_PERCENT_OF_FILTER_VALUE);

    window.pictureFormValidator.textHashtagInputNode.value = '';
    window.pictureFormValidator.textDescriptionInputNode.value = '';
    window.pictureFormValidator.setInputNodeOutline(window.pictureFormValidator.textHashtagInputNode, true);
    window.pictureFormValidator.setInputNodeOutline(window.pictureFormValidator.textDescriptionInputNode, true);
  };


  /* - EffectLevelLine */

  var hideEffectLevelLine = function () {
    effectLevelNode.classList.add(window.utils.CLASS_HIDDEN);
  };

  var showEffectLevelLine = function () {
    effectLevelNode.classList.remove(window.utils.CLASS_HIDDEN);
  };


  /* EVENTS */

  /* EVENTS:controls */

  /**
   * @param {KeyboardEvent} evt
   */
  var pictureEditorFormKeyboardPressHandler = function (evt) {

    // Если фокус находится на форме ввода, то окно закрываться не должно.
    if (window.utils.checkIsKeydownEscEvent(evt)) {
      closePictureEditorForm();
      return;
    }

    var isPressedMinus = evt.keyCode === window.utils.MINUS_KEYCODE;
    var isPressedPlus = evt.keyCode === window.utils.PLUS_KEYCODE;
    if (isPressedMinus || isPressedPlus) {
      changeByStepPictureScale(isPressedPlus);
    }
  };

  /**
   * Получает фаил-изображение для обработки
   * @param {Event} evt
   */
  var uploadFileChangeHandler = function (evt) {
    if (evt.target.files && evt.target.files[0]) {
      window.utils.readBlobFile(
          evt.target.files[0],
          setPictureToPreviewsNodes,
          window.notification.showErrorMessage
      );
    }
  };

  /* - effectLevelPin */

  /**
   * Изменять уровень насыщенности фильтра для изображения,
   * при отпускании мыши на линию
   *
   * @param {MouseEvent} evt
   */
  var effectLevelLineMousedownHandler = function (evt) {
    if (evt.target === effectLevelLPinNode) {
      return;
    }

    var percentsOffset = MAX_PERCENT_OF_FILTER_VALUE / effectLevelLineNode.offsetWidth * evt.offsetX;

    setEffectLevelNewValue(percentsOffset);

    document.addEventListener('mousemove', documentMousemoveHandler);
    document.addEventListener('mouseup', documentMousemoupHandler);
  };

  /**
   * @param {MouseEvent} evt
   */
  var effectLevelPinMousedownHandler = function (evt) {
    evt.preventDefault();

    document.addEventListener('mousemove', documentMousemoveHandler);
    document.addEventListener('mouseup', documentMousemoupHandler);
  };

  /**
   * @param {MouseEvent} evt
   */
  var documentMousemoupHandler = function (evt) {
    evt.preventDefault();

    startCoordsOfPinOnXPlane = INIT_START_COORD_OF_PIN_ON_X_PLANE;
    document.removeEventListener('mousemove', documentMousemoveHandler);
    document.removeEventListener('mouseup', documentMousemoupHandler);
  };

  /**
   * @param {MouseEvent} evt
   */
  var documentMousemoveHandler = function (evt) {
    evt.preventDefault();

    var shift = startCoordsOfPinOnXPlane - evt.clientX;

    var percentsOffset = MAX_PERCENT_OF_FILTER_VALUE / effectLevelLineNode.offsetWidth * (effectLevelLPinNode.offsetLeft - shift);
    setEffectLevelNewValue(percentsOffset);

    startCoordsOfPinOnXPlane = evt.clientX;
  };

  /* - pictureEffectPreviewNode */

  /**
   * Обрабатывает нажатие на любой из предпросмотров фильтра
   * @param {MouseEvent} evt
   */
  var pictureEffectPreviewInputClickHandler = function (evt) {
    setEffectPicture(evt.target.value);

    /*
    При переключении эффектов,
    уровень насыщенности сбрасывается до начального значения (100%):
    слайдер,
    CSS-стиль изображения и
    значение поля должны обновляться.
    */
    setEffectLevelNewValue(MAX_PERCENT_OF_FILTER_VALUE);
  };

  /* EVENTS:listeners */

  /**
   * Экпортируемая функция модуля
   * Для запуска всех слушателей событий
   * Для этого модуля
   */
  var snapListeners = function () {
    pictureUploadInputNode.addEventListener('change', uploadFileChangeHandler);

    document.querySelector('.img-upload__cancel.cancel').addEventListener('click', function () {
      closePictureEditorForm();
    });

    pictureEffectPreviewInputNodes.forEach(function (node) {
      node.addEventListener('click', pictureEffectPreviewInputClickHandler);
    });

    effectLevelLineNode.addEventListener('mousedown', effectLevelLineMousedownHandler);

    effectLevelLPinNode.addEventListener('mousedown', effectLevelPinMousedownHandler);

    scaleControlBiggerNode.addEventListener('click', function () {
      changeByStepPictureScale(true);
    });
    scaleControlSmallerNode.addEventListener('click', function () {
      changeByStepPictureScale(false);
    });

    scaleControlValueNode.addEventListener('change', function () {
      pictureUploadPreviewImgNode.style.transform = 'scale(' + scaleControlValueNode.value / 100 + ')';
    });
  };


  /* EXPORT */

  window.pictureFormEffects = {
    snapListeners: snapListeners,
    clearPictureUploadInput: clearPictureUploadInput,
    resetPictureEffects: resetPictureEffects,
    closePictureEditorForm: closePictureEditorForm
  };

})();
