import React, { Component } from 'react';
import { Icon, Button, Modal, ModalHeader, ModalContent, ModalFooter } from 'react-lightning-design-system';
import Label from '../model/label';
import NotificationHelper from '../util/notification-helper';

export default class LabelDeletionModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      useCount: 0,
    };
  }

  componentWillUpdate = (nextProps) => {
    if (nextProps.label !== null) {
      Label.getUseCount(nextProps.label.id).then((data) => {
        this.setState({ useCount: data.count });
      }, (error) => {
        NotificationHelper.notifyError(this, 'Server error: failed to retrieve label usage.', error);
      });
    }
  }

  delete = () => {
    const { id } = this.props.label;
    this.props.onClose();
    Label.delete(id).then(() => {
      this.props.onDelete(id);
    }, (error) => {
      NotificationHelper.notifyError(this, 'Server error: failed to delete label.', error);
    });
  }

  render() {
    if (this.props.label === null) {
      return null;
    }
    return (
      <Modal opened>
        <ModalHeader title='Delete Label' />
        <ModalContent>
          <div className='slds-p-around_small'>
            <p>Are you sure you want to delete the <b>{this.props.label.label}</b> label?</p>
            {this.state.useCount === 0 ?
              <p className='slds-m-top_small'>Label is safe to delete: it is not used.</p>
              :
              <div className='slds-notify slds-notify_alert slds-theme_alert-texture slds-theme_warning slds-m-top_small' role='alert'>
                <Icon category='utility' icon='warning' size='small' className='slds-m-right_small' />
                Label is used by <b className='slds-m-horizontal_xx-small'>{this.state.useCount}</b> objects.
              </div>
            }
          </div>
        </ModalContent>
        <ModalFooter>
          <Button type='neutral' label='Cancel' onClick={this.props.onClose} />
          <Button type='brand' label='Delete' onClick={this.delete} />
        </ModalFooter>
      </Modal>
    );
  }
}
