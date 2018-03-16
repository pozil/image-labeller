import React, { Component } from 'react';
import { Button, Select, Option } from 'react-lightning-design-system';

export default class ObjectCreationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      labelId: '',
    };
  }

  onChangeLabel = event => this.setState({ labelId: event.target.value })

  onChangeX = event => this.updateRect('x', event.target.value)

  onChangeY = event => this.updateRect('y', event.target.value)

  onChangeW = event => this.updateRect('w', event.target.value)

  onChangeH = event => this.updateRect('h', event.target.value)

  addObject = () => {
    const { rect } = this.props;
    rect.label_id = parseInt(this.state.labelId, 10);
    this.props.onAddObject(rect);
  }

  updateRect = (key, value) => {
    if (!Number.isNaN(value)) {
      const { rect } = this.props;
      rect[key] = parseInt(value, 10);
      this.props.onSelectionUpdate(rect);
    }
  }

  render() {
    return (
      <div className='new-object-form slds-border_top slds-p-top_small slds-m-bottom_medium'>
        <div className='slds-text-title_caps slds-m-bottom_small'>New Object</div>
        <form className='slds-form_horizontal'>
          <Select label='Label' onChange={this.onChangeLabel}>
            <Option value=''>-</Option>
            {this.props.labels.map(label =>
              <Option value={label.id} key={label.id}>{label.label}</Option>)}
          </Select>

          <div className='slds-form-element'>
            <label className='slds-form-element__label' htmlFor='input-x'>x</label>
            <div className='slds-form-element__control'>
              <input type='number' id='input-x' className='slds-input' value={this.props.rect.x} onInput={this.onChangeX} min='0' />
            </div>
          </div>

          <div className='slds-form-element'>
            <label className='slds-form-element__label' htmlFor='input-y'>y</label>
            <div className='slds-form-element__control'>
              <input type='number' id='input-y' className='slds-input' value={this.props.rect.y} onInput={this.onChangeY} min='0' />
            </div>
          </div>

          <div className='slds-form-element'>
            <label className='slds-form-element__label' htmlFor='input-w'>Width</label>
            <div className='slds-form-element__control'>
              <input type='number' id='input-w' className='slds-input' value={this.props.rect.w} onInput={this.onChangeW} min='0' />
            </div>
          </div>

          <div className='slds-form-element'>
            <label className='slds-form-element__label' htmlFor='input-h'>Height</label>
            <div className='slds-form-element__control'>
              <input type='number' id='input-h' className='slds-input' value={this.props.rect.h} onInput={this.onChangeH} min='0' />
            </div>
          </div>

        </form>
        <Button type='brand' icon='add' iconAlign='left' onClick={this.addObject} disabled={this.state.labelId === ''} className='slds-align_absolute-center slds-m-top_small'>Add Object</Button>
      </div>
    );
  }
}
