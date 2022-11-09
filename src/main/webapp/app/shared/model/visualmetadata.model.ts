import { TitleProperties } from './title-properties.model';
import { Field } from './field.model';
import { BodyProperties } from './body-properties.model';
import { MetadataVisual } from './metadata-visual.model';
import { Property } from './property.model';

export interface IVisualMetadata {
  readOnly?: boolean;
  _id?: string;
  _rev?: string;
  visualMetadataSet?: IVisualMetadataSet[];
}

export interface IVisualMetadataSet {
  createdBy?: '';
  createdDate?: Date;
  lastModifiedBy?: '';
  lastModifiedDate?: Date;
  height?: number;
  width?: number;
  xPosition?: number;
  yPosition?: number;
  w?: number;
  x?: number;
  h?: number;
  y?: number;
  data?: any;
  conditionExpression?: any;
  query?: any;
  queryJson?: any;
  titleProperties?: TitleProperties;
  bodyProperties?: BodyProperties;
  metadataVisual?: MetadataVisual;
  properties?: Property[];
  fields?: Field[];
  isCardRevealed?: boolean;
  isSaved?: boolean;
  id?: string;
  key?: string;
  nextFieldDimension?: Function;
  nextFieldMeasure?: Function;
}

export const defaultValue: Readonly<IVisualMetadataSet> = {};
