import '../../style/component/criteria-list.scss';
import React, { PropTypes } from 'react';
import Toggle from 'material-ui/Toggle';
// import Checkbox from 'material-ui/Checkbox';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import { FILTER_PENDING, FILTER_FULFILLED, FILTER_ALL,
  SORT_BY_CITY, SORT_BY_TEMPERATURE, SORT_BY_CREATED,
  SORT_DESCENDING, SORT_ASCENDING } from '../../redux/module/component/filterbar';

const iconStyle = { marginRight: '4px' };
const rootStyle = { width: 'auto' };
const FilterBar = props => {
  const handleFilterChange = (_, value) => props.setFilter(value);
  const handleSortTypeChenge = (_, value) => props.setSortType(value);
  const sortAscending = props.sortOrder === SORT_ASCENDING;
  return (
    <div className="filterBar">
      <div className="filterTitle">Filter by status:</div>
      <RadioButtonGroup
        className="filterRadioContainer"
        name="filter"
        onChange={handleFilterChange}
        valueSelected={props.filter}
      >
        <RadioButton
          className="filterRadio"
          value={FILTER_PENDING}
          label="pending"
          style={rootStyle}
          iconStyle={iconStyle}
        />
        <RadioButton
          className="filterRadio"
          value={FILTER_FULFILLED}
          label="fulfilled"
          style={rootStyle}
          iconStyle={iconStyle}
        />
        <RadioButton
          className="filterRadio"
          value={FILTER_ALL}
          label="all"
          style={rootStyle}
          iconStyle={iconStyle}
        />
      </RadioButtonGroup>
      <div className="filterTitle">Sort by:</div>
      <RadioButtonGroup
        className="filterRadioContainer"
        name="sort"
        onChange={handleSortTypeChenge}
        valueSelected={props.sortType}
      >
        <RadioButton
          className="filterRadio"
          value={SORT_BY_CREATED}
          label="created"
          style={rootStyle}
          iconStyle={iconStyle}
        />
        <RadioButton
          className="filterRadio"
          value={SORT_BY_CITY}
          label="city"
          style={rootStyle}
          iconStyle={iconStyle}
        />
        <RadioButton
          className="filterRadio"
          value={SORT_BY_TEMPERATURE}
          label="temperature"
          style={rootStyle}
          iconStyle={iconStyle}
        />
      </RadioButtonGroup>
      <Toggle
        label={sortAscending ? 'ascending' : 'descending'}
        style={rootStyle}
        onToggle={() => props.setSortOrder(sortAscending ? SORT_DESCENDING : SORT_ASCENDING)}
        toggled={!sortAscending}
      />
    </div>
  );
};

FilterBar.propTypes = {
  setFilter: PropTypes.func.isRequired,
  setSortType: PropTypes.func.isRequired,
  setSortOrder: PropTypes.func.isRequired,
  filter: PropTypes.string.isRequired,
  sortOrder: PropTypes.string.isRequired,
  sortType: PropTypes.string.isRequired,
};

export default FilterBar;
