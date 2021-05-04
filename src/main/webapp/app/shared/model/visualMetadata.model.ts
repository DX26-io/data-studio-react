import { TitleProperties } from './title-properties.model';
import { Field } from './field.model';
import { MetadataVisual, Property } from './property.model';
import { BodyProperties } from './body-properties.model copy';

export interface IVisualMetadata {
  readOnly?: boolean;
  _id?: string;
  _rev?: string;
  visualMetadataSet?: IVisualMetadataSet[];
}

export interface IVisualMetadataSet {
  createdBy?: null;
  createdDate?: Date;
  lastModifiedBy?: null;
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
  query?: null;
  queryJson?: null;
  titleProperties?: TitleProperties;
  bodyProperties?: BodyProperties;
  metadataVisual?: MetadataVisual;
  properties?: Property[];
  fields?: Field[];
  isCardRevealed?: boolean;
  isSaved?: boolean;
  id?: string;
}

export const defaultValue: Readonly<IVisualMetadataSet> = {};
