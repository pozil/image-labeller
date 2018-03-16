import React, { Component } from 'react';
import { Button } from 'react-lightning-design-system';

export default class ObjectItem extends Component {
  remove = () => this.props.onRemoveObject(this.props.object)

  hover = () => this.props.onHoverObject(this.props.object.id)

  stopHover = () => this.props.onHoverObject(null)

  render() {
    const { object } = this.props;
    return (
      <li className='slds-item object-item' onMouseEnter={this.hover} onMouseLeave={this.stopHover}>
        <div className='slds-media slds-media_center slds-media_responsive'>
          <div className='slds-media__body slds-p-left_x-small'>
            <p className='object-label' style={ { color: `rgb(${object.color.r}, ${object.color.g}, ${object.color.b})` } }>{object.label}</p>
          </div>
          <div className='slds-media__figure slds-media__figure_reverse slds-p-right_x-small'>
            <Button icon='delete' iconSize='small' onClick={this.remove} alt='Remove object' />
          </div>
        </div>
      </li>
    );
  }
}
