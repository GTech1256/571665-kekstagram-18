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
  function Notification(type, template) {
    this.type = type;
    this.template = template;

    this.isRendered = false;

    this.rootNode = null;
    this.textNode = null;

    this.escReferenceHandler = null;
  }

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
    this.escReferenceHandler = window.utils.keydownEscEventWrapper(this.hide.bind(this));
    document.addEventListener('keydown', this.escReferenceHandler);

    this.rootNode.classList.remove('visually-hidden');
  };

  Notification.prototype.hide = function () {
    document.removeEventListener('keydown', this.escReferenceHandler);

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
  function showNotification(type, message) {
    var notificationInstance = notificationNodeMap[type];

    if (!notificationInstance.isRendered) {
      notificationInstance.render();
    }

    notificationInstance.setMessage(message);
    notificationInstance.show();
  }


  /* BUSINESS LOGIC */

  /**
   * @param {string} message
   */
  function showErrorMessage(message) {
    showNotification('error', message);
  }

  function showSuccessMessage() {
    showNotification('success', 'Изображение успешно загружено');
  }


  /* EXPORT */

  window.notification = {
    showSuccessMessage: showSuccessMessage,
    showErrorMessage: showErrorMessage,
  };

})();
