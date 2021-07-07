import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Translate, translate } from 'react-jhipster';
import { getReleases, approveRelease, disApproveRelease } from './releases.reducer';
import { IRootState } from 'app/shared/reducers';
import { Button, Flex } from '@adobe/react-spectrum';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@material-ui/core';
import SecondaryHeader from 'app/shared/layout/secondary-header/secondary-header';
import Edit from '@spectrum-icons/workflow/Edit';

export interface IReleasesProps extends StateProps, DispatchProps, RouteComponentProps<{}> {}

export const Releases = (props: IReleasesProps) => {
  useEffect(() => {
    props.getReleases();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      props.getReleases();
    }
  }, [props.updateSuccess]);

  return (
    <div>
      <SecondaryHeader
        breadcrumbItems={[
          { label: translate('global.home'), route: '/' },
          { label: translate('releases.home.title'), route: '/administration/release-management' },
        ]}
        title={translate('releases.home.title')}
      ></SecondaryHeader>
      <div className="dx26-container">
        <Paper className="dx26-table-pager">
          <TableContainer>
            <Table aria-label="customized table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">
                    <Translate contentKey="releases.dashboardId">Dashboard Id</Translate>
                  </TableCell>
                  <TableCell align="center">
                    <Translate contentKey="releases.dashboardName">Dashboard Name</Translate>
                  </TableCell>
                  <TableCell align="center">
                    <Translate contentKey="releases.requestedBy">Requested By</Translate>
                  </TableCell>
                  <TableCell align="center">
                    <Translate contentKey="releases.viewInformation">View Information</Translate>
                  </TableCell>
                  <TableCell align="center">
                    <Translate contentKey="releases.comment">Comment</Translate>
                  </TableCell>
                  <TableCell align="center">
                    <Translate contentKey="entity.action.manage">Manage</Translate>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.releases.map((item, i) => (
                  <TableRow key={`release-${i}`}>
                    <TableCell component="th" scope="row" align="center">
                      {item.release.dashboard.id}
                    </TableCell>
                    <TableCell align="center"> {item.release.dashboard.dashboardName}</TableCell>
                    <TableCell align="center"> {item.requestedBy.login}</TableCell>
                    <TableCell align="center">
                      {item.release.viewReleases.map(info => (
                        <span className="spectrum-Body-emphasis--sizeS" key={info.view.id}>
                          {translate('releases.viewInformationTableCell', { viewId: info.view.id, viewName: info.view.viewName })}
                        </span>
                      ))}
                    </TableCell>
                    <TableCell align="center"> {item.comment ? item.comment : translate('releases.noCommentFound')}</TableCell>
                    <TableCell align="center">
                      <Flex gap="size-100" justifyContent="center">
                        <Button
                          isDisabled={props.updating}
                          variant="cta"
                          onPress={() => {
                            props.approveRelease(item.id);
                          }}
                        >
                          <Translate contentKey="releases.approve">Approve</Translate>
                        </Button>
                        <Button
                          isDisabled={props.updating}
                          variant="negative"
                          onPress={() => {
                            props.disApproveRelease(item.id);
                          }}
                        >
                          <Translate contentKey="releases.disApprove">Disapprove</Translate>
                        </Button>
                      </Flex>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  releases: storeState.releases.releases,
  updateSuccess: storeState.releases.updateSuccess,
  updating: storeState.releases.updating,
});

const mapDispatchToProps = { getReleases, approveRelease, disApproveRelease };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Releases);
