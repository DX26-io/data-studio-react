import React, { ReactText, useState } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import Dx26VizProperties from './dx26-properties/dx26-viz-properties';
import Dx26DataProperties from './dx26-properties/dx26-data-properties';
import Dx26Hierarchy from './dx26-properties/dx26-hierarchy';
import { Content } from '@react-spectrum/view';
import { Tabs, Item } from '@react-spectrum/tabs';
import { getPropertiesTabTranslations } from './dx26-modal-util';
import { IFeature } from 'app/shared/model/feature.model';
import { IVisualMetadataSet } from 'app/shared/model/visualMetadata.model';

export interface IDx26PropertiesProps extends StateProps, DispatchProps {
  features: IFeature[];
  visual: IVisualMetadataSet;
}

const IDx26Properties = (props: IDx26PropertiesProps) => {
  const [activeTabId, setActiveTabId] = useState<ReactText>('chartProperties');

  return (
    <>
      <div className="properties-tabs">
        <Tabs
          isQuiet={true}
          density={'compact'}
          position={"sticky"}
          top={0}
          aria-label="History of Ancient Rome"
          items={getPropertiesTabTranslations()}
          onSelectionChange={key => setActiveTabId(key)}
        >
          {item => (
            <Item title={item.name} key={item.id}>
              <Content margin="size-100">
                {activeTabId === 'chartProperties' && <Dx26VizProperties features={props.features} visual={props.visual} />}
                {activeTabId === 'dataProperties' && <Dx26DataProperties features={props.features} visual={props.visual} />}
                {activeTabId === 'hierarchy' && <Dx26Hierarchy />}
              </Content>
            </Item>
          )}
        </Tabs>
      </div>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(IDx26Properties);
