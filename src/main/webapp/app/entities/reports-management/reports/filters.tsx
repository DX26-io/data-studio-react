import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Translate, translate } from 'react-jhipster';
import TreeExpand from '@spectrum-icons/workflow/TreeExpand';
import {} from '../reports-management.reducer';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Select from 'react-select';

export interface IFiltersProps extends DispatchProps {}

export const Filters = (props: IFiltersProps) => {
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const selectRole = selectedOption => {
    // userGroups = [];
    // if (selectedOption) {
    //   selectedOption.forEach(function (option) {
    //     userGroups.push(option.value);
    //   });
    // }
  };

  return (
    <Accordion expanded={expanded} onChange={handleChange('panel1')} style={{ marginBottom: '20px' }}>
      <AccordionSummary expandIcon={<TreeExpand size="S" />} aria-controls="panel1bh-content" id="panel1bh-header">
        <span className="spectrum-Body-emphasis">
          <Translate contentKey="reports-management.reports.filters.title">Filters</Translate>
        </span>
      </AccordionSummary>
      <AccordionDetails>

      {/* <Select
            isMulti
            onChange={selectRole}
            defaultValue={isNew ? userGroups : user.userGroups}
            options={roles}
            className="basic-multi-select"
            classNamePrefix="select"
          /> */}

      </AccordionDetails>
    </Accordion>
  );
};

const mapDispatchToProps = {};

type DispatchProps = typeof mapDispatchToProps;

export default connect(null, mapDispatchToProps)(Filters);
