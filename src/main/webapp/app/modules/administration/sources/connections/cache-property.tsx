import React, { useEffect } from 'react';
import { TextField, TextArea, Checkbox, Flex, Form } from '@adobe/react-spectrum';
import { connect } from 'react-redux';
import { setConnection } from './connection-steps.reducer';
import { Translate, translate } from 'react-jhipster';

interface CachePropertyProps extends DispatchProps {
  connection: any;
}

const CacheProperty = (props: CachePropertyProps) => {
  const { connection } = props;

  const [cacheEnabled, setEnableCache] = React.useState(
    connection.connectionParameters.cacheEnabled && typeof connection.connectionParameters.cacheEnabled === 'string'
      ? JSON.parse(connection.connectionParameters.cacheEnabled)
      : false
  );
  const [cachePurgeAfterMinutes, setCachePurgeAfterMinutes] = React.useState(connection.connectionParameters.cachePurgeAfterMinutes);
  const [refreshAfterTimesRead, setRefreshAfterTimesRead] = React.useState(connection.connectionParameters.refreshAfterTimesRead);
  const [refreshAfterMinutes, setRefreshAfterMinutes] = React.useState(connection.connectionParameters.refreshAfterMinutes);

  useEffect(() => {
    const payload = connection;
    payload.connectionParameters['cacheEnabled'] = cacheEnabled;
    if (cacheEnabled) {
      payload.connectionParameters['cachePurgeAfterMinutes'] = cachePurgeAfterMinutes;
      payload.connectionParameters['refreshAfterMinutes'] = refreshAfterMinutes;
      payload.connectionParameters['refreshAfterTimesRead'] = refreshAfterTimesRead;
    } else {
      payload.connectionParameters['cachePurgeAfterMinutes'] = 0;
      payload.connectionParameters['refreshAfterMinutes'] = 0;
      payload.connectionParameters['refreshAfterTimesRead'] = 0;
      setRefreshAfterMinutes(0);
      setCachePurgeAfterMinutes(0);
      setRefreshAfterTimesRead(0);
    }
    props.setConnection(payload);
  }, [cacheEnabled, cachePurgeAfterMinutes, refreshAfterMinutes, refreshAfterTimesRead]);

  return (
    <Flex direction="column" gap="size-100" alignItems="center">
      <Form necessityIndicator="icon" minWidth="size-4600">
        <Checkbox onChange={setEnableCache} isSelected={cacheEnabled} isEmphasized>
          <Translate contentKey="connections.cacheProperty.cacheEnabled">Enable cache</Translate>
        </Checkbox>
        <TextField
          type="number"
          isDisabled={!cacheEnabled}
          label={translate('connections.cacheProperty.cachePurgeAfterMinutes')}
          isRequired={cacheEnabled}
          onChange={setCachePurgeAfterMinutes}
          value={cachePurgeAfterMinutes}
        />
        <TextField
          type="number"
          isDisabled={!cacheEnabled}
          label={translate('connections.cacheProperty.refreshAfterTimesRead')}
          isRequired={cacheEnabled}
          onChange={setRefreshAfterTimesRead}
          value={refreshAfterTimesRead}
        />
        <TextField
          type="number"
          isDisabled={!cacheEnabled}
          label={translate('connections.cacheProperty.refreshAfterMinutes')}
          isRequired={cacheEnabled}
          onChange={setRefreshAfterMinutes}
          value={refreshAfterMinutes}
        />
      </Form>
    </Flex>
  );
};

const mapDispatchToProps = { setConnection };

type DispatchProps = typeof mapDispatchToProps;

export default connect(null, mapDispatchToProps)(CacheProperty);
