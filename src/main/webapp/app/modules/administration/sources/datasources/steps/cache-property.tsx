import React, { useEffect } from 'react';
import { TextField, TextArea, Checkbox, Flex, Form } from '@adobe/react-spectrum';
import { connect } from 'react-redux';
import './img-link-card.scss';
import { updateConnection } from './datasource-steps.reducer';
import { Translate, translate } from 'react-jhipster';
import { CACHE_PURGE_AFTER_MINUTES_LABEL, REFRESH_AFTER_MINUTES_LABEL, REFRESH_AFTER_TIME_READ_LABEL } from './datasource-util';

//   TODO: enable next button conditions

interface CachePropertyProps extends DispatchProps {
  connection: any;
}

const CacheProperty = (props: CachePropertyProps) => {
  const { connection } = props;

  const setPropertyValue = value => {};

  const [cacheEnabled, setEnableCache] = React.useState(connection.connectionParameters.cacheEnabled);
  const [cachePurgeAfterMinutes, setCachePurgeAfterMinutes] = React.useState(connection.connectionParameters.cachePurgeAfterMinutes);
  const [refreshAfterTimesRead, setRefreshAfterTimesRead] = React.useState(connection.connectionParameters.refreshAfterTimesRead);
  const [refreshAfterMinutes, setRefreshAfterMinutes] = React.useState(connection.connectionParameters.refreshAfterMinutes);

  useEffect(() => {
    const payload = connection;
    payload.connectionParameters['cacheEnabled'] = cacheEnabled;
    if(cacheEnabled){
        payload.connectionParameters['cachePurgeAfterMinutes'] = cachePurgeAfterMinutes;
        payload.connectionParameters['refreshAfterMinutes'] = refreshAfterMinutes;
        payload.connectionParameters['refreshAfterTimesRead'] = refreshAfterTimesRead;
    }else{
        payload.connectionParameters['cachePurgeAfterMinutes'] = 0;
        payload.connectionParameters['refreshAfterMinutes'] = 0;
        payload.connectionParameters['refreshAfterTimesRead'] = 0;
        setRefreshAfterMinutes(0);
        setCachePurgeAfterMinutes(0);
        setRefreshAfterMinutes(0);
        setRefreshAfterTimesRead(0);
    }
    props.updateConnection(payload);
  }, [cacheEnabled, cachePurgeAfterMinutes, refreshAfterMinutes, refreshAfterTimesRead]);

  return (
    <Flex direction="column" gap="size-100" alignItems="center">
      <Form necessityIndicator="icon" minWidth="size-4600">
        <Checkbox onChange={setEnableCache} isSelected={cacheEnabled} isEmphasized>
          <Translate contentKey="datasources.cacheProperty.cacheEnabled">Enable cache</Translate>
        </Checkbox>
        <TextField
          type="number"
          isDisabled={!cacheEnabled}
          label={CACHE_PURGE_AFTER_MINUTES_LABEL}
          isRequired={cacheEnabled}
          onChange={setCachePurgeAfterMinutes}
          value={cachePurgeAfterMinutes}
        />
        <TextField
          type="number"
          isDisabled={!cacheEnabled}
          label={REFRESH_AFTER_TIME_READ_LABEL}
          isRequired={cacheEnabled}
          onChange={setRefreshAfterTimesRead}
          value={refreshAfterTimesRead}
        />
        <TextField
          type="number"
          isDisabled={!cacheEnabled}
          label={REFRESH_AFTER_TIME_READ_LABEL}
          isRequired={cacheEnabled}
          onChange={setRefreshAfterMinutes}
          value={refreshAfterMinutes}
        />
      </Form>
    </Flex>
  );
};

const mapDispatchToProps = { updateConnection };

type DispatchProps = typeof mapDispatchToProps;

export default connect(null, mapDispatchToProps)(CacheProperty);
