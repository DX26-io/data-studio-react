import React from 'react';
import { Flex, View } from '@adobe/react-spectrum';
import { Translate } from 'react-jhipster';
import { Link } from 'react-router-dom';

interface IQuickLinkCardProps {
  link: string;
  title: string;
  icon: React.ReactElement;
}

const QuickLinkCard: React.FC<IQuickLinkCardProps> = ({ link, title, icon }) => {
  return (
    <View
      width="size-2400"
      minWidth="18vw"
      borderColor="light"
      borderWidth="thin"
      paddingX="size-175"
      paddingY="size-500"
      backgroundColor="gray-75"
    >
      <Link to={link} style={{ color: 'inherit' }}>
        <Flex alignItems="center" justifyContent="space-between">
          {icon}
          <p className="spectrum-Body spectrum-Body--sizeS">
            <strong>
              <Translate contentKey={title}>title</Translate>
            </strong>
          </p>
        </Flex>
      </Link>
    </View>
  );
};

export default QuickLinkCard;
