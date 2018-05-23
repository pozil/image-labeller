import React, { Component } from 'react';
import { Notification } from 'react-lightning-design-system';

export default class NotificationHandler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notifEvent: null,
    };
  }

  componentDidMount = () => {
    document.addEventListener('appNotification', (notifEvent) => {
      this.setState({ notifEvent: notifEvent.detail });
    });
  }

  close = () => this.setState({ notifEvent: null })

  render() {
    const { notifEvent } = this.state;
    if (notifEvent === null) {
      return (
        <div>{this.props.children}</div>
      );
    }
    return (
      <div className='slds-notify_container slds-m-top_x-large'>
        <Notification
          type='toast'
          level={notifEvent.type}
          icon={notifEvent.type}
          iconSize='small'
          alertTexture
          onClose={this.close}
        >
          {notifEvent.message}
        </Notification>
      </div>
    );
  }
}
