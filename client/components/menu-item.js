import React from 'react';
import {
  Route,
  Link,
} from 'react-router-dom';
import { Icon } from 'react-lightning-design-system';

const MenuItem = ({ icon, label, to, activeOnlyWhenExact, enabled = true }) => (
  <Route path={to} exact={activeOnlyWhenExact} children={({ match }) => (
    <li className={ `slds-context-bar__item ${enabled ? (match ? 'slds-is-active' : '') : 'disabled slds-no-hover'}`}>
      {enabled ? (
        <Link to={to} className='slds-context-bar__label-action' title={label}>
          <Icon category='utility' icon={icon} size='x-small' className='slds-m-right_x-small' />
          <span>{label}</span>
        </Link>
      ) : (
        <div className='slds-context-bar__label-action' title={label}>
          <Icon category='utility' icon={icon} size='x-small' className='slds-m-right_x-small' />
          <span>{label}</span>
        </div>
      )}
    </li>
  )}
  />
);

export default MenuItem;
