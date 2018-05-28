import React, { Component } from 'react';
import { Icon, Button } from 'react-lightning-design-system';
import LabelItem from './label-item';
import LabelCreationModal from './label-creation-modal';
import LabelDeletionModal from './label-deletion-modal';
import Label from '../model/label';
import NotificationHelper from '../util/notification-helper';

export default class LabelPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      labels: [],
      deletedLabel: null,
      isCreateModalOpen: false,
    };
  }

  componentDidMount = () => {
    Label.getAll().then((labels) => {
      this.setState({ labels });
      Label.getUseCountForAll().then((useCounts) => {
        const updatedLabels = this.state.labels.map((label) => {
          const countData = useCounts.find(use => use.label_id === label.id);
          label.useCount = (typeof countData === 'undefined') ? 0 : countData.count;
          return label;
        });
        this.setState({ labels: updatedLabels });
      }, (error) => {
        NotificationHelper.notifyError(this, 'Server error: failed to retrieve label stats.', error);
      });
    }, (error) => {
      NotificationHelper.notifyError(this, 'Server error: failed to retrieve labels.', error);
    });
  }

  onDeleteLabel = (labelId) => {
    const filteredLabels = this.state.labels.filter(label => label.id !== labelId);
    this.setState({ labels: filteredLabels });
  }

  onCreateLabel = (label) => {
    label.useCount = 0;
    const { labels } = this.state;
    labels.push(label);
    this.setState({ labels });
  }

  displayCreateModal = () => this.setState({ isCreateModalOpen: true })

  displayDeleteModal = label => this.setState({ deletedLabel: label })

  closeCreateModal = () => this.setState({ isCreateModalOpen: false })

  closeDeleteModal = () => this.setState({ deletedLabel: null })

  edit = (label) => {
    Label.update(label);
  }

  render() {
    const { labels } = this.state;
    return (
      <div className='page slds-grid slds-grid_vertical-stretch slds-p-around_small'>
        <article className='slds-card slds-size_1-of-1 slds-scrollable_y'>
          <div className='slds-card__header slds-grid'>
            <header className='slds-media slds-media_center slds-has-flexi-truncate'>
              <div className='slds-media__figure slds-context-bar__item'>
                <Icon category='utility' icon='bookmark' size='small' />
              </div>
              <div className='slds-media__body'>
                <h2 className='slds-text-heading_small'>Labels ({labels.length})</h2>
              </div>
            </header>
            <div className='slds-no-flex'>
              <Button type='brand' icon='add' iconAlign='left' onClick={this.displayCreateModal}>New</Button>
            </div>
          </div>

          <div className='slds-card__body'>
            <ul className='slds-card__body_inner slds-grid slds-wrap slds-grid_pull-padded'>

              {labels.map(label => (
                <LabelItem label={label} key={label.id} onEdit={this.edit} onDelete={this.displayDeleteModal} />
              ))}

            </ul>
          </div>
        </article>

        <LabelDeletionModal label={this.state.deletedLabel} onClose={this.closeDeleteModal} onDelete={this.onDeleteLabel} />

        <LabelCreationModal isOpen={this.state.isCreateModalOpen} onClose={this.closeCreateModal} onCreate={this.onCreateLabel} />

      </div>
    );
  }
}
