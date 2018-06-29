import React, { Component } from 'react';
import { Button, Input, Spinner } from 'react-lightning-design-system';
import Password from './password';
import NotificationHandler from './notification-handler';
import NotificationHelper from '../util/notification-helper';
import Auth from '../model/auth';

export default class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = this.getClearState();
  }

  getClearState = () => {
    return {
      credentials: {
        username: '',
        password: '',
      },
      isFormValid: false,
      isLoading: false
    };
  }
  
  onLogin = () => {
    if (!this.state.isFormValid || this.state.isLoading) {
      return;
    }
    Auth.authenticate(this.state.credentials).then(() => {      
      this.props.onLogin();
    }).catch(error => {
      NotificationHelper.notifyError(this, 'Authentication failed: check your credentials.', error);
      this.setState(this.getClearState());
    });
  }

  onChangeUsername = event => this.updateForm('username', event.target.value)
  onChangePassword = event => this.updateForm('password', event.target.value)
  onKeyDown = event => {
    if (this.state.isLoading) {
      return;
    }
    if (event.key === 'Enter') {
      this.onLogin();
    }
  }

  updateForm = (key, value) => {
    if (this.state.isLoading) {
      return;
    }
    const { credentials } = this.state;
    credentials[key] = value;
    this.setState({ credentials });
    this.updateFormValidity();
  }

  updateFormValidity = () => {
    const { credentials } = this.state;
    const isFormValid = (credentials.username !== '' && credentials.password !== '');
    this.setState({ isFormValid });
  }

  render() {
    const { credentials, isLoading } = this.state;
    return (
      <div>
        <header className='slds-global-header_container'>
          <div className='slds-context-bar'>
            <div className='slds-context-bar__primary'>
              <div className='logo'></div>
              <span className='slds-context-bar__label-action slds-context-bar__app-name'>
                <span className='slds-truncate'>Image Labeller</span>
              </span>
            </div>
          </div>
        </header>

        <NotificationHandler />

        <article className='slds-card login-form slds-p-around_large'>
          
          <div className='slds-media slds-media_center slds-m-bottom_medium'>
            <div className='slds-media__figure'>
              <img src="/gfx/logo-rect.png" alt="App logo" className='logo'/>
            </div>
            <div className='slds-media__body'>
              <div className='slds-text-heading_medium'>Image Labeller</div>
            </div>
          </div>
          
          <div className='slds-form slds-form_stacked'>
            <Input label='Username' value={credentials.username} onInput={this.onChangeUsername} onKeyDown={this.onKeyDown}/>
            <Password label='Password' value={credentials.password} onInput={this.onChangePassword} onKeyDown={this.onKeyDown}/>
            <Button type='brand' onClick={this.onLogin} className='slds-align_absolute-center slds-m-top_large'>Log In</Button>
          </div>
          {isLoading ?
            <div className='loading-mask'>
              <Spinner size='medium' type='brand' />
            </div>
          :
            null
          }

        </article>

      </div>
    );
  }
}
