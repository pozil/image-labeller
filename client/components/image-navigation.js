import React from 'react';
import { Button } from 'react-lightning-design-system';

const ImageNavigation = ({ image, imageContext, onPreviousImage, onNextImage }) => (
  <div className='slds-text-align_center slds-m-bottom_small'>
    <div className='slds-truncate'>{image === null ? 'n/a' : image.filename}</div>
    <div>
      <Button icon='left' onClick={onPreviousImage} alt='Previous image' disabled={ image === null || imageContext.index <= 0 } />
      <span className='slds-m-horizontal_medium'>{ imageContext.index + 1 }/{ imageContext.nextCursor === null ? imageContext.count : `${imageContext.count}+`}</span>
      <Button icon='right' onClick={onNextImage} alt='Next image' disabled={ image === null || imageContext.index >= imageContext.count - 1 } />
    </div>
  </div>
);

export default ImageNavigation;
