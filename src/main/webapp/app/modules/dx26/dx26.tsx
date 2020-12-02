import React from 'react';
import { connect } from 'react-redux';
import { Flex, View } from '@adobe/react-spectrum';

import { RouteComponentProps } from 'react-router-dom';
import RGL, { WidthProvider } from 'react-grid-layout';
import './grid.css';
const ReactGridLayout = WidthProvider(RGL);
export interface IDx26Prop extends StateProps, RouteComponentProps<{ dashboardId: string; viewId: string }> {}

// const [resizeplotly, setResizeplotly] = React.useState(false);
const _layout = [
  { i: '1', x: 0, y: 0, w: 10, h: 2, minH: 2, maxH: 2 },
  { i: '2', x: 1, y: 0, w: 10, h: 2, minH: 2, maxH: 2 },
];
//  const [layout, setLayout] = React.useState(_layout);

// const onLayoutChange = layouts => {
//   setLayout(layouts);
// };

// const onResize = layouts => {
//   setLayout(layouts);
// };
const Dx26 = (props: IDx26Prop) => {
  // setLayout(_layout);

  return (
    <>
      <View>
        <Flex justifyContent={'center'} alignItems={'center'} direction={'row'}>
          <ReactGridLayout
            rowHeight={100}
            cols={2}
            // onResize={onResize}
            width={100}
            layout={_layout}
            //  onLayoutChange={onLayoutChange}
            draggableHandle=".MyDragHandleClassName"
            draggableCancel=".MyDragCancel"
          >
            <div className="item" key={1}>
              <div className="MyDragHandleClassName">
                Drag from Here - <span className="text">1</span>
              </div>
              <div style={{ marginTop: '80px' }}>Grid - 1</div>
            </div>
            <div className="item" key={2}>
              <div className="MyDragHandleClassName">
                Drag from Here - <span className="text">2</span>
              </div>
              <div style={{ marginTop: '80px' }}>Grid - 2</div>
            </div>
          </ReactGridLayout>
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

export default connect(mapStateToProps)(Dx26);
