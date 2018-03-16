import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalContent, ModalFooter, Input } from 'react-lightning-design-system';
import Label from '../model/label';
import NotificationHelper from '../util/notification-helper';

export default class LabelCreationModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      label: '',
    };
  }

  onChangeLabel = event => this.setState({ label: event.target.value })

  create = () => {
    const { label } = this.state;
    this.props.onClose();
    Label.create({ label }).then(
      (newLabel) => {
        this.props.onCreate(newLabel);
      },
      (error) => {
        let message = 'Server error: failed to create label. ';
        message += (typeof error.detail === 'undefined') ? '' : error.detail;
        NotificationHelper.notifyError(this, message, error);
      },
    );
  }

  render() {
    return (
      <Modal opened={this.props.isOpen}>
        <ModalHeader title='Create Label' />
        <ModalContent>
          <div className='slds-p-around_small slds-form slds-form_stacked'>
            <Input label='Label' value={this.state.label} onInput={this.onChangeLabel} required />
          </div>
        </ModalContent>
        <ModalFooter>
          <Button type='neutral' label='Cancel' onClick={this.props.onClose} />
          <Button type='brand' label='Create' onClick={this.create} disabled={this.state.label === ''} />
        </ModalFooter>
      </Modal>
    );
  }
}
