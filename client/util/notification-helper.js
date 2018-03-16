import ReactDOM from 'react-dom';

export default class NotificationHelper {
  static notifyError = (sourceComponent, message, error = null) => {
    if (error !== null) {
      console.error(error); // eslint-disable-line no-console
    }
    NotificationHelper.dispatchNotification(sourceComponent, 'error', message);
  }

  static notifySuccess = (sourceComponent, message) => {
    NotificationHelper.dispatchNotification(sourceComponent, 'success', message);
  }

  static dispatchNotification = (sourceComponent, type, message) => {
    const notificationEvent = new CustomEvent('appNotification', {
      detail: {
        type,
        message,
      },
      bubbles: true,
    });
    ReactDOM.findDOMNode(sourceComponent).dispatchEvent(notificationEvent);
  };
}
