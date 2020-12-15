import React from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
import Dx26ChartProperties from './dx26-properties/dx26-chart-properties';
import Dx26DataProperties from './dx26-properties/dx26-data-properties';
import Dx26Hierarchy from './dx26-properties/dx26-hierarchy';
import { translate } from 'react-jhipster';

export interface IDx26PropertiesProps extends StateProps, DispatchProps {}

const IDx26Properties = (props: IDx26PropertiesProps) => {
  const [activeTab, setTabValue] = React.useState('chartProperties');
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <>
        <TabContext value={activeTab}>
          <AppBar position="static">
            <TabList onChange={handleTabChange} aria-label="simple tabs example">
              <Tab label={translate('views.editConfiguration.properties.chartProperties')} value="chartProperties" />
              <Tab label={translate('views.editConfiguration.properties.dataProperties')} value="dataProperties" />
              <Tab label={translate('views.editConfiguration.properties.hierarchy')} value="hierarchy" />
            </TabList>
          </AppBar>
          <TabPanel value="chartProperties">
            <Dx26ChartProperties />
          </TabPanel>
          <TabPanel value="dataProperties">
            <Dx26DataProperties />
          </TabPanel>
          <TabPanel value="hierarchy">
            <Dx26Hierarchy />
          </TabPanel>
        </TabContext>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(IDx26Properties);
