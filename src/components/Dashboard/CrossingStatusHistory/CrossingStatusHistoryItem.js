import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import classnames from 'classnames';

import { displayedInputs } from 'constants/StatusConstants';
import StatusIcon from 'components/Shared/StatusIcon';
import 'components/Dashboard/CrossingStatusHistory/CrossingStatusHistory.css';
import Date from 'components/Shared/DateTime/Date';
import Hour from 'components/Shared/DateTime/Hour';

const ReasonDurationNotes = ({
  shouldDisplayReason,
  shouldDisplayDuration,
  shouldDisplayNotes,
  reason,
  duration,
  notes,
  smallSize,
}) => (
  <div className="CrossingStatusHistoryItem__reason-duration-notes">
    <div className="CrossingStatusHistoryItem__reason-duration">
      {shouldDisplayReason && (
        <div className="CrossingStatusHistoryItem__reason">
          <span className="CrossingStatusHistoryItem__subdetails-title">
            Reason
          </span>
          <div className="CrossingStatusHistoryItem__subdetails-content">
            {reason}
          </div>
        </div>
      )}
      {shouldDisplayDuration && (
        <div className="CrossingStatusHistoryItem__duration">
          <span className="CrossingStatusHistoryItem__subdetails-title">
            Expected Reopen
          </span>
          <div className="CrossingStatusHistoryItem__subdetails-content">
            {duration}
          </div>
        </div>
      )}
      {shouldDisplayNotes &&
        smallSize && (
          <div className="CrossingStatusHistoryItem__notes">
            <span className="CrossingStatusHistoryItem__subdetails-title">
              Notes
            </span>
            <div className="CrossingStatusHistoryItem__subdetails-content">
              {notes}
            </div>
          </div>
        )}
    </div>
    {shouldDisplayNotes &&
      !smallSize && (
        <div className="CrossingStatusHistoryItem__notes">
          <span className="CrossingStatusHistoryItem__subdetails-title">
            Notes
          </span>
          <div className="CrossingStatusHistoryItem__subdetails-content">
            {notes}
          </div>
        </div>
      )}
  </div>
);

class CrossingStatusHistoryItem extends Component {
  static propTypes = {
    showNames: PropTypes.bool,
  }

  static defaultProps = {
    showNames: false,
  }

  render() {
    const { update, showNames, measure, cqParams } = this.props;
    const user = get(update, 'userByCreatorId', {});
    const statusId = get(update, 'statusByStatusId.id', '--');
    const status = get(update, 'statusByStatusId.name', '--');
    const reason = get(
      update,
      'statusReasonByStatusReasonId.name',
      'Unconfirmed',
    );
    const duration = get(update, 'statusDurationByStatusDurationId.name', '--');
    const createdAt = get(update, 'createdAt', '--');
    const crossingId = get(update, 'crossingId');
    const crossingName = get(update, 'crossingByCrossingId.name');
    const notes = update.notes ? update.notes : '--';
    const shouldDisplay = displayedInputs[statusId];

    return (
      <div className="CrossingStatusHistoryItem">
        {showNames && (
          <div className="CrossingStatusHistoryItem__crossing-name">
            <a
              href={`/dashboard/crossing/${crossingId}`}
              className="PublicCrossingListItem__crossing-name"
            >
              {crossingName}
            </a>
          </div>
        )}
        <div className="CrossingStatusHistoryItem__status">
          <div>
            <StatusIcon
              statusId={statusId}
              onLoad={measure}
              alt={shouldDisplay.status}
              className="CrossingStatusHistoryItem__status-icon"
            />
          </div>
          <div className="CrossingStatusHistoryItem__details-container">
            <div className="CrossingStatusHistoryItem__details">
              <div className="CrossingStatusHistoryItem__status-and-author">
                <span className="CrossingStatusHistoryItem__subdetails-title">
                  {status}
                </span>
                <div className="CrossingStatusHistoryItem__author">
                  <span>by </span>
                  <span className="CrossingStatusHistoryItem__author-name">
                    {user.firstName.substring(0, 1) + '. ' + user.lastName}
                  </span>
                </div>
              </div>
              {cqParams.fullsize && (
                <ReasonDurationNotes
                  shouldDisplayReason={shouldDisplay.reason}
                  shouldDisplayDuration={shouldDisplay.duration}
                  shouldDisplayNotes={shouldDisplay.notes}
                  reason={reason}
                  duration={duration}
                  notes={notes}
                />
              )}
              <div
                className={classnames(
                  { smallsize: cqParams.smallsize },
                  'CrossingStatusHistoryItem__datetime',
                )}
              >
                <div className="CrossingStatusHistoryItem__datetime-date">
                  <Date date={createdAt} />
                </div>
                <div className="CrossingStatusHistoryItem__datetime-time">
                  <Hour date={createdAt} />
                </div>
              </div>
            </div>
            {cqParams.smallsize && (
              <div className="CrossingStatusHistoryItem__details">
                <ReasonDurationNotes
                  smallSize={true}
                  shouldDisplayReason={shouldDisplay.reason}
                  shouldDisplayDuration={shouldDisplay.duration}
                  shouldDisplayNotes={shouldDisplay.notes}
                  reason={reason}
                  duration={duration}
                  notes={notes}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default CrossingStatusHistoryItem;
