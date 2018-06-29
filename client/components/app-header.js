import React, { Component } from 'react';
import MenuItem from './menu-item';
import { Icon } from 'react-lightning-design-system';
import Auth from '../model/auth';

export default class AppHeader extends Component {
  onLogout = () => {
    Auth.logout();
  }
  
  render() {
    const { isConfigValid } = this.props;
    return (
      <header className='slds-global-header_container'>
        <div className='slds-context-bar'>
          <div className='slds-context-bar__primary'>
            <div className='logo'></div>
            <span className='slds-context-bar__label-action slds-context-bar__app-name'>
              <span className='slds-truncate'>Image Labeller</span>
            </span>
          </div>

          <nav className='slds-context-bar__secondary'>
          <ul className='slds-grid'>
            <MenuItem activeOnlyWhenExact to='/' icon='brush' label='Editor' enabled={isConfigValid} />
            <MenuItem to='/images' icon='image' label='Images' enabled={isConfigValid} />
            <MenuItem to='/labels' icon='bookmark' label='Labels' enabled={isConfigValid} />
            <MenuItem to='/export' icon='package' label='Export' enabled={isConfigValid} />
          </ul>
          </nav>

          <nav className='app-controls slds-context-bar__secondary slds-p-right_small'>
            <ul className='slds-grid'>
              <MenuItem to='/settings' icon='settings' label='Settings' />
              <li className='slds-context-bar__item'>
                <a href='javascrip:void(0)' onClick={this.onLogout} className='slds-context-bar__label-action' title='Logout'>
                  <Icon category='utility' icon='logout' size='x-small' className='slds-m-right_x-small' />
                  <span>Logout</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>

      </header>
    );
  }
}
