import React from 'react';
import ObjectItem from './object-item';

const ObjectList = ({ objects, onRemoveObject, onHoverObject }) => (
  <div className='object-list slds-border_top slds-p-top_small'>
    <div className='slds-text-title_caps slds-m-bottom_small'>Objects</div>
    <div className='slds-scrollable_y'>
      <ul className='slds-has-dividers_around'>
        {objects.map(object => (
          <ObjectItem
            object={object}
            key={object.id}
            onRemoveObject={onRemoveObject}
            onHoverObject={onHoverObject}
          />
        ))}
      </ul>
    </div>
  </div>
);

export default ObjectList;
