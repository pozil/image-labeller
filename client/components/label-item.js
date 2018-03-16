import React, { Component } from 'react';
import { Icon, Button, ButtonGroup, Input } from 'react-lightning-design-system';

export default class LabelItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditMode: false,
      newLabel: '',
    };
  }

  onEditOpen = () => {
    this.setState({
      isEditMode: true,
      newLabel: this.props.label.label,
    });
  }

  onEditCancel = () => this.setState({ isEditMode: false })

  onEditSave = () => {
    const { label } = this.props;
    label.label = this.state.newLabel;
    this.setState({ isEditMode: false });
    this.props.onEdit(label);
  }

  onDelete = () => this.props.onDelete(this.props.label)

  onChangeNewLabel = event => this.setState({ newLabel: event.target.value })

  render() {
    const { label } = this.props;
    return (
      <li className='slds-p-horizontal_small slds-size_1-of-1 slds-medium-size_1-of-3'>
        <article className='slds-tile slds-media slds-card__tile slds-hint-parent'>
          <div className='slds-media__figure'>
            <Icon category='utility' icon='bookmark' size='small' />
          </div>
          <div className='slds-media__body'>

            { this.state.isEditMode ?
              <form className='slds-form_horizontal'>
                <Input placeholder='Label' value={this.state.newLabel} onInput={this.onChangeNewLabel} />
                <ButtonGroup>
                  <Button type='icon-border' icon='close' size='small' onClick={this.onEditCancel} />
                  <Button type='icon-border' icon='save' size='small' onClick={this.onEditSave} disabled={this.state.newLabel === ''} />
                </ButtonGroup>
              </form>
            :
              <div className='slds-grid slds-grid_align-spread slds-has-flexi-truncate'>
                <h3 className='slds-tile__title slds-truncate' title='{label.label}'>{`${label.label} (${label.useCount})`}</h3>
                <div className='slds-shrink-none'>
                  <ButtonGroup>
                    <Button type='icon-border' icon='edit' size='small' onClick={this.onEditOpen} />
                    <Button type='icon-border' icon='delete' size='small' onClick={this.onDelete} />
                  </ButtonGroup>
                </div>
              </div>
            }

          </div>
        </article>
      </li>
    );
  }
}
