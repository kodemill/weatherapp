import CriteriaList from '../component/criteria-list';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as criteriaActionCreators from '../redux/module/criteria';
import * as criteriaListActionCreators from '../redux/module/component/criteria-list';
import _sortBy from 'lodash/sortBy';
import { showDialog } from '../redux/module/component/dialog';
import { displayMessage } from '../redux/module/component/display-message';
import { FILTER_PENDING, FILTER_FULFILLED, setFilter,
  SORT_BY_CITY, SORT_BY_TEMPERATURE, setSortType,
  SORT_DESCENDING, setSortOrder } from '../redux/module/component/filterbar';

const applyFilter = (all, filter) =>
  all.filter(criteria => {
    if (filter === FILTER_PENDING) {
      return !criteria.fulfilledAt;
    } else if (filter === FILTER_FULFILLED) {
      return criteria.fulfilledAt;
    }
    return true;
  });

const applySort = (criteria, sortType, sortOrder) => {
  let iteratee = 'createdAt';
  if (sortType === SORT_BY_CITY) {
    iteratee = criterion => criterion.city.name;
  } else if (sortType === SORT_BY_TEMPERATURE) {
    iteratee = 'temperature';
  }
  const sorted = _sortBy(criteria, iteratee);
  if (sortOrder === SORT_DESCENDING) {
    sorted.reverse();
  }
  return sorted;
};

export default connect(
  state => {
    const { filter, sortOrder, sortType } = state.filterbar;
    return {
      criteriaList: applySort(applyFilter(state.criteria.list, filter), sortType, sortOrder),
      reports: state.report.reports,
      filter,
      sortType,
      sortOrder,
      openIds: state.criteriaList.open,
    };
  },
  dispatch => bindActionCreators({
    ...criteriaActionCreators,
    ...criteriaListActionCreators,
    setFilter,
    setSortType,
    setSortOrder,
    // getReports,
    showDialog,
    displayMessage,
  }, dispatch)
)(CriteriaList);
