import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { ActionButton, Flex, Text, Item, Menu, MenuTrigger, View, Section, Picker, Button } from '@adobe/react-spectrum';

import { RouteComponentProps } from 'react-router-dom';
import RGL, { WidthProvider } from 'react-grid-layout';
import './grid.css';
import ViewedMarkAs from '@spectrum-icons/workflow/ViewedMarkAs';
import { getEntity as getViewEntity } from '../../entities/views/views.reducer';
import Settings from '@spectrum-icons/workflow/Settings';
import Export from '@spectrum-icons/workflow/Export';
import ShareAndroid from '@spectrum-icons/workflow/ShareAndroid';
import Delete from '@spectrum-icons/workflow/Delete';
import Edit from '@spectrum-icons/workflow/Edit';
import Table from '@spectrum-icons/workflow/Table';
import MoreSmallListVert from '@spectrum-icons/workflow/MoreSmallListVert';
import SecondaryHeader from 'app/shared/layout/secondary-header/secondary-header';
import { IRootState } from 'app/shared/reducers';

const ReactGridLayout = WidthProvider(RGL);
export interface IDx26Prop extends StateProps, DispatchProps, RouteComponentProps<{ dashboardId: string; viewId: string }> {}

let visualmetadata = [
  { i: '1', x: 0, y: 0, w: 1, h: 2, minH: 2, maxH: Infinity, isBounded: true },
  { i: '2', x: 1, y: 0, w: 1, h: 2, minH: 2, maxH: Infinity, isBounded: true },
  { i: '3', x: 2, y: 0, w: 1, h: 2, minH: 2, maxH: Infinity, isBounded: true },
];

const generateWidge = () => {
  return visualmetadata.map(function (l, i) {
    return (
      <div className="item widget" key={l.i}>
        <div className="header">
          <View>
            <Flex direction="row" justifyContent="space-between" alignContent="center">
              <Flex direction="column" alignItems="center" justifyContent="space-around">
                <span>clustered vertical bar chart</span>
              </Flex>
              <Flex direction="column" justifyContent="space-around">
                <MenuTrigger>
                  <ActionButton isQuiet height="size-300">
                    <Settings size={'XS'} aria-label="Default Alert" />
                  </ActionButton>
                  <Menu>
                    <Item key="Edit" textValue="Edit">
                      <Edit size="M" />
                      <Text>Edit</Text>
                    </Item>
                    <Item key="Share" textValue="Share">
                      <ShareAndroid size="M" />
                      <Text>Share</Text>
                    </Item>
                    <Item key="Export" textValue="Export">
                      <Export size="M" />
                      <Text>Export</Text>
                    </Item>
                    <Item key="View" textValue="View">
                      <ViewedMarkAs size="M" />
                      <Text>View</Text>
                    </Item>
                    <Item key="data" textValue="data">
                      <Table size="M" />
                      <Text>Data</Text>
                    </Item>
                    <Item key="More" textValue="More">
                      <MoreSmallListVert size="M" />
                      <Text>More</Text>
                    </Item>
                    <Item key="Delete" textValue="Delete">
                      <Delete size="M" />
                      <Text>Delete</Text>
                    </Item>
                  </Menu>
                </MenuTrigger>
              </Flex>
            </Flex>
          </View>
        </div>
        <div>Grid - {l.i}</div>
      </div>
    );
  });
};

const Dx26 = (props: IDx26Prop) => {
  const [visualmetaList, setvisualmetadata] = React.useState(visualmetadata);

  const onLayoutChange = visualmetaList => {
    setvisualmetadata(visualmetaList);
  };

  const onResize = visualmetaList => {
    setvisualmetadata(visualmetaList);
  };

  const addWidget = () => {
    visualmetadata.push({
      i: (visualmetadata.length + 1).toString(),
      x: 0, //(visualmetadata.length * 2) % (3 || 12),
      y: Infinity,
      w: 1,
      h: 2,
      minH: 2,
      maxH: Infinity,
      isBounded: true,
    });
    setvisualmetadata(visualmetadata);
  };

  useEffect(() => {
    if (props.match.params.viewId) {
      props.getViewEntity(props.match.params.viewId);
    }
  }, []);

  return (
    <>
      <SecondaryHeader
        breadcrumbItems={[
          { key: 'home', label: 'Home', route: '/' },
          { key: 'dash', label: 'Dashboards', route: '/dashboards' },
          { key: 'd12367', label: 'Inventory Dashboard', route: '/dashboards/d12367' },
        ]}
        title={props.view.viewDashboard?.dashboardName + ' ' + props.view.viewName}
      >
        <Button variant="primary" marginX="size-150">
          Edit
        </Button>
        <Button variant="secondary" onPress={addWidget}>
          Add New visualization
        </Button>
      </SecondaryHeader>
      <View>
        <ReactGridLayout
          rowHeight={120}
          cols={3}
          onResize={onResize}
          layout={visualmetaList}
          margin={[15, 15]}
          verticalCompact={true}
          onLayoutChange={onLayoutChange}
          draggableHandle=".header"
          draggableCancel=".WidgetDragCancel"
        >
          {generateWidge()}
        </ReactGridLayout>
      </View>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  view: storeState.views.entity,
  account: storeState.authentication.account,
  isAuthenticated: storeState.authentication.isAuthenticated,
});

const mapDispatchToProps = { getViewEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Dx26);
