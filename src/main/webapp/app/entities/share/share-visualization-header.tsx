import React, { useEffect } from 'react';
import { translate } from 'react-jhipster';
import Logo from 'app/shared/components/logo/logo';
import { ActionButton, Flex, Tooltip, TooltipTrigger, View } from '@adobe/react-spectrum';
import { connect } from 'react-redux';
import HeaderIcon from 'app/shared/components/header-icon/header-icon';
import Filter from '@spectrum-icons/workflow/Filter';
import { toggleFilterPanel } from 'app/modules/canvas/filter/filter.reducer';
import { IRootState } from 'app/shared/reducers';
import Info from '@spectrum-icons/workflow/Info';

export interface IShareVisualizationProps extends StateProps, DispatchProps { }

const ShareVisualizationHeader = (props: IShareVisualizationProps) => {
  return (
    <View
      paddingX="size-150"
      paddingY="size-100"
      backgroundColor="gray-75"
      borderBottomWidth={'thin'}
      borderTopWidth={'thin'}
      borderBottomColor={'light'}
      borderTopColor={'light'}
    >
      <header>
        <Flex justifyContent="space-between">
          <Flex alignItems="start">
            <Logo />
          </Flex>
          <Flex justifyContent="center" alignItems="center">
            <span className="spectrum-Heading spectrum-Heading--sizeXXS" >
              {props.visualmetadataEntity?.titleProperties?.titleText}
            </span>
            <TooltipTrigger>
              <ActionButton isQuiet={true} aria-label="Edit Name">
                <Info size={"S"} />
              </ActionButton>
              <Tooltip variant="info">
                <p> Dashboard: {props.views?.viewDashboard?.dashboardName}</p>
                <p> View: {props.views?.viewName}</p>
              </Tooltip>
            </TooltipTrigger>
          </Flex>
          <Flex alignItems="end">
            <HeaderIcon
              key={translate('views.menu.filter')}
              icon={<Filter size="M" />}
              title={translate('views.menu.filter')}
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
  toggleFilterPanel
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ShareVisualizationHeader);
