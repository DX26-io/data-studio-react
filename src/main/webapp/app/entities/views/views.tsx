import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { getSortState, Translate } from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';
import { getDashboardViewEntities } from './views.reducer';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import SecondaryHeader from 'app/shared/layout/secondary-header/secondary-header';
import { Button, Flex, View, DialogContainer } from '@adobe/react-spectrum';
import Card from 'app/shared/components/card/card';
import ViewCardThumbnail from './view-card/view-card-thumbnail';
import ViewCardContent from './view-card/view-card-content';

import Pagination from '@material-ui/lab/Pagination';
import { getEntity as getDashboardEntity } from '../dashboard/dashboard.reducer';
import { NoItemsFoundPlaceHolder } from 'app/shared/components/placeholder/placeholder';
import ViewRequestReleaseDialog from './view-request-release-modal';

export interface IViewsProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const Views = (props: IViewsProps) => {
  const [isRequestReleaseDialogOpen, setRequestReleaseDialogOpen] = useState<boolean>(false);
  const [requestReleaseViewId, setRequestReleaseViewId] = useState();

  const params = new URLSearchParams(props.location.search);
  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getSortState(props.location, ITEMS_PER_PAGE), props.location.search)
  );
  const { viewsList, totalItems, dashboardEntity, account } = props;

  const getAllEntities = () => {
    const dashboardId = props.match.params['id'];
    props.getDashboardViewEntities(
      dashboardId,
      paginationState.activePage - 1,
      paginationState.itemsPerPage,
      `${paginationState.sort},${paginationState.order}`
    );
  };

  const sortEntities = () => {
    getAllEntities();
    const endURL = `?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`;
    if (props.location.search !== endURL) {
      props.history.push(`${props.location.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    props.getDashboardEntity(Number(props.match.params['id']));
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

  const handleChangePage = (event, newPage) => {
    setPaginationState({
      ...paginationState,
      activePage: newPage,
    });
  };

  const dispatchReleaseRequestProps = (viewId)=>{
    setRequestReleaseDialogOpen(true);
    setRequestReleaseViewId(viewId)
  }

  const viewsListElement = props.viewsList.map(view => {
    return (
      <Card
        key={view.id}
        thumbnail={
          <View height="size-3200">
            <ViewCardThumbnail
              url={`${props.match.url}/${view.id}/build`}
              thumbnailImagePath={view.imageLocation}
              viewName={view.viewName}
            />
          </View>
        }
        content={
          <ViewCardContent
            account={account}
            viewDashboard={view.viewDashboard}
            description={view.description}
            viewName={view.viewName}
            viewId={view.id}
            dispatchReleaseRequestProps={dispatchReleaseRequestProps}
          />
        }
      />
    );
  });

  return (
    !props.loading && (
      <>
        <SecondaryHeader
          breadcrumbItems={[
            { label: 'Home', route: '/' },
            { label: 'Dashboards', route: '/dashboards' },
            { label: 'Views', route: '/views' },
          ]}
          title={dashboardEntity.dashboardName}
        >
          {props.account && (
            <Button variant="cta" onPress={() => props.history.push(`${props.match.url}/create`)}>
              <Translate contentKey="views.home.createLabel">Create View</Translate>
            </Button>
          )}
          <></>
        </SecondaryHeader>
        {viewsList && viewsList.length > 0 ? (
          <>
            <Flex direction="row" gap="size-250" wrap marginX="5%" marginY="size-450" alignItems="center" justifyContent="start">
              {viewsListElement}
            </Flex>
            <Flex direction="row" margin="size-175" alignItems="center" justifyContent="center">
              <Pagination
                defaultPage={paginationState.activePage}
                onChange={handleChangePage}
                count={Math.ceil(totalItems / paginationState.itemsPerPage)}
              />
            </Flex>
          </>
        ) : (
          <NoItemsFoundPlaceHolder headerTranslationKey="views.home.notFound.heading" contentTranslationKey="views.home.notFound.content" />
        )}
        <DialogContainer onDismiss={() => setRequestReleaseDialogOpen(false)}>
          {isRequestReleaseDialogOpen && <ViewRequestReleaseDialog setOpen={setRequestReleaseDialogOpen} viewId={requestReleaseViewId}></ViewRequestReleaseDialog>}
        </DialogContainer>
      </>
    )
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  viewsList: storeState.views.entities,
  loading: storeState.views.loading,
  totalItems: storeState.views.totalItems,
  dashboardEntity: storeState.dashboard.entity,
  account: storeState.authentication.account,
});

const mapDispatchToProps = {
  getDashboardViewEntities,
  getDashboardEntity,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Views);
