'use strict';

/**
 * @typedef {('error'|'success')} NotificationType
 */

(function () {

  /* FUNCTIONS CONSTRUCTORS */

  /**
   * @class
   * @param {*} type
   * @param {*} template
   */
  var Notification = function (type, template) {
    this.type = type;
    this.template = template;

    this.isRendered = false;

    this.rootNode = null;
    this.textNode = null;

    this.escReferenceHandler = null;
  };

  Notification.prototype.render = function () {
    var cloneNode = this.template.cloneNode(true);

    document.body.appendChild(cloneNode);

    this.rootNode = document.querySelector('.' + this.type);
    this.textNode = this.rootNode.querySelector('.' + this.type + '__title');

    this.hide();

    this.isRendered = true;

    var buttonClickHandlerReference = this.buttonClickHandler.bind(this);

    this.rootNode.querySelectorAll('button')
      .forEach(function (it) {
        it.addEventListener('click', buttonClickHandlerReference);
      });
  };

  /**
   * @param {MouseEvent} evt
   */
  Notification.prototype.buttonClickHandler = function (evt) {
    evt.preventDefault();

    this.hide();
  };

  /**
   * @param {string} message
   */
  Notification.prototype.setMessage = function (message) {
    this.textNode.textContent = message;
  };

  Notification.prototype.show = function () {
    this.escReferenceHandler = window.utils.getKeydownEscEventWrapper(this.hide.bind(this));
    this.outsideReferenceHandler = this.outsideClickHandler.bind(this);

    document.addEventListener('keydown', this.escReferenceHandler);
    document.addEventListener('click', this.outsideReferenceHandler);

    this.rootNode.classList.remove('visually-hidden');
  };

  /**
   * @param {MouseEvent} evt
   */
  Notification.prototype.outsideClickHandler = function (evt) {
    if (evt.target.classList.contains(this.type)) {
      this.hide();
    }
  };


  Notification.prototype.hide = function () {
    document.removeEventListener('keydown', this.escReferenceHandler);
    document.removeEventListener('click', this.outsideReferenceHandler);

    this.rootNode.classList.add('visually-hidden');
  };


  /* VARIABLES */

  var successTemplate = document.querySelector('#success').content;
  var errorTemplate = document.querySelector('#error').content;

  var notificationNodeMap = {
    error: new Notification(
        'error',
        errorTemplate
    ),

    success: new Notification(
        'success',
        successTemplate
    ),
  };


  /* FUNCTIONS */

  /**
   * @param {NotificationType} type
   * @param {string} message
   */
  var showNotification = function (type, message) {
    var notificationInstance = notificationNodeMap[type];

    if (!notificationInstance.isRendered) {
      notificationInstance.render();
    }

    notificationInstance.setMessage(message);
    notificationInstance.show();
  };


  /* BUSINESS LOGIC */

  /**
   * @param {string} message
   */
  var showErrorMessage = function (message) {
    showNotification('error', message);
  };

  var showSuccessMessage = function () {
    showNotification('success', 'Изображение успешно загружено');
  };


  /* EXPORT */

  window.notification = {
    showSuccessMessage: showSuccessMessage,
    showErrorMessage: showErrorMessage,
  };

})();
