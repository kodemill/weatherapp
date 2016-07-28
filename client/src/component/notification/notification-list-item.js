import React, { PropTypes } from 'react';
import moment from 'moment';

const NotificationListItem = props =>
  <div className="criteriaListItem">
    <div className="mainInfo">
      <div className="temperature">
        {props.criteria.temperature}℃
        <div className="predicate">{props.criteria.predicate} than</div>
      </div>
      <div className="location">
        <div className="name">{props.criteria.city.name}</div>
        <div className="country">
          {props.criteria.city.country}
        </div>
      </div>
      <div className="fulfilledAt">
        {`fulfilled ${moment(props.criteria.fulfilledAt).fromNow()}`}
      </div>
    </div>
  </div>;

NotificationListItem.propTypes = {
  criteria: PropTypes.object.isRequired,
};

export default NotificationListItem;
