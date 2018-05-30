import React, { Component } from 'react';
import { Icon } from 'react-lightning-design-system';

export default class About extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <article className='slds-card'>
        <div className='slds-card__header slds-grid'>
          <header className='slds-media slds-media_center slds-has-flexi-truncate'>
            <div className='slds-media__figure slds-context-bar__item'>
              <Icon category='utility' icon='info' size='small'/>
            </div>
            <div className='slds-media__body'>
              <h2 className='slds-text-heading_small'>About</h2>
            </div>
          </header>
        </div>

        <div className='slds-card__body'>
          <div className='slds-card__body_inner slds-p-bottom_small'>
            <p className='slds-text-heading_medium'>Image Labeller</p>
            <p>v1.0.0 <a href='https://github.com/pozil/image-labeller' target='_blank' className='slds-p-left_small'>Project page</a></p>
            
            <div className='slds-media slds-media_center slds-p-vertical_small slds-p-left_small'>
              <div className='slds-media__figure'>
                <Icon category='utility' icon='socialshare' size='small'/>
              </div>
              <div className='slds-media__body'>
                <p>Philippe Ozil</p>
                <p><a href='https://twitter.com/PhilippeOzil' target='_blank'>@PhilippeOzil</a></p>
                <p><a href='https://www.linkedin.com/in/philippeozil' target='_blank'>in/PhilippeOzil</a></p>
              </div>
            </div>

            <p>This tool is provided “as is“ without any warranty or support. Salesforce does not officially endorse it.</p>
          </div>
        </div>
      </article>
    );
  }
}
