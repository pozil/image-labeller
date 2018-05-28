import React, { Component } from 'react';
import ImageProviderSettings from './settings-image-provider';
import AuthenticationSettings from './settings-authentication';
import About from './settings-about';

export default class SettingsPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='page slds-scrollable_y slds-grid slds-wrap slds-grid_vertical-align-start slds-p-around_small'>

        <div className="slds-size_1-of-1">
          <ImageProviderSettings/>
        </div>
        <div className="slds-size_1-of-1 slds-p-top_small">
          <AuthenticationSettings/>
        </div>
        <div className="slds-size_1-of-1 slds-p-top_small">
          <About/>
        </div>

      </div>
    );
  }
}
