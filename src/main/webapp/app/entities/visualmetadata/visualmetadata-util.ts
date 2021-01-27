import { IVisualMetadataSet } from 'app/shared/model/visualMetadata.model';
import { translate } from 'react-jhipster';

export interface IVisualmetaDataDTO {
  visualMetadata?: IVisualMetadataSet;
  viewId?: number;
}
export interface IValidateDTO {
  datasourceId: number;
  queryDTO: object;
  visualMetadataId: string;
}
