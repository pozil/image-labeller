import React, { Component } from 'react';
import ImageProviderSettings from './settings-image-provider';
import AuthenticationSettings from './settings-authentication';

export default class Password extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { id, label, value, readOnly, onInput, onKeyDown, required } = this.props;
    return (
      <div className='slds-form-element'>
        <label className='slds-form-element__label' htmlFor={id}>
          {label}
          {required ?
            <abbr className='slds-required' title='required'>*</abbr>
          :
            null
          }
        </label>
        <div className={ `slds-form-element__control ${readOnly ? 'slds-has-divider--bottom' : ''}`}>
          {readOnly ?
            <p id={id} className='slds-text-body--regular slds-form-element__static'>**********</p>
          :
            <input type='password' id={id} value={value} onChange={onInput} onKeyDown={onKeyDown} className='slds-input'/>
          }
        </div>
      </div>
    );
  }
}
