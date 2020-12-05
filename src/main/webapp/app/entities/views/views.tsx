import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Translate, getSortState } from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';
import { getEntities } from './views.reducer';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import SecondaryHeader from 'app/shared/layout/secondary-header/secondary-header';
import { Flex, Text, View, Button, IllustratedMessage, Content, DialogContainer, ProgressCircle } from '@adobe/react-spectrum';
import Card from 'app/shared/components/card/card';
import ViewCardThumbnail from './view-card/view-card-thumbnail';
import ViewCardContent from './view-card/view-card-content';
import ViewCreateModal from './view-create-modal';

import Pagination from '@material-ui/lab/Pagination';
import { getEntity } from '../dashboard/dashboard.reducer';
import NotFound from '@spectrum-icons/illustrations/NotFound';

export interface IViewsProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const Views = (props: IViewsProps) => {
  const params = new URLSearchParams(props.location.search);
  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getSortState(props.location, ITEMS_PER_PAGE), props.location.search)
  );

  const getAllEntities = viewDashboard => {
    props.getEntities(
      viewDashboard,
      paginationState.activePage - 1,
      paginationState.itemsPerPage,
      `${paginationState.sort},${paginationState.order}`
    );
  };

  const sortEntities = () => {
    const viewDashboard = props.match.params['id'];
    getAllEntities(viewDashboard);
    const endURL = `?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`;
    if (props.location.search !== endURL) {
      props.history.push(`${props.location.pathname}${endURL}`);
    }
  };

  const getDashbaordEntity = () => {
    props.getEntity(Number(props.match.params['id']));
  };

  useEffect(() => {
    getDashbaordEntity();
    sortEntities();
  }, [paginationState.activePage, paginationState.order, paginationState.sort]);

  useEffect(() => {
    const page = params.get('page');
    const sort = params.get('sort');

    if (page && sort) {
      const sortSplit = sort.split(',');
      setPaginationState({
        ...paginationState,
        activePage: +page,
        sort: sortSplit[0],
        order: sortSplit[1],
      });
    }
  }, [props.location.search]);

  const sort = p => () => {
    setPaginationState({
      ...paginationState,
      order: paginationState.order === 'asc' ? 'desc' : 'asc',
      sort: p,
    });
  };

  const handleChangePage = (event, newPage) => {
    setPaginationState({
      ...paginationState,
      activePage: newPage,
    });
  };
  const viewsListElement = props.viewsList.map(view => {
    return (
      <>
        <Card
          key={view.id}
          thumbnail={
            <View height="size-3200">
              <ViewCardThumbnail thumbnailImagePath={view.image} viewName={view.viewName} />
            </View>
          }
          content={
            <ViewCardContent viewDashboard={view.viewDashboard} description={view.description} viewName={view.viewName} viewId={view.id} />
          }
        />
      </>
    );
  });

  const { viewsList, match, loading, totalItems, dashboardEntity } = props;
  const [isOpen, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <SecondaryHeader
        breadcrumbItems={[
          { label: 'Home', route: '/' },
          { label: 'Dashboards', route: '/dashboards' },
          { label: 'Views', route: '/views' },
        ]}
        title={dashboardEntity.dashboardName}
      >
        <Button variant="cta" onPress={() => setOpen(true)}>
          <Translate contentKey="datastudioApp.views.home.createLabel">Create View</Translate>
        </Button>

        <DialogContainer type="fullscreenTakeover" onDismiss={() => setOpen(false)} {...props}>
          {isOpen && <ViewCreateModal viewDashboard={dashboardEntity}></ViewCreateModal>}
        </DialogContainer>
      </SecondaryHeader>
      <Flex direction="row" gap="size-175" wrap margin="size-175" alignItems="center" justifyContent="start">
        {viewsListElement}
      </Flex>

      <Flex direction="row" margin="size-175" alignItems="center" justifyContent="center">
        {!loading ? (
          viewsList && viewsList.length > 0 ? (
            <Pagination
              defaultPage={paginationState.activePage}
              onChange={handleChangePage}
              count={Math.ceil(totalItems / paginationState.itemsPerPage)}
            />
          ) : (
            <IllustratedMessage>
              <NotFound />
              <Content>No view found for {dashboardEntity.dashboardName} dashboard</Content>
            </IllustratedMessage>
          )
        ) : (
          <Flex margin="size-175" alignItems="center" justifyContent="center">
            <ProgressCircle isIndeterminate aria-label="Loading…" marginEnd="size-300" value={30} />
            <Text>loading</Text>
          </Flex>
        )}
      </Flex>
    </React.Fragment>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  viewsList: storeState.views.entities,
  loading: storeState.views.loading,
  totalItems: storeState.views.totalItems,
  dashboardEntity: storeState.dashboard.entity,
});

const mapDispatchToProps = {
  getEntities,
  getEntity,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Views);
