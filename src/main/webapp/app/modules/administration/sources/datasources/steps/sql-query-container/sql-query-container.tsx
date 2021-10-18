import React from 'react';
import { Button, Form } from '@adobe/react-spectrum';
import './sql-query-container.scss';
import { format } from 'sql-formatter';
import { Translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { setDatasource } from '../datasource-steps.reducer';

interface ISqlQueryContainerProps extends StateProps, DispatchProps {}

export const SqlQueryContainer = (props: ISqlQueryContainerProps) => {
  const [sqlLines, setSqlLines] = React.useState([]);
  const [sqlQuerylength, setSqlQuerylength] = React.useState(0);

  const formatQuery = () => {
    if (props.datasource.sql) {
      const result = format(props.datasource.sql);
      setSqlLines(result.split('\n'));
      setSqlQuerylength(sqlLines.length + 1);
      props.setDatasource({ ...props.datasource, sql:result });
    } else {
      props.setDatasource({ ...props.datasource, sql: '' });
    }
  };

  return (
    <React.Fragment>
      <Form necessityIndicator="icon" minWidth="size-4600">
        <div className="sql-query-container">
          <div className="line-nums">
            {sqlLines.map((line, index) => (
              <div key={index}>{index + 1}</div>
            ))}
          </div>
          <textarea
            className="form-control sql-query-area"
            rows={sqlQuerylength}
            value={props.datasource.sql ? props.datasource.sql : ''}
            onBlur={formatQuery}
            onPaste={formatQuery}
            onChange={event => {
              props.setDatasource({ ...props.datasource, sql: event.target.value });
            }}
            style={{ width: '30vw' }}
          ></textarea>
        </div>
      </Form>
      <br />
      <Button variant="cta" isDisabled={false} onPress={formatQuery}>
        <Translate contentKey="datasources.exploreDataModel.formatQuery">Format Query</Translate>
      </Button>
    </React.Fragment>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  datasource: storeState.datasourceSteps.datasource,
});

const mapDispatchToProps = { setDatasource };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(SqlQueryContainer);
