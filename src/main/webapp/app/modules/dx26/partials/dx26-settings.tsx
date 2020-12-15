import React from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
import Dx26QuerySettings from './dx26-settings/dx26-query-settings';
import Dx26DataConstraintsSettings from './dx26-settings/dx26-data-constraints-settings';
import Dx26DataSettings from './dx26-settings/dx26-data-settings';
import Dx26ThresholdAlertSettings from './dx26-settings/dx26-threshold-alert-settings';
import { translate } from 'react-jhipster';

export interface IDx26SettingsProps extends StateProps, DispatchProps {}

const IDx26Settings = (props: IDx26SettingsProps) => {
  const [activeTab, setTabValue] = React.useState('query');
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  return (
    <>
      <TabContext value={activeTab}>
        <AppBar position="static">
          <TabList onChange={handleTabChange} aria-label="simple tabs example">
            <Tab label={translate('views.editConfiguration.settings.query')} value="query" />
            <Tab label={translate('views.editConfiguration.settings.dataConstraints')} value="dataConstraints" />
            <Tab label={translate('views.editConfiguration.settings.thresholdAlert')} value="thresholdAlert" />
            <Tab label={translate('views.editConfiguration.settings.data')} value="data" />
          </TabList>
        </AppBar>
        <TabPanel value="query">
          <Dx26QuerySettings />
        </TabPanel>
        <TabPanel value="dataConstraints">
          <Dx26DataConstraintsSettings />
        </TabPanel>
        <TabPanel value="thresholdAlert">
          <Dx26ThresholdAlertSettings />
        </TabPanel>
        <TabPanel value="data">
          <Dx26DataSettings />
        </TabPanel>
      </TabContext>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(IDx26Settings);
