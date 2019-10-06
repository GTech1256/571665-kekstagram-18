'use strict';

/**
 * @typedef {Object} FILTER_DESCRIPTOR
 * @property {string} name
 * @property {number} min
 * @property {number} max
 * @property {string} units
 */

(function () {

  /* CONSTANTS */
  var PICTURE_UPLOAD_PREVIEW_IMG_DEFAULT_CLASS_NAME = 'img-upload__preview';
  var MAX_PERCENT_OF_FILTER_VALUE = 100;
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

  var EFFECT_NAME_TO_FILTER_MAP = {
    chrome: 'grayscale',
    sepia: 'sepia',
    marvin: 'invert',
    phobos: 'blur',
    heat: 'brightness',
    none: 'none'
  };

  /* VARIABLES */

  var pictureUploadInputNode = document.querySelector('#upload-file');
  var pictureEditorNode = document.querySelector('.img-upload__overlay');
  var pictureUploadPreviewNode = document.querySelector('.img-upload__preview');
  var pictureUploadPreviewImgNode = document.querySelector('.img-upload__preview img');
  var pictureEffectPreviewNodes = document.querySelectorAll('.effects__preview');
  var pictureEffectPreviewInputNodes = document.querySelectorAll('.effects__radio');

  var currentFilter = EFFECT_NAME_TO_FILTER_MAP.none;
  var effectLevelNode = document.querySelector('.effect-level');
  var effectLevelLPinNode = document.querySelector('.effect-level__pin');
  var effectLevelLineNode = document.querySelector('.effect-level__line');
  var effectLevelLDepthNode = document.querySelector('.effect-level__depth');
  var effectLevelLValueNode = document.querySelector('.effect-level__value');

  var scaleControlValueNode = document.querySelector('.scale__control--value');
  var scaleControlBiggerNode = document.querySelector('.scale__control--bigger');
  var scaleControlSmallerNode = document.querySelector('.scale__control--smaller');


  /* FUNCTIONS */

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

    effectLevelLValueNode.value = newValue;

    setEffectLevelInPictureEditor(newValue);
  }

  /**
 * @param {number} newPercentWidth 0 - 100
 */
  function setEffectLevelPinPosition(newPercentWidth) {
    effectLevelLPinNode.style.left = newPercentWidth + '%';
    effectLevelLDepthNode.style.width = newPercentWidth + '%';
  }

  /**
 * @param {number} newPercent 0 - 100
 */
  function setEffectLevelInPictureEditor(newPercent) {

    if (currentFilter === EFFECT_NAME_TO_FILTER_MAP.none) {
      setFilterToPictureUploadPreviewNode(0);
      hideEffectLevelLine();
      return;
    }

    showEffectLevelLine();
    setFilterToPictureUploadPreviewNode(newPercent);
  }

  /**
 * @param {number} newPercent 0 - 100
 */
  function setFilterToPictureUploadPreviewNode(newPercent) {
    if (currentFilter === EFFECT_NAME_TO_FILTER_MAP.none) {
      pictureUploadPreviewNode.style.filter = '';
    } else if (currentFilter === EFFECT_NAME_TO_FILTER_MAP.chrome || currentFilter === EFFECT_NAME_TO_FILTER_MAP.sepia) {
      pictureUploadPreviewNode.style.filter = currentFilter + '(' + newPercent / MAX_PERCENT_OF_FILTER_VALUE + ')';
    } else {
      var filter = FILTER_MAP[currentFilter];
      newPercent = window.utils.getValueBetweenByPercent(filter.min, filter.max, newPercent, MAX_PERCENT_OF_FILTER_VALUE);
      pictureUploadPreviewNode.style.filter = currentFilter + '(' + newPercent + filter.units + ')';
    }
  }

  /**
   *
   * @param {boolean} toUp При true повышает значение на 1 шаг
   */
  function changeByStepPictureScale(toUp) {
    var currentValue = parseInt(scaleControlValueNode.value, 10);

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
    scaleControlBiggerNode.disabled = newScale === SCALE_CONTROL_CONSTRAINTS.max;
    scaleControlSmallerNode.disabled = newScale === SCALE_CONTROL_CONSTRAINTS.min;

    if (newScale > SCALE_CONTROL_CONSTRAINTS.max || newScale < SCALE_CONTROL_CONSTRAINTS.min) {
      return;
    }

    scaleControlValueNode.value = newScale;
    scaleControlValueNode.dispatchEvent(new Event('change'));
  }


  /* BUSINESS LOGIC */

  /* - PictureEditorForm */
  function openPictureEditorForm() {
    setPictureScale(SCALE_CONTROL_CONSTRAINTS.default);
    setEffectLevelNewValue(MAX_PERCENT_OF_FILTER_VALUE);
    pictureEditorNode.classList.remove('hidden');
    document.addEventListener('keydown', pictureEditorFormKeyboardPressHandler);
  }

  function closePictureEditorForm() {
    pictureEditorNode.classList.add('hidden');

    pictureUploadInputNode.value = '';

    document.removeEventListener('keydown', pictureEditorFormKeyboardPressHandler);
  }


  /* BUSINESS LOGIC */

  function hideEffectLevelLine() {
    effectLevelNode.classList.add('hidden');
  }

  function showEffectLevelLine() {
    effectLevelNode.classList.remove('hidden');
  }

  /* EVENTS */

  /* EVENTS:controls */

  /**
   * @param {KeyboardEvent} evt
   */
  function pictureEditorFormKeyboardPressHandler(evt) {

    // Если фокус находится на форме ввода, то окно закрываться не должно.
    if (window.utils.isKeydownEscEvent(evt)) {
      closePictureEditorForm();
      return;
    }

    var isPressedMinus = evt.keyCode === window.utils.MINUS_KEYCODE;
    var isPressedPlus = evt.keyCode === window.utils.PLUS_KEYCODE;
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
   * @param {MouseEvent} evt
   */
  function effectLevelLineMouseupHandler(evt) {
    if (evt.target === effectLevelLPinNode) {
      return;
    }

    var percentsOffset = MAX_PERCENT_OF_FILTER_VALUE / effectLevelLineNode.offsetWidth * evt.offsetX;
    // percentsOffset = getCorrectValueBetween(0, 100);
    setEffectLevelNewValue(percentsOffset);
  }

  /* - pictureEffectPreviewNode */

  /**
   * Обрабатывает нажатие на любой из предпросмотров фильтра
   * @param {MouseEvent} evt
   */
  function pictureEffectPreviewInputClickHandler(evt) {
    currentFilter = EFFECT_NAME_TO_FILTER_MAP[evt.target.value];
    pictureUploadPreviewNode.className = PICTURE_UPLOAD_PREVIEW_IMG_DEFAULT_CLASS_NAME + ' effects__preview--' + currentFilter;

    /*
    При переключении эффектов,
    уровень насыщенности сбрасывается до начального значения (100%):
    слайдер,
    CSS-стиль изображения и
    значение поля должны обновляться.
    */
    setEffectLevelNewValue(MAX_PERCENT_OF_FILTER_VALUE);
  }

  window.pictureFormEffects = {
    /**
     * Экпортируемая функция модуля
     * Для запуска всех слушателей событий
     * Для этого модуля
     */
    snapListeners: function () {
      /* EVENTS:listeners */

      pictureUploadInputNode.addEventListener('change', uploadFileChangeHandler);

      document.querySelector('.img-upload__cancel.cancel').addEventListener('click', function () {
        closePictureEditorForm();
      });

      pictureEffectPreviewInputNodes.forEach(function (node) {
        node.addEventListener('click', pictureEffectPreviewInputClickHandler);
      });

      effectLevelLineNode.addEventListener('mouseup', effectLevelLineMouseupHandler);

      scaleControlBiggerNode.addEventListener('click', function () {
        changeByStepPictureScale(true);
      });
      scaleControlSmallerNode.addEventListener('click', function () {
        changeByStepPictureScale(false);
      });

      scaleControlValueNode.addEventListener('change', function () {
        pictureUploadPreviewImgNode.style.transform = 'scale(' + scaleControlValueNode.value / 100 + ')';
      });
    }
  };

})();
