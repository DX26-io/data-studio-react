import React from 'react';
import { Flex, View, Link as SpectrumLink } from '@adobe/react-spectrum';
import { Translate } from 'react-jhipster';
import { Link } from 'react-router-dom';

interface ILinkCardProps {
  icon: React.ReactElement;
  link: string;
  title: string;
  description?: string;
}

const LinkCard: React.FC<ILinkCardProps> = ({ icon, link, title, description }) => {
  return (
    <View width="size-2400">
      <SpectrumLink variant="secondary">
        <Link to={link}>
          <View
            paddingY="size-1000"
            paddingX="size-700"
            backgroundColor="gray-75"
            borderRadius="medium"
            borderColor="light"
            borderWidth="thin"
          >
            <Flex alignItems="center" justifyContent="center">
              {icon}
            </Flex>
          </View>
        </Link>
      </SpectrumLink>
      <View marginY="size-100">
        <p className="spectrum-Body spectrum-Body--sizeS">
          <strong>
            <Translate contentKey={title}>title</Translate>
          </strong>
        </p>
      </View>
      {description && (
        <p className="spectrum-Body spectrum-Body--sizeS">
          <Translate contentKey={description}>description</Translate>
        </p>
      )}
    </View>
  );
};

export default LinkCard;
