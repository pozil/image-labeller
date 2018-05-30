import React, { Component } from 'react';
import SettingsAssistant from './settings-assistant';
import ImageProviderSettings from './settings-image-provider';
import AuthenticationSettings from './settings-authentication';
import About from './settings-about';
import { Config, CONFIG } from '../model/config';
import { Icon } from 'react-lightning-design-system';

export default class SettingsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      configStatus: [],
      isConfigValid: true,
    }
  }

  componentDidMount = () => {
    this.onConfigUpdated();
  }

  onConfigUpdated = () => {
    const wasConfigValid = this.state.isConfigValid;
    Config.check().then(configStatus => {
      const validItems = configStatus.filter(item => item.status === 'valid');
      const isConfigValid = (validItems.length ===  configStatus.length);
      // Force page refresh if config becomes valid
      if (isConfigValid && !wasConfigValid) {
        window.location = '/';
      }
      else {
        this.setState({ configStatus, isConfigValid });
      }
    });
  }

  render() {
    const { isConfigValid, configStatus } = this.state;
    return (
      <div className='page slds-scrollable_y slds-grid slds-wrap slds-grid_vertical-align-start slds-p-around_small'>

        {!isConfigValid ?
          <SettingsAssistant configStatus={configStatus}/>
        :
          null
        }

        <div className='slds-size_1-of-1'>
          <ImageProviderSettings onUpdate={this.onConfigUpdated}/>
        </div>
        <div className='slds-size_1-of-1 slds-p-top_small'>
          <AuthenticationSettings onUpdate={this.onConfigUpdated}/>
        </div>
        <div className='slds-size_1-of-1 slds-p-top_small'>
          <About/>
        </div>

      </div>
    );
  }
}
