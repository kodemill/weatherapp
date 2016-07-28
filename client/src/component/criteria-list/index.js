import '../../style/component/criteria-list.scss';
import React, { Component, PropTypes } from 'react';
import CriteriaListItem, { NoResultItem } from './list-item';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import FilterBar from './filterbar';

export default class CriteriaList extends Component {

  static propTypes = {
    criteriaList: PropTypes.array.isRequired,
    reports: PropTypes.array.isRequired,
    deleteCriteria: PropTypes.func.isRequired,
    showDialog: PropTypes.func.isRequired,
    displayMessage: PropTypes.func.isRequired,
    setFilter: PropTypes.func.isRequired,
    filter: PropTypes.string.isRequired,
    openIds: PropTypes.array.isRequired,
    openInfo: PropTypes.func.isRequired,
    closeInfo: PropTypes.func.isRequired,
  }

  componentWillReceiveProps(nextProps) {
    if (this.criteriaToDelete && nextProps.criteriaList &&
      !nextProps.criteriaList.find(criteria => criteria.id === this.criteriaToDelete.id)) {
      this.props.displayMessage('criteria deleted successfully');
      this.criteriaToDelete = null;
    }
  }

  handleDelete = criteria => {
    this.criteriaToDelete = criteria;
    this.props.showDialog({
      title: 'Delete Criteria',
      message: 'Do you really want to delete?',
      okText: 'delete',
      okHandler: () => this.props.deleteCriteria(criteria),
      cancelHandler: () => { this.criteriaToDelete = null; },
    });
  };

  render() {
    let children;
    if (!this.props.criteriaList || this.props.criteriaList.length === 0) {
      children = [NoResultItem];
    } else {
      children = this.props.criteriaList.map((criteria) => {
        const latestReport = this.props.reports.find(report => report.city === criteria.city.id);
        return (
          <CriteriaListItem
            key={criteria.id}
            criteria={criteria}
            latestReport={latestReport}
            handleDelete={this.handleDelete}
            isOpen={this.props.openIds.indexOf(criteria.id) >= 0}
            openInfo={() => this.props.openInfo(criteria)}
            closeInfo={() => this.props.closeInfo(criteria)}
          />
        );
      });
    }
    return (
      <Card className="criteriaListWrapper">
        <CardTitle
          title={"List of Criteria"}
          subtitle={"you can filter, sort, delete criteria here"}
        />
        <CardText>
          <FilterBar {...this.props} />
        </CardText>
        <div className="criteriaList">
          {children}
        </div>
      </Card>
    );
  }
}
