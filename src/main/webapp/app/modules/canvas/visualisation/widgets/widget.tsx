import React, { useState } from 'react';
import { IIllustrate } from './manage-widgets';
import { IVisualMetadataSet } from 'app/shared/model/visualmetadata.model';
import ReactCardFlip from 'react-card-flip';
import VisualisationFront from './visulisation-front';
import VisualisationBack from './visualisation-flip';

interface IWidgetProps {
  isLoaderDisplay: IIllustrate[];
  v: IVisualMetadataSet;
  i: number;
}
const Widget = props => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlipClick = _isFlipped => {
    setIsFlipped(_isFlipped);
  };

  return (
    <React.Fragment>
      <ReactCardFlip isFlipped={isFlipped}>
        <VisualisationFront
          isFlipped={isFlipped}
          handleFlipClick={handleFlipClick}
          v={props.v}
          isLoaderDisplay={props.isLoaderDisplay}
          i={props.i}
          key={`viz-widget-${props.i}`}
        />
        <VisualisationBack isFlipped={isFlipped} handleFlipClick={handleFlipClick} v={props.v} i={props.i} key={`viz-widget-${props.i}`} />
      </ReactCardFlip>
    </React.Fragment>
  );
};

export default Widget;
