import React, { Component } from 'react';
import { Icon } from 'react-lightning-design-system';

export default class SettingsAssistantStep extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    const { step } = this.props;
    return (
      <div className='slds-media slds-m-top_x-small'>
        <div className='slds-media__figure'>
          <Icon category='utility' icon={step.icon} className={step.iconClass} size='small' />
        </div>
        <div className='slds-media__body'>
          <h3 className='slds-setup-assistant__step-summary-title slds-text-heading_small'>{step.title}</h3>
          <p>{step.message}</p>
        </div>
      </div>
    );
  }
}
