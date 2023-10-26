import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { getUserGroups, searchUserGroups } from '../groups/user-group.reducer';
import { getUsers, searchUsers } from '../users/user.reducer';
import { IRootState } from 'app/shared/reducers';
import { Text, SearchField, ListBox, Item, Section, Content, View, TabList, TabPanels, Tabs } from '@adobe/react-spectrum';
import User from '@spectrum-icons/workflow/User';
import UserGroup from '@spectrum-icons/workflow/UserGroup';
import { translate, Translate } from 'react-jhipster';
import { ITEMS_PER_PAGE, ACTIVE_PAGE } from 'app/shared/util/pagination.constants';
import { setSearchUrl } from './permissions.reducer';
import { getSearchParam } from './permissions-util';
import { debouncedSearch } from 'app/shared/util/common-utils';
export interface IUsersGroupsProps extends StateProps, DispatchProps {
  permissionProps: any;
}

export const UsersGroups = (props: IUsersGroupsProps) => {

  const [searchValue, setSearchValue] = React.useState('');
  const [tabId, setTabId] = useState<React.Key>(1);

  const { permissionProps, groups, users, searchedUsers, searchedGroups } = props;

  const pushParams = endURL => {
    if (permissionProps.location.search !== endURL) {
      permissionProps.history.push(`${permissionProps.location.pathname}${endURL}`);
    }
  };

  const getParam = event => {
    const it = event.values();
    return it.next();
  };

  const setGroupName = event => {
    const group = getParam(event);
    const endURL = `?group=${group.value}`;
    props.setSearchUrl(endURL);
    pushParams(endURL);
  };

  const setLogin = event => {
    const user = getParam(event);
    const endURL = `?user=${user.value}`;
    props.setSearchUrl(endURL);
    pushParams(endURL);
  };

  const fetchUsersGroups = () => {
    props.getUserGroups(ACTIVE_PAGE, ITEMS_PER_PAGE, 'name,asc');
    props.getUsers(ACTIVE_PAGE, ITEMS_PER_PAGE, 'login,asc');
  };

  useEffect(() => {
    fetchUsersGroups();
    if (permissionProps?.location?.search) {
      const group = getSearchParam('group', permissionProps.location.search);
      const user = getSearchParam('user', permissionProps.location.search);
      if (group) {
        setTabId(2);
        setGroupName(new Set([group]));
      } else {
        setTabId(1);
        setLogin(new Set([user]));
      }
      props.setSearchUrl(permissionProps.location.search);
    }
  }, []);

  useEffect(() => {
    if (searchValue.length > 1) {
      if (tabId === 1) {
        debouncedSearch(props.searchUsers, [ACTIVE_PAGE, ITEMS_PER_PAGE, 'login,asc', searchValue]);
      } else {
        debouncedSearch(props.searchUserGroups, [ACTIVE_PAGE, ITEMS_PER_PAGE, 'name,asc', searchValue]);
      }
    }
  }, [searchValue]);

  // searched user/group should have a separate list as when searching user/group in datasource constraints users/groups list are changing as well

  const getUserListElements = userList => {
    const userListElements = userList.map((user, i) => {
      return (
        <Item textValue="Read" key={`${user.login}`}>
          <User size="M" />
          <Text>{user.login}</Text>
        </Item>
      );
    });
    return userListElements;
  };

  const getUserGroupListElements = userGroupList => {
    const userGroupListElements = userGroupList.map((group, i) => {
      return (
        <Item textValue="Read" key={`${group.name}`}>
          <UserGroup size="M" />
          <Text>{group.name}</Text>
          <Text slot="description">100 todo</Text>
        </Item>
      );
    });
    return userGroupListElements;
  };

  return (
    <div>
      <div style={{ marginLeft: '7%', marginTop: '20px' }}>
        <SearchField value={searchValue} onChange={setSearchValue} placeholder="User or Group" label="Search" data-testid="search" />
      </div>
      <View backgroundColor="gray-75" width="85%" margin="20px auto">
        <Tabs aria-label="roles" selectedKey={tabId} onSelectionChange={setTabId}>
          <TabList>
            <Item key="1">
              <Translate contentKey="userManagement.home.title"></Translate>
            </Item>
            <Item key="2">
              <Translate contentKey="userGroups.home.title"></Translate>
            </Item>
          </TabList>
          <TabPanels>
            <Item key="1">
              <Content marginTop="size-250" marginStart="size-125" marginEnd="size-125">
                <ListBox width="size-static-size-3600" aria-label="users" selectionMode="single" onSelectionChange={setLogin}>
                  <Section>{getUserListElements(searchValue ? searchedUsers : users)}</Section>
                </ListBox>
              </Content>
            </Item>
            <Item key="2">
              <Content marginTop="size-250" marginStart="size-125" marginEnd="size-125">
                <ListBox width="size-static-size-3600" aria-label="groups" selectionMode="single" onSelectionChange={setGroupName}>
                  <Section>{getUserGroupListElements(searchValue ? searchedGroups : groups)}</Section>
                </ListBox>
              </Content>
            </Item>
          </TabPanels>
        </Tabs>
      </View>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  groups: storeState.userGroups.groups,
  users: storeState.userManagement.users,
  searchedUsers: storeState.userManagement.searchedUsers,
  searchedGroups: storeState.userGroups.searchedGroups,
});

const mapDispatchToProps = { getUserGroups, getUsers, searchUsers, searchUserGroups, setSearchUrl };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UsersGroups);
