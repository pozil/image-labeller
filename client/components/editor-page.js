import React, { Component } from 'react';
import ToolsPane from './tools-pane';
import Label from '../model/label';
import ObjectBox from '../model/object-box';
import Canvas from '../util/canvas';
import NotificationHelper from '../util/notification-helper';

export default class EditorPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canvas: null,
      isToolsPaneCollapsed: false,
      objects: [],
      labels: [],
      rect: {
        x: 0,
        y: 0,
        w: 0,
        h: 0,
      },
    };
  }

  componentDidMount = () => {
    this.setState({ canvas: new Canvas(this.updateRect) });

    Label.getAll().then((labels) => {
      this.setState({ labels });
    }, (error) => {
      NotificationHelper.notifyError(this, 'Server error: failed to retrieve labels.', error);
    });

    if (this.props.images.length > 0) {
      const imageIndex = this.props.imageContext.index;
      if (typeof this.props.images[imageIndex].id !== 'undefined') {
        this.loadImageObjects(this.props.images[imageIndex].id);
      }
    }

    window.addEventListener('keyup', this.onKeyUp);
  }

  componentWillReceiveProps(nextProps) {
    const nextIndex = nextProps.imageContext.index;
    if (typeof nextProps.images[nextIndex].id !== 'undefined') {
      this.loadImageObjects(nextProps.images[nextIndex].id);
    }
  }

  componentWillUpdate = () => {
    if (this.state.canvas !== null) {
      this.state.canvas.draw();
    }
  }

  componentWillUnmount = () => {
    window.removeEventListener('keyup', this.onKeyUp);
    this.state.canvas.destroy();
  }

  onKeyUp = (e) => {
    switch (e.keyCode) {
      case 37:
        this.previousImage();
        break;
      case 39:
        this.nextImage();
        break;
      default:
        break;
    }
  }

  setToolsCollapsed = (isToolsPaneCollapsed) => {
    this.setState({ isToolsPaneCollapsed });
    setTimeout(this.state.canvas.resizeImage, 50);
  }

  getRandomColor = () => ({
    r: Math.floor(Math.random() * 256),
    g: Math.floor(Math.random() * 256),
    b: Math.floor(Math.random() * 256),
  })

  getLabel = (labelId) => {
    const foundLabel = this.state.labels.find(label => label.id === labelId);
    return (typeof foundLabel === 'undefined') ? null : foundLabel.label;
  }

  hoverObject = (objectId) => {
    this.state.canvas.setHoveredObject(objectId);
  }

  addObject = (newObject) => {
    const image = this.props.images[this.props.imageContext.index];
    const scale = this.state.canvas.getImageScale();
    const newBox = new ObjectBox(newObject);
    // Check if image is in DB (has an internal id), if not use its filename
    if (typeof image.id === 'undefined') {
      newBox.image_id = null;
      newBox.image_filename = image.filename; 
    } else { // Image is in DB, use its id
      newBox.image_id = image.id;
    }
    newBox.toImageScale(scale);
    // Create box
    ObjectBox.create(newBox).then((box) => {
      const { canvas, objects } = this.state;
      canvas.resetRect();
      box.color = this.getRandomColor();
      box.label = this.getLabel(box.label_id);
      objects.push(box);
      this.setState({ objects });
      canvas.setObjects(objects);
      // Save newly assigned image id by forcing refresh
      if (typeof image.id === 'undefined') {
        this.props.onUpdateImageIndex(this.props.imageContext.index);
      }
    }, (error) => {
      NotificationHelper.notifyError(this, 'Server error: failed to create object box.', error);
    });
  }

  removeObject = (object) => {
    ObjectBox.delete(object).then((result) => {
      const filteredObjects = this.state.objects.filter(anObject => anObject.id !== object.id);
      this.setState({ objects: filteredObjects });
      this.state.canvas.setObjects(filteredObjects);
      if (result.wasLastObject) {
        this.props.onDbImageDeleted();
      }
    }, (error) => {
      NotificationHelper.notifyError(this, 'Server error: failed to remove object box.', error);
    });
  }

  updateRect = rect => this.setState({ rect })

  loadImageObjects = (imageId) => {
    ObjectBox.getFromImage(imageId).then((remoteObjects) => {
      const objects = remoteObjects.map((object) => {
        object.color = this.getRandomColor();
        object.label = this.getLabel(object.label_id);
        return object;
      });
      this.setState({ objects });
      this.state.canvas.setObjects(objects);
    }, (error) => {
      NotificationHelper.notifyError(this, 'Server error: failed to retrieve object boxes.', error);
    });
  }

  previousImage = () => {
    const objects = [];
    this.setState({ objects });
    this.state.canvas.setObjects(objects);
    const { index } = this.props.imageContext;
    if (index <= 0) {
      return;
    }
    this.props.onUpdateImageIndex(index - 1);
  }

  nextImage = () => {
    const objects = [];
    this.setState({ objects });
    this.state.canvas.setObjects(objects);
    const { index, nextCursor } = this.props.imageContext;
    if (index > this.props.images.length - 2 && nextCursor === null) {
      return;
    }
    if (index === this.props.images.length - 1) {
      this.props.onLoadMoreImages(true);
    } else {
      this.props.onUpdateImageIndex(index + 1);
    }
  }

  render() {
    const { images, imageContext } = this.props;
    return (
      <div className='page slds-grid slds-grid_vertical-stretch'>

        <div className={ `editor-pane slds-p-around_small ${this.state.isToolsPaneCollapsed ? 'slds-size_12-of-12 slds-p-right_large' : 'slds-size_9-of-12'}` }>
          <img
            id='img'
            src={ imageContext.count === 0 ? 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=' : `${images[imageContext.index].originalSizeUrl}` }
            alt={ imageContext.count === 0 ? 'No image loaded' : `${images[imageContext.index].filename}` }
          />
          <canvas id='canvas' />
        </div>
        <ToolsPane
          image={ imageContext.count === 0 ? null : images[imageContext.index] }
          imageContext={imageContext}
          labels={this.state.labels}
          objects={this.state.objects}
          rect={this.state.rect}
          onToggleCollapse={this.setToolsCollapsed}
          onPreviousImage={this.previousImage}
          onNextImage={this.nextImage}
          onAddObject={this.addObject}
          onRemoveObject={this.removeObject}
          onHoverObject={this.hoverObject}
          onSelectionUpdate={this.updateRect}
        />
      </div>
    );
  }
}
