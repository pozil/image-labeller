import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
} from 'react-router-dom';
import NotificationHandler from './notification-handler';
import NotificationHelper from '../util/notification-helper';
import AppHeader from './app-header';
import LoginPage from './login-page';
import EditorPage from './editor-page';
import ImagePage from './image-page';
import LabelPage from './label-page';
import ExportPage from './export-page';
import SettingsPage from './settings-page';
import Auth from '../model/auth';
import Config from '../model/config';
import Image from '../model/image';
import ProvidedImage from '../model/provided-image';
import { Cookies, COOKIES } from '../util/cookies';

const IMAGE_PAGE_SIZE = 50;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      isConfigValid: true,
      images: [],
      imageContext: {
        index: 0,
        count: 0,
        nextCursor: null,
      },
    };
  }

  componentDidMount = () => {
    Auth.isAuthenticated().then(result => {
      if (result.isAuthenticated === true) {
        this.onLogin();
      }
    });
  }

  loadImageConfig = () => {
    if (Cookies.get(COOKIES.IMAGE_BASE_URL) === null) {
      Config.get('imageProvider').then(config => {
        if (config.value === null) {
          this.setState({ isConfigValid: false });
        } else {
          Cookies.set(COOKIES.IMAGE_BASE_URL, `https://res.cloudinary.com/${config.value.cloud_name}`);
          this.loadMoreImages();
        }
      }, (error) => {
        NotificationHelper.notifyError(this, 'Server error: failed to retrieve configuration.', error);
      });
    }
    else {
      this.loadMoreImages();
    }
  }

  loadMoreImages = (moveToNextImage=false) => {
    const { imageContext } = this.state;
    const imageBaseUrl = Cookies.get(COOKIES.IMAGE_BASE_URL);
    ProvidedImage.getAll(IMAGE_PAGE_SIZE, imageContext.nextCursor).then((data) => {
      imageContext.nextCursor = (typeof data.next_cursor === 'undefined') ? null : data.next_cursor;
      const newImages = data.resources.map(image => ({
        originalSizeUrl: `${imageBaseUrl}/image/upload/${image.public_id}.${image.format}`,
        thumbnailUrl: `${imageBaseUrl}/image/upload/c_scale,w_100/${image.public_id}.${image.format}`,
        filename: `${image.public_id}.${image.format}`,
      }));
      const images = this.state.images.concat(newImages);
      imageContext.count = images.length;
      this.setState({
        images,
        imageContext,
      });
      if (moveToNextImage) {
        this.updateImageIndex(imageContext.index +1);
      } else {
        this.updateImageIndex(imageContext.index);
      }
    }, (error) => {
      NotificationHelper.notifyError(this, 'Server error: failed to retrieve images.', error);
    });
  }

  updateImageIndex = (index) => {
    const { imageContext, images } = this.state;
    imageContext.index = index;
    this.setState({ imageContext });
    // Pre-load image internal id
    const image = images[index];
    if (typeof image.id === 'undefined') {
      Image.getFromFilename(image.filename)
      .then((imageData) => {
        if (imageData.image !== null) {
          images[index].id = imageData.image.id;
          this.setState({ images });
        }
      });
    }
  }

  clearCurrentImageId = () => {
    const { imageContext, images } = this.state;
    delete images[imageContext.index].id;
    this.setState({ images });
  }

  forceImageListRefresh = () => {
    this.setState({
      images: [],
      imageContext: {
        index: 0,
        nextCursor: null,
      },
    });
    this.loadMoreImages();
  }

  onLogin = () => {
    this.setState({ isLoggedIn: true });
    this.loadImageConfig();
  }

  render() {
    const { isLoggedIn, isConfigValid } = this.state;
    return (
      <Router>
          {isLoggedIn ?
            <div>
              <AppHeader isConfigValid={isConfigValid} />
              <NotificationHandler />

              <Route
                exact
                path='/'
                render={
                () => (
                  isConfigValid ? (
                    <EditorPage
                      images={this.state.images}
                      imageContext={this.state.imageContext}
                      onLoadMoreImages={this.loadMoreImages}
                      onUpdateImageIndex={this.updateImageIndex}
                      onDbImageDeleted={this.clearCurrentImageId}
                    />
                  ) : (
                    <Redirect to='/settings' />
                  )
                )}
              />
              <Route
                path='/images'
                render={
                () => (
                  <ImagePage
                    images={this.state.images}
                    imageContext={this.state.imageContext}
                    onLoadMoreImages={this.loadMoreImages}
                    onUpdateImageIndex={this.updateImageIndex}
                    onForceImageListRefresh={this.forceImageListRefresh}
                  />
                )}
              />
              <Route path='/labels' component={LabelPage} />
              <Route path='/export' component={ExportPage} />
              <Route path='/settings' component={SettingsPage} />
              <Route path='/logout' component={LoginPage} />
            </div>
          :
            <LoginPage onLogin={this.onLogin}/>
          }

      </Router>
    );
  }
}
