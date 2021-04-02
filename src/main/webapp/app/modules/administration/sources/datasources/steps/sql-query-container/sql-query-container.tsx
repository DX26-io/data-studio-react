import React from 'react';
import { Button, Form } from '@adobe/react-spectrum';
import './sql-query-container.scss';
import { format } from 'sql-formatter';
import { Translate } from 'react-jhipster';

interface ISqlQueryContainerProps {
  sqlQuery: string;
  dispatchQuery: (event) => void;
}

const SqlQueryContainer: React.FC<ISqlQueryContainerProps> = ({ sqlQuery, dispatchQuery }) => {
  const [sqlLines, setSqlLines] = React.useState([]);

  const [sql, setSql] = React.useState('');

  const [sqlQuerylength, setSqlQuerylength] = React.useState(0);

  const formatQuery = () => {
    if (sql) {
      const result = format(sql);
      setSqlLines(result.split('\n'));
      setSqlQuerylength(sqlLines.length + 1);
      setSql(result);
      dispatchQuery(sql);
    } else {
      setSql('');
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
            value={sql ? sql : sqlQuery}
            onBlur={formatQuery}
            onPaste={formatQuery}
            onChange={event => {
              setSql(event.target.value);
              dispatchQuery(event.target.value);
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

export default SqlQueryContainer;
