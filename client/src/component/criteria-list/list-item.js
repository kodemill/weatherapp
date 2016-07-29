import React, { PropTypes } from 'react';
import moment from 'moment';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import NoResultIcon from 'material-ui/svg-icons/notification/do-not-disturb';
import IconButton from 'material-ui/IconButton';

const NoResultItem = (
  <div className="noResultItem" key={1337}>
    <NoResultIcon className="noResultIcon" />
    <div className="noResultText">
      No criteria matches the selected filter.
    </div>
  </div>
);

const CriteriaListItem = props => {
  const { city, temperature, predicate, createdAt, acknoweledgedAt, fulfilledAt } = props.criteria;
  const { name, country } = city;
  const validLatestReport = props.latestReport && props.latestReport.temperature;
  const latestTemperature = validLatestReport ?
    Number(props.latestReport.temperature).toFixed(1) : props.nonAvailableText;
  const latestReportCreatedAt = validLatestReport ?
    moment(props.latestReport.createdAt).fromNow() : '';
  const acknoweledgedAtValue = acknoweledgedAt ?
    moment(acknoweledgedAt).format(props.dateFormat) : props.nonAvailableText;
  const fulfilledAtValue = fulfilledAt ?
    moment(fulfilledAt).format(props.dateFormat) : props.nonAvailableText;
  return (
    <div className="criteriaListItem" onClick={props.isOpen ? props.closeInfo : props.openInfo}>
      <div className="mainInfo">
        <div className="temperature">
          {temperature}℃
          <div className="predicate">{predicate} than</div>
        </div>
        <div className="location">
          <div className="name">{name}</div>
          <div className="country">
            {country}
          </div>
        </div>
        <div className="rightContainer">
          <div className="latestTemperature">
            {latestTemperature}
            <span className="celsiusDegree">{validLatestReport ? '℃' : ''}</span>
            <div className="createdAt">{latestReportCreatedAt}</div>
          </div>
          <IconButton
            className="deleteIcon" onClick={e => {
              e.stopPropagation();
              props.handleDelete(props.criteria);
            }}
            tooltip="delete criteria"
          >
            <DeleteIcon
              color="#727272"
              hoverColor="#212121"
            />
          </IconButton>
        </div>
      </div>
      <div className={`moreInfo${props.isOpen ? ' open' : ''}`}>
        <div className="infoRow createdAt">
          <div className="infoKey">created</div>
          <div className="infoValue">{moment(createdAt).format(props.dateFormat)}</div>
        </div>
        <div className="infoRow fulfilledAt">
          <div className="infoKey">fulfilled</div>
          <div className="infoValue">{fulfilledAtValue}</div>
        </div>
        <div className="infoRow acknoweledgedAt">
          <div className="infoKey">acknoweledged</div>
          <div className="infoValue">{acknoweledgedAtValue}</div>
        </div>
      </div>
    </div>
  );
};

CriteriaListItem.propTypes = {
  criteria: PropTypes.object.isRequired,
  latestReport: PropTypes.object,
  dateFormat: PropTypes.string.isRequired,
  nonAvailableText: PropTypes.string.isRequired,
  handleDelete: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
  openInfo: PropTypes.func.isRequired,
  closeInfo: PropTypes.func.isRequired,
};

CriteriaListItem.defaultProps = {
  dateFormat: 'H:mm on MMMM Do',
  nonAvailableText: 'N/A',
};

export default CriteriaListItem;
export {
  NoResultItem,
};
