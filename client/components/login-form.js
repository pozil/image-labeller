import React, { Component } from 'react';
import { Button } from 'react-lightning-design-system';

export default class LoginForm extends Component {
  login() {
    window.location = '/auth/login';
  }

  render() {
    return (
      <div className='slds-modal slds-fade-in-open'>
        <div className='slds-modal__container'>
          <div className='slds-box'>
            <p className='slds-text-heading_medium slds-m-bottom_medium slds-text-align_center'>Please log in with your Salesforce account:</p>
            <Button type='brand' icon='salesforce1' iconAlign='left' onClick={this.login} className='slds-align_absolute-center'>Log In</Button>
          </div>
        </div>
      </div>
    );
  }
}
