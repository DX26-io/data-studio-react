import React, { useEffect } from 'react';
import { translate } from 'react-jhipster';
import Logo from 'app/shared/components/logo/logo';
import { ActionButton, Flex, Tooltip, TooltipTrigger, View, Item, Text } from '@adobe/react-spectrum';
import { connect } from 'react-redux';
import HeaderIcon from 'app/shared/components/header-icon/header-icon';
import Filter from '@spectrum-icons/workflow/Filter';
import { toggleFilterPanel } from 'app/modules/canvas/filter/filter.reducer';
import { IRootState } from 'app/shared/reducers';
import Info from '@spectrum-icons/workflow/InfoOutline';
import { Link } from 'react-router-dom';
import { Menu, MenuTrigger } from '@adobe/react-spectrum';

const ShareLinkVisualisationHeader = props => {
  return (
    <View
      paddingX="size-100"
      paddingY="size-100"
      backgroundColor="gray-75"
      borderBottomWidth={'thin'}
      borderTopWidth={'thin'}
      borderBottomColor={'light'}
      borderTopColor={'light'}
    >
      <header>
        <Flex justifyContent="space-between">
          <Flex alignItems="center" justifyContent="start">
            <Link to="/" style={{ color: 'black', marginRight: '10px' }}>
              <Logo />
            </Link>
          </Flex>
          <Flex justifyContent="center" alignItems="center">
            <span className="spectrum-Heading spectrum-Heading--sizeXXS">{props.visualmetadataEntity?.titleProperties?.titleText}</span>
          </Flex>
          <Flex alignItems="end">
            <MenuTrigger>
              <ActionButton isQuiet={true}>
                <Info size="M" />
              </ActionButton>
              <Menu onAction={key => alert(key)} width={'200px'} height={'50px'}>
                <Item key="dashboard">
                  <Flex direction="row" gap="size-50">
                    <Text>{translate('dashboard.home.dashboard')}:</Text>
                    <Text>{props.views?.viewDashboard?.dashboardName}</Text>
                  </Flex>
                </Item>
                <Item key="view">
                  <Flex direction="row" gap="size-50">
                    <Text>{translate('views.home.view')}:</Text>
                    <Text>{props.views?.viewName}</Text>
                  </Flex>
                </Item>
              </Menu>
            </MenuTrigger>
            <HeaderIcon
              key={translate('entity.action.filter')}
              icon={<Filter size="M" id="filter-button"/>}
              title={translate('entity.action.filter')}
              onPress={props.toggleFilterPanel}
            />
          </Flex>
        </Flex>
      </header>
    </View>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  visualmetadataEntity: storeState.visualmetadata.entity,
  views: storeState.views.entity,
});

const mapDispatchToProps = {
  toggleFilterPanel,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ShareLinkVisualisationHeader);
