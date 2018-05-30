import React, { Component } from 'react';
import { Icon, Button, ButtonGroup, Input } from 'react-lightning-design-system';
import NotificationHelper from '../util/notification-helper';
import Password from './password';
import { Cookies, COOKIES } from '../util/cookies';
import { Config, CONFIG } from '../model/config';

export default class AuthenticationSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditMode: false,
      config: {
        username: '',
      },
      backupConfig: null,
      isFormValid: false,
    };
  }

  componentDidMount = () => {
    Config.get(CONFIG.AUTHENTICATION).then((config) => {
      if (config.value !== null) {
        this.setState({ config: config.value });
      }
    }, (error) => {
      NotificationHelper.notifyError(this, 'Server error: failed to retrieve authentication configuration.', error);
    });
  }

  onEdit = () => {
    const config = new Config(CONFIG.AUTHENTICATION, this.state.config);
    this.setState({
      isEditMode: true,
      config: {
        username: config.value.username,
        password: '',
        password_confirmation: '',
      },
      backupConfig: config.clone().value,
    });
    this.updateFormValidity();
  }

  onEditCancel = () => this.setState({
    isEditMode: false,
    config: this.state.backupConfig,
    backupConfig: null,
  })

  onEditSave = () => {
    delete this.state.config.password_confirmation;
    const config = new Config(CONFIG.AUTHENTICATION, this.state.config);
    this.setState({
      isEditMode: false,
      config: {
        username: config.value.username,
        password: '', // Clear password form local memory
      },
      backupConfig: null,
    });
    Config.upsert(config).then(() => {
      NotificationHelper.notifySuccess(this, 'Authentication configuration saved');
      this.props.onUpdate();
    }, (error) => {
      const message = (typeof error.message === 'undefined') ? 'Server error: failed to save authentication configuration.' : error.message;
      NotificationHelper.notifyError(this, message, error);
    });
  }

  onChangeUsername = event => this.updateForm('username', event.target.value)
  onChangePassword = event => this.updateForm('password', event.target.value)
  onChangePasswordConfirmation = event => this.updateForm('password_confirmation', event.target.value)

  updateForm = (key, value) => {
    const { config } = this.state;
    config[key] = value;
    this.setState({ config });
    this.updateFormValidity();
  }

  updateFormValidity = () => {
    const { config } = this.state;
    const isFormValid = (config.username !== ''
      && config.password !== ''
      && config.password_confirmation !== ''
      && config.password === config.password_confirmation);
    this.setState({ isFormValid });
  }

  render() {
    const { isEditMode, config } = this.state;
    return (
      <article className='slds-card'>
        <div className='slds-card__header slds-grid'>
          <header className='slds-media slds-media_center slds-has-flexi-truncate'>
            <div className='slds-media__figure slds-context-bar__item'>
              <Icon category='utility' icon='identity' size='small' />
            </div>
            <div className='slds-media__body'>
              <h2 className='slds-text-heading_small'>Authentication</h2>
            </div>
          </header>
          <div className='slds-no-flex'>
            {isEditMode ?
              <ButtonGroup>
                <Button type='neutral' icon='close' iconAlign='left'onClick={this.onEditCancel}>Cancel</Button>
                <Button type='brand' icon='save' iconAlign='left' onClick={this.onEditSave} disabled={!this.state.isFormValid}>Save</Button>
              </ButtonGroup>
            :
              <Button type='brand' icon='edit' iconAlign='left' onClick={this.onEdit}>Edit</Button>
            }
          </div>
        </div>

        <div className='slds-card__body'>
          <form className='slds-card__body_inner slds-form_horizontal slds-p-bottom_small'>
            <Input label='Username' value={config.username} onInput={this.onChangeUsername} readOnly={!isEditMode} required={isEditMode} />
            <Password label={isEditMode ? 'New password' : 'Password'} value={config.password} onInput={this.onChangePassword} readOnly={!isEditMode} required={isEditMode}/>
            {isEditMode ?
              <Password label='New password confirmation' value={config.password_confirmation} onInput={this.onChangePasswordConfirmation} readOnly={!isEditMode} required={isEditMode}/>
            :
              null
            }
            {isEditMode && config.password !== config.password_confirmation ?
              <div className='slds-text-color_error'>Passwords do not match.</div>
            :
              null
            }
          </form>
        </div>
      </article>
    );
  }
}
