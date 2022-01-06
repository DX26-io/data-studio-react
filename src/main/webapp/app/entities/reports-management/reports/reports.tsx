import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Translate, getSortState, translate } from 'react-jhipster';
import { ITEMS_PER_PAGE_OPTIONS, ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { IRootState } from 'app/shared/reducers';
import { Button, Flex, DialogContainer, Dialog } from '@adobe/react-spectrum';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@material-ui/core';
import SecondaryHeader from 'app/shared/layout/secondary-header/secondary-header';
import Edit from '@spectrum-icons/workflow/Edit';
import { fetchReports } from '../reports-management.reducer';
import Filters from './filters';
import { findUserId } from './reports.util';
import Scheduler from 'app/modules/canvas/scheduler/scheduler';

export interface IReportsProps extends StateProps, DispatchProps, RouteComponentProps<{}> {}

export const Reports = (props: IReportsProps) => {
  const [pagination, setPagination] = useState(
    overridePaginationStateWithQueryParams(getSortState(props.location, ITEMS_PER_PAGE), props.location.search)
  );
  const [isOpen, setOpen] = React.useState(false);
  const [thresholdAlert, setThresholdAlert] = React.useState(false);
  const [visualisationId, setVisualisationId] = React.useState('');

  const getReports = () => {
    props.fetchReports(pagination.itemsPerPage, pagination.activePage, findUserId(props.account, ''));
    const endURL = `?page=${pagination.activePage}`;
    if (props.location.search !== endURL) {
      props.history.push(`${props.location.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    getReports();
  }, [pagination.activePage, pagination.order, pagination.sort, pagination.itemsPerPage]);

  useEffect(() => {
    const params = new URLSearchParams(props.location.search);
    const page = params.get('page');
    const sort = params.get('sort');
    if (page && sort) {
      const sortSplit = sort.split(',');
      setPagination({
        ...pagination,
        activePage: +page,
        sort: sortSplit[0],
        order: sortSplit[1],
      });
    }
  }, [props.location.search]);

  const setUpdateSuccess = () => {
    getReports();
  };

  const handleChangePage = (event, newPage) => {
    setPagination({
      ...pagination,
      activePage: newPage,
    });
  };

  const handleChangeRowsPerPage = event => {
    setPagination({
      ...pagination,
      itemsPerPage: +event.target.value,
    });
  };

  return (
    <div>
      <SecondaryHeader
        breadcrumbItems={[
          { label: 'Home', route: '/' },
          { label: translate('reportsManagement.home.title'), route: '/reports-management' },
          { label: translate('reportsManagement.reports.title'), route: '/reports-management/reports' },
        ]}
        title={translate('reportsManagement.reports.title')}
      ></SecondaryHeader>
      <DialogContainer onDismiss={() => setOpen(false)}>
        {isOpen && <Scheduler thresholdAlert={thresholdAlert} visualisationId={visualisationId} />}
      </DialogContainer>
      <div className="dx26-container">
        <Filters />
        <Paper className="dx26-table-pager">
          <TableContainer>
            <Table aria-label="customized table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">
                    <Translate contentKey="reportsManagement.reports.no">No.</Translate>
                  </TableCell>
                  <TableCell align="center">
                    <Translate contentKey="reportsManagement.reports.reportName">Report Name</Translate>
                  </TableCell>
                  <TableCell align="center">
                    <Translate contentKey="reportsManagement.reports.dashboardName">Dashboard Name</Translate>
                  </TableCell>
                  <TableCell align="center">
                    <Translate contentKey="reportsManagement.reports.thresholdAlert">Threshold Alert</Translate>
                  </TableCell>
                  <TableCell align="center">
                    <Translate contentKey="reportsManagement.reports.subject">Subject</Translate>
                  </TableCell>
                  <TableCell align="center">
                    <Translate contentKey="reportsManagement.reports.run">Run</Translate>
                  </TableCell>
                  <TableCell align="center">
                    <Translate contentKey="reportsManagement.reports.createdBy">Created By</Translate>
                  </TableCell>
                  <TableCell align="center">
                    <Translate contentKey="reportsManagement.reports.createdDate">Created Date</Translate>
                  </TableCell>
                  <TableCell align="center">
                    <Translate contentKey="entity.action.manage">Manage</Translate>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.reports.map((report, i) => (
                  <TableRow key={`report-${i}`}>
                    <TableCell component="th" scope="row" align="center">
                      {i + 1}
                    </TableCell>

                    <TableCell align="center">{report.report.reportName}</TableCell>
                    <TableCell align="center">{report.report.dashboardName}</TableCell>
                    <TableCell align="center">
                      {report.report.thresholdAlert ? (
                        <Translate contentKey="reportsManagement.reports.thresholdAlertYes">Yes</Translate>
                      ) : (
                        <Translate contentKey="reportsManagement.reports.thresholdAlertNo">No</Translate>
                      )}
                    </TableCell>

                    <TableCell align="center">{report.report.subject}</TableCell>
                    <TableCell align="center">{report.schedule.cronExp}</TableCell>
                    <TableCell align="center">{report.report.userId}</TableCell>
                    <TableCell align="center">{report.report.createdDate}</TableCell>

                    <TableCell align="center">
                      <Flex gap="size-100" justifyContent="center">
                        <a
                          onClick={() => {
                            setOpen(true);
                            setThresholdAlert(report.report.thresholdAlert);
                            setVisualisationId(report.reportLineItem.visualizationId);
                          }}
                        >
                          <Edit size="S" />
                        </a>
                      </Flex>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={ITEMS_PER_PAGE_OPTIONS}
            component="div"
            count={props.totalReports}
            rowsPerPage={pagination.itemsPerPage}
            page={pagination.activePage}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  reports: storeState.reportsManagement.reports,
  totalReports: storeState.reportsManagement.totalReports,
  account: storeState.authentication.account,
});

const mapDispatchToProps = { fetchReports };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Reports);
