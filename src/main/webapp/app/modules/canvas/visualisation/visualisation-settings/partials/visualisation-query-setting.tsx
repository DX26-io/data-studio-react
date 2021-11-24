import React, { ReactText, useEffect, useState } from 'react';
import { View } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { validate as validateQuery } from 'app/entities/visualmetadata/visualmetadata.reducer';
import { IVisualMetadataSet } from 'app/shared/model/visual-meta-data.model';
import { VisualWrap } from 'app/modules/canvas/visualisation/util/visualmetadata-wrapper';
import { IViews } from 'app/shared/model/views.model';
import { ValidateFields } from '../../util/visualisation-render-utils';
export interface IVisualisationQuerySettingProps extends StateProps, DispatchProps {
  // visual: IVisualMetadataSet;
  // view: IViews;
}

const VisualisationQuerySetting = (props: IVisualisationQuerySettingProps) => {
  const [rowQuery, setRowQuery] = useState<ReactText>('');
  let wrap;

  useEffect(() => {
    if (props.rowQuery && props.rowQuery.validationResultType === 'SUCCESS') {
      setRowQuery(props.rowQuery.rawQuery);
    }
    if ((props.visual.id && props.view?.id && rowQuery === '') || props.updateSuccess) {
      if (props.visual.fields && ValidateFields(props.visual.fields)) {
        wrap = VisualWrap(props.visual);
        props.validateQuery({
          datasourceId: props.view.viewDashboard.dashboardDatasource.id,
          visualMetadataId: props.visual.id,
          queryDTO: wrap.getQueryParameters(props.visual, {}, null, null),
        });
      }
    }
    if (props.validateQueryError) {
      setRowQuery(props.validateQueryError);
    }
  // }, [props.rowQuery, props.visual, props.view, props.validateQueryError]);
}, [props.visual]);

  return (
    <>
      <View>
        <span className="query"> {rowQuery}</span>
      </View>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  rowQuery: storeState.visualmetadata.rowQuery,
  validateQueryError: storeState.visualmetadata.validateQueryError,
  updateSuccess: storeState.visualmetadata.updateSuccess,
  visual: storeState.visualmetadata.entity,
  view: storeState.views.entity,
});

const mapDispatchToProps = { validateQuery };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(VisualisationQuerySetting);
