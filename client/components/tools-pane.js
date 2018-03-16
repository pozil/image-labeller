import React, { Component } from 'react';
import { Button } from 'react-lightning-design-system';
import ImageNavigation from './image-navigation';
import ObjectCreationForm from './object-creation-form';
import ObjectList from './object-list';

export default class ToolsPane extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCollapsed: false,
    };
  }

  toggleCollapse = () => {
    const isCollapsed = !this.state.isCollapsed;
    this.setState({ isCollapsed });
    this.props.onToggleCollapse(isCollapsed);
  }

  render() {
    return (
      <div className={`tools-pane ${this.state.isCollapsed ? 'collapsed' : 'slds-size_3-of-12'}` }>
        <Button icon={this.state.isCollapsed ? 'left' : 'right'} iconSize='x-small' onClick={this.toggleCollapse} alt='Toggle tools collapse' />
        <article aria-hidden={this.state.isCollapsed} className='slds-p-around_small'>
          <ImageNavigation
            image={this.props.image}
            imageContext={this.props.imageContext}
            onPreviousImage={this.props.onPreviousImage}
            onNextImage={this.props.onNextImage}
          />
          <ObjectCreationForm
            labels={this.props.labels}
            rect={this.props.rect}
            onAddObject={this.props.onAddObject}
            onSelectionUpdate={this.props.onSelectionUpdate}
          />
          <ObjectList
            objects={this.props.objects}
            onRemoveObject={this.props.onRemoveObject}
            onHoverObject={this.props.onHoverObject}
          />
        </article>
      </div>
    );
  }
}
