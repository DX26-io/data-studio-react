import React from 'react';
import { Image, View, Flex } from '@adobe/react-spectrum';
import { Translate } from 'react-jhipster';
import { Link } from 'react-router-dom';
import './admin-card.scss';

interface IAdminCardProps {
  icon: React.ReactNode;
  link: string;
  title: string;
  description: string;
}

const AdminCard: React.FC<IAdminCardProps> = ({ icon, link, title, description }) => {
  return (
    <div className="admin-card-container" >
      <Link to={link} className="admin-card" >{icon}</Link>
      <p className="spectrum-Body spectrum-Body--XS card-title">
        <strong>
          <Translate contentKey={title}>Users</Translate>
        </strong>
      </p>
      <p className="spectrum-Body spectrum-Body--XS">
        <Translate contentKey={description}>Manage your users</Translate>
      </p>
    </div>
  );
};

export default AdminCard;
