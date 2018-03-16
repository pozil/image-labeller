import React, { Component } from 'react';
import { Icon, Button, ButtonGroup, Input } from 'react-lightning-design-system';
import NotificationHelper from '../util/notification-helper';
import { Cookies, COOKIES } from '../util/cookies';
import Config from '../model/config';

export default class SettingsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditMode: false,
      config: {
        cloud_name: '',
        api_key: '',
        api_secret: '',
      },
      backupConfig: null,
      isFormValid: false,
    };
  }

  componentDidMount = () => {
    Config.get('imageProvider').then((config) => {
      if (config.value !== null) {
        this.setState({ config: config.value });
      }
    }, (error) => {
      NotificationHelper.notifyError(this, 'Server error: failed to retrieve configuration.', error);
    });
  }

  onEdit = () => {
    const config = new Config('imageProvider', this.state.config);
    this.setState({
      isEditMode: true,
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
    const config = new Config('imageProvider', this.state.config);
    this.setState({
      isEditMode: false,
      backupConfig: null,
    });
    Config.upsert(config).then(() => {
      NotificationHelper.notifySuccess(this, 'Configuration validated');
      // Refresh page if config is not initialized
      if (Cookies.get(COOKIES.IMAGE_BASE_URL) === null) {
        window.location = '/';
      }
    }, (error) => {
      const message = (typeof error.message === 'undefined') ? 'Server error: failed to save configuration.' : error.message;
      NotificationHelper.notifyError(this, message, error);
    });
  }

  onChangeCloudName = event => this.updateForm('cloud_name', event.target.value)

  onChangeApiKey = event => this.updateForm('api_key', event.target.value)

  onChangeApiSecret = event => this.updateForm('api_secret', event.target.value)

  updateForm = (key, value) => {
    const { config } = this.state;
    config[key] = value;
    this.setState({ config });
    this.updateFormValidity();
  }

  updateFormValidity = () => {
    const { config } = this.state;
    const isFormValid = (config.cloud_name !== ''
      && config.api_key !== ''
      && config.api_secret !== '');
    this.setState({ isFormValid });
  }

  render() {
    const { isEditMode, config } = this.state;
    return (
      <div className='page slds-grid slds-grid_vertical-align-start slds-p-around_small'>

        <article className='slds-card slds-size_1-of-1'>
          <div className='slds-card__header slds-grid'>
            <header className='slds-media slds-media_center slds-has-flexi-truncate'>
              <div className='slds-media__figure slds-context-bar__item'>
                <Icon category='utility' icon='image' size='small' />
              </div>
              <div className='slds-media__body'>
                <h2 className='slds-text-heading_small'>Image Provider: Cloudinary</h2>
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
              <Input label='Cloud name' value={config.cloud_name} onInput={this.onChangeCloudName} readOnly={!isEditMode} required={isEditMode} />
              <Input label='API key' value={config.api_key} onInput={this.onChangeApiKey} readOnly={!isEditMode} required={isEditMode} />
              <Input label='API secret' value={config.api_secret} onInput={this.onChangeApiSecret} readOnly={!isEditMode} required={isEditMode} />
            </form>
          </div>
        </article>
      </div>
    );
  }
}
