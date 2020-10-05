import './footer.scss';

import React from 'react';
import { Translate } from 'react-jhipster';
import { Col, Row } from 'reactstrap';
import { Footer, Grid } from '@adobe/react-spectrum';

const Footers = props => (
  <Footer>
    <Grid
      autoRows="size-800"
      gap="size-100">
      <Translate contentKey="footer">Your footer</Translate>
    </Grid>
  </Footer>


);

export default Footers;
