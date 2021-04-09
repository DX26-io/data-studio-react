import React from 'react';
import { Flex, View, Link as SpectrumLink } from '@adobe/react-spectrum';
import { Translate } from 'react-jhipster';
import { Link } from 'react-router-dom';

interface IQuickLinkCardProps {
  link: string;
  title: string;
  icon: React.ReactElement;
}

const QuickLinkCard: React.FC<IQuickLinkCardProps> = ({ link, title, icon }) => {
  return (
    <View width="size-2400" minWidth="size-3000"  borderColor="light" borderWidth="thin"  paddingX="size-175" paddingY="size-500" backgroundColor="gray-75"  >
      <SpectrumLink isQuiet>
        <Link to={link}>
          <Flex alignItems="center" justifyContent="space-between">
            {icon}
            <p className="spectrum-Body spectrum-Body--sizeS">
              <strong>
                <Translate contentKey={title}>title</Translate>
              </strong>
            </p>
          </Flex>
        </Link>
      </SpectrumLink>
    </View>
  );
};

export default QuickLinkCard;
