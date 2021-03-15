import './home.scss';

import React, { useState } from 'react';
import { connect } from 'react-redux';
import { ActionButton, Flex, Heading, Text, View } from '@adobe/react-spectrum';
import ViewGrid from '@spectrum-icons/workflow/ViewGrid';
import SecondaryHeader from 'app/shared/layout/secondary-header/secondary-header';
import { useHistory } from 'react-router-dom';
import User from '@spectrum-icons/workflow/User';
import DateRangeComponent from '../canvas/data-constraints/date-range-component';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';
import Edit from '@spectrum-icons/workflow/Edit';
export type IHomeProp = StateProps;

// TODO: Test Cases
export const Home = (props: IHomeProp) => {
  const history = useHistory();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen(prevState => !prevState);
  const { account } = props;
  return (
    <>
      <SecondaryHeader breadcrumbItems={[{ label: 'Home', route: '/' }]} title={'Home'} />
      <View padding={'size-150'}>
        <Flex justifyContent={'center'} alignItems={'center'} direction={'column'}>
          <View>
            <Heading level={2}>
              You are logged in as &quot;<span className="username">{account.login}</span>&quot;
            </Heading>
          </View>
          <ActionButton onPress={() => history.push('/dashboards')}>
            <ViewGrid />
            <Text>Dashboards</Text>
          </ActionButton>
          <ActionButton onPress={() => history.push('/administration/user-management')} marginY="size-100">
            <ViewGrid />
            <Text>User Management</Text>
          </ActionButton>
          <Dropdown isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle>Dropdown</DropdownToggle>
            <DropdownMenu>
              <DropdownItem header>Header</DropdownItem>
              <DropdownItem>
                Some Action{' '}
                <ActionButton onPress={() =>alert('hello')}isQuiet aria-label="Icon only">
                  <Edit size={"XS"}/>
                </ActionButton>
              </DropdownItem>
              <DropdownItem text>Dropdown Item Text</DropdownItem>
              <DropdownItem disabled>Action (disabled)</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>Foo Action</DropdownItem>
              <DropdownItem>Bar Action</DropdownItem>
              <DropdownItem>Quo Action</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </Flex>
      </View>
    </>
  );
};

const mapStateToProps = storeState => ({
  account: storeState.authentication.account,
  isAuthenticated: storeState.authentication.isAuthenticated,
});

type StateProps = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(Home);
