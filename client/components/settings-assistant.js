import React, { Component } from 'react';
import { Config, CONFIG } from '../model/config';
import { Icon } from 'react-lightning-design-system';
import SettingsAssistantStep from './settings-assistant-step';

export default class SettingsAssistant extends Component {
  constructor(props) {
    super(props);
    this.state = this.convertConfigStatusIntoSteps(this.props.configStatus);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.convertConfigStatusIntoSteps(nextProps.configStatus));
  }

  convertConfigStatusIntoSteps(configStatus) {
    const validItems = configStatus.filter(item => item.status === 'valid');
    const progress = Math.ceil((validItems.length / configStatus.length) * 100);

    const configSteps = configStatus.map(configItem => {
      const step = {
        key: configItem.key,
      }
      switch (configItem.key) {
        case CONFIG.AUTHENTICATION:
          step.title = 'Authentication';
          step.message = 'Set up a password for your account.';
        break;
        case CONFIG.IMAGE_PROVIDER:
          step.title = 'Image provider';
          step.message = 'Configure your Cloudinary API access.';
        break;
        default:
          step.title = 'Unkown config: '+ configItem.key;
          step.message = 'This looks like a bug, sorry :(';
        break;
      }
      step.icon = (configItem.status === 'valid') ? 'success' : 'warning';
      step.iconClass = (configItem.status === 'valid') ? 'success' : 'warning';
      return step;
    });
    return { configSteps, progress };
  }

  render() {
    const { configSteps, progress } = this.state;
    return (
      <div className='slds-size_1-of-1 slds-p-bottom_small'>
        <section className='slds-card'>
          <header className='slds-theme_shade slds-p-around_medium'>
            <div>
              <div className='slds-grid slds-grid_align-spread slds-p-bottom_x-small' id='progress-bar-label-id'>
                <span>Complete all the steps below to finish setting up the app</span>
                <span aria-hidden='true'>
                  <strong>{`${progress}% Complete`}</strong>
                </span>
              </div>
              <div className='slds-progress-bar slds-progress-bar_circular' aria-valuemin='0' aria-valuemax='100' aria-valuenow={progress} aria-labelledby='progress-bar-label-id' role='progressbar'>
                <span className='slds-progress-bar__value slds-progress-bar__value_success' style={{width: (progress === 0) ? '5px' : progress +'%'}}>
                  <span className='slds-assistive-text'>
                    {`Progress ${progress}%`}
                  </span>
                </span>
              </div>
            </div>
          </header>

          <div className='slds-p-around_medium'>
            {configSteps.map(step => (
              <SettingsAssistantStep key={step.key} step={step}/>
            ))}
          </div>
        </section>
      </div>
    );
  }
}
