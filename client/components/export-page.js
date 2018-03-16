import React, { Component } from 'react';
import { Icon, Button } from 'react-lightning-design-system';
import Image from '../model/image';
import Label from '../model/label';
import ObjectBox from '../model/object-box';
import NotificationHelper from '../util/notification-helper';

export default class ExportPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageCount: 0,
      labelCount: 0,
      objectCount: 0,
    };
  }

  componentDidMount = () => {
    Image.getCount().then((imageCount) => {
      this.setState({ imageCount });
    }, (error) => {
      NotificationHelper.notifyError(this, 'Server error: failed to retrieve image count.', error);
    });
    Label.getCount().then((labelCount) => {
      this.setState({ labelCount });
    }, (error) => {
      NotificationHelper.notifyError(this, 'Server error: failed to retrieve label count.', error);
    });
    ObjectBox.getCount().then((objectCount) => {
      this.setState({ objectCount });
    }, (error) => {
      NotificationHelper.notifyError(this, 'Server error: failed to retrieve object box count.', error);
    });
  }

  render() {
    const { state } = this;
    return (
      <div className='page slds-grid slds-grid_vertical-align-start slds-p-around_small'>
        <article className='slds-card slds-size_1-of-1'>
          <div className='slds-card__header slds-grid'>
            <header className='slds-media slds-media_center slds-has-flexi-truncate'>
              <div className='slds-media__figure slds-context-bar__item'>
                <Icon category='utility' icon='package' size='small' />
              </div>
              <div className='slds-media__body'>
                <h2 className='slds-text-heading_small'>Export</h2>
              </div>
            </header>
          </div>

          <div className='slds-card__body'>
            <dl className='slds-dl_horizontal slds-p-around_small'>
              <dt className='slds-dl_horizontal__label'>Image count:
              </dt>
              <dd className='slds-dl_horizontal__detail'>{state.imageCount}
                <div className='popover-anchor'>
                  <div className='slds-popover slds-nubbin--bottom-left' role='dialog'>
                    <div className='slds-popover__body'>
                      Only includes images with object boxes.
                    </div>
                  </div>
                  <Icon category='utility' icon='info' size='x-small' className='slds-m-horizontal_x-small' />
                </div>
              </dd>
              <dt className='slds-dl_horizontal__label slds-p-top_small'>Label count:</dt>
              <dd className='slds-dl_horizontal__detail slds-p-top_small'>{state.labelCount}</dd>
              <dt className='slds-dl_horizontal__label slds-p-top_small'>Object box count:</dt>
              <dd className='slds-dl_horizontal__detail slds-p-top_small'>{state.objectCount}</dd>
            </dl>
          </div>

          <footer className='slds-card__footer'>
            <a className='slds-button slds-button_brand' href='/api/export'>Export</a>
          </footer>
        </article>
      </div>
    );
  }
}
