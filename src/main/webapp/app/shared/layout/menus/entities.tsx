import React from 'react';
import MenuItem from 'app/shared/layout/menus/menu-item';
import { DropdownItem } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Translate, translate } from 'react-jhipster';
import { NavLink as Link } from 'react-router-dom';
import { NavDropdown } from './menu-components';

export const EntitiesMenu = props => (
  <NavDropdown
    icon="th-list"
    name={translate('global.menu.entities.main')}
    id="entity-menu"
    style={{ maxHeight: '80vh', overflow: 'auto' }}
  >
    <MenuItem icon="asterisk" to="/dashboard">
      <Translate contentKey="global.menu.entities.dashboard" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/datasources">
      <Translate contentKey="global.menu.entities.datasources" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/views">
      <Translate contentKey="global.menu.entities.views" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/feature">
      <Translate contentKey="global.menu.entities.feature" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/visualisations">
      <Translate contentKey="global.menu.entities.visualisations" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/visualmetadata">
      <Translate contentKey="global.menu.entities.visualmetadata" />
    </MenuItem>
    {/* jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here */}
  </NavDropdown>
);
