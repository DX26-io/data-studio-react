import React from 'react';
import { Flex, View, Link as SpectrumLink } from '@adobe/react-spectrum';
import { Translate } from 'react-jhipster';
import { Link } from 'react-router-dom';
import { selectConnectionType } from './datasource-steps.reducer';
import { connect } from 'react-redux';
import './img-link-card.scss';

interface IImgLinkCardProps extends DispatchProps {
  connectionType: any;
}

const ImgLinkCard = (props: IImgLinkCardProps) => {
  const { connectionType } = props;
  const select = () => {
    console.log(connectionType);
    props.selectConnectionType(connectionType);
  };
  return (
    <div onClick={select} className="database-image">
      <View borderRadius="large" borderColor="light" borderWidth="thin" margin="size-50" padding="size-50">
        <svg style={{ width: '80px', height: '80px' }}>
          <use xlinkHref={connectionType.connectionPropertiesSchema.imagePath}></use>
        </svg>
        <Flex alignItems="center" justifyContent="center">
          <span> {connectionType.connectionPropertiesSchema.connectionDetailsType}</span>
        </Flex>
      </View>
    </div>
  );
};

const mapDispatchToProps = { selectConnectionType };

type DispatchProps = typeof mapDispatchToProps;

export default connect(null, mapDispatchToProps)(ImgLinkCard);
