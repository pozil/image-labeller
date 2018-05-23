import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Icon, DropdownButton, DropdownMenuItem, ButtonGroup, Button } from 'react-lightning-design-system';

class ImagePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: {
        showFilename: false,
        showLabelledImages: true,
        showUnlabelledImages: true,
      },
    };
  }

  toggleShowFilename = () => this.toggleSettingsFlag('showFilename')
  toggleShowLabelledImage = () => this.toggleSettingsFlag('showLabelledImages')
  toggleShowUnlabelledImage = () => this.toggleSettingsFlag('showUnlabelledImages')

  toggleSettingsFlag = (key) => {
    const { settings } = this.state;
    settings[key] = !settings[key];
    this.setState({ settings });
  }

  navigateToImage = event => {
    const imageFilename = event.target.id;
    const imageIndex = this.props.images.findIndex(image => image.filename === imageFilename);
    if (imageIndex !== -1) {
      this.props.onUpdateImageIndex(imageIndex);
    }
    this.props.history.push('/');
  }

  render() {
    const { settings } = this.state;
    const { images, imageContext } = this.props;
    return (
      <div className='page slds-grid slds-p-around_small'>
        <article className='slds-card slds-size_1-of-1 slds-scrollable_y'>
          <div className='slds-card__header slds-grid'>
            <header className='slds-media slds-media_center slds-has-flexi-truncate'>
              <div className='slds-media__figure slds-context-bar__item'>
                <Icon category='utility' icon='image' size='small' />
              </div>
              <div className='slds-media__body'>
                <h2 className='slds-text-heading_small'>Images ({imageContext.nextCursor === null ? images.length : `${images.length}+` })</h2>
              </div>
            </header>
            <div className='slds-no-flex'>
              <ButtonGroup>
                <Button type='icon-border' icon='refresh' size='medium' onClick={this.props.onForceImageListRefresh} />
                <DropdownButton type='icon-more' icon='settings' menuAlign='right'>
                  <DropdownMenuItem icon={settings.showFilename ? 'check' : 'none'} onClick={this.toggleShowFilename}>Show file names</DropdownMenuItem>
                  <DropdownMenuItem icon={settings.showLabelledImages ? 'check' : 'none'} onClick={this.toggleShowLabelledImage}>Show labelled images</DropdownMenuItem>
                  <DropdownMenuItem icon={settings.showUnlabelledImages ? 'check' : 'none'} onClick={this.toggleShowUnlabelledImage}>Show unlabelled images</DropdownMenuItem>
                </DropdownButton>
              </ButtonGroup>
            </div>
          </div>

          <div className='slds-card__body'>
            <div className='slds-card__body_inner slds-grid slds-wrap slds-grid_pull-padded'>
              {images.map(image => (
                <a className='slds-col slds-p-bottom_small slds-text-align_center' key={image.filename} href="javascript:void(0)" onClick={this.navigateToImage}>
                  <img src={image.thumbnailUrl} id={image.filename} alt={image.filename} title={image.filename}/>
                  {settings.showFilename &&
                    <p>{image.filename}</p>
                  }
                </a>
              ))}
              {imageContext.nextCursor !== null &&
                <div className='slds-size_1-of-1 slds-m-vertical_medium slds-text-align_center'>
                  <span className='slds-badge slds-text-link' onClick={this.props.onLoadMoreImages}>Load more...</span>
                </div>
              }
            </div>
          </div>
        </article>

      </div>
    );
  }
}

export default withRouter(ImagePage);
