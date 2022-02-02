import React, { useEffect, useState, ReactText } from 'react';
import { connect } from 'react-redux';
import { View, Flex } from '@adobe/react-spectrum';
import { getRecentlyAccessedBookmarks } from 'app/modules/home/sections/recent.reducer';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@material-ui/core';
import { Translate } from 'react-jhipster';
import Hammer from '@spectrum-icons/workflow/Hammer';
import { useHistory } from 'react-router-dom';

const BookmarksTable = props => {
  const history = useHistory();

  const redirectToBuildPage = bookmark => {
    history.push(
      `/dashboards/build?dashboardId=${bookmark.view.viewDashboard.id}&viewId=${bookmark.view.id}&bookmarkId=${bookmark.featureBookmark.id}`
    );
  };

  return (
      <div className="dx26-container">
        <Paper className="dx26-table-pager">
          <TableContainer>
            <Table aria-label="customized table">
              <TableHead style={{ backgroundColor: '#f5f5f5' }}>
                <TableCell align="center">
                  <Translate contentKey="global.field.id">ID</Translate>
                </TableCell>
                <TableCell align="center">
                  <Translate contentKey="featureBookmark.table.name">Bookmark Name</Translate>
                </TableCell>
                <TableCell align="center">
                  <Translate contentKey="featureBookmark.table.view">View</Translate>
                </TableCell>
                <TableCell align="center">
                  <Translate contentKey="featureBookmark.table.dashboard">Dashboard</Translate>
                </TableCell>
                <TableCell align="center">
                  <Translate contentKey="entity.action.manage">Manage</Translate>
                </TableCell>
              </TableHead>
              <TableBody>
                {props.recentlyAccessedBookmarks.length > 0 &&
                  props.recentlyAccessedBookmarks.map(bookmark => (
                    <TableRow key={`bookmark-${bookmark.featureBookmark.id}`}>
                      <TableCell align="center">{bookmark.featureBookmark.id}</TableCell>
                      <TableCell align="center">{bookmark.featureBookmark.name}</TableCell>
                      <TableCell align="center">{bookmark.view.viewName}</TableCell>
                      <TableCell align="center">{bookmark.view.viewDashboard.dashboardName}</TableCell>
                      <TableCell align="center">
                        <Flex gap="size-100" justifyContent="center">
                          <a
                            onClick={() => {
                              redirectToBuildPage(bookmark);
                            }}
                          >
                            <Hammer size="S" />
                          </a>
                        </Flex>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>
  );
};

const mapStateToProps = storeState => ({
  recentlyAccessedBookmarks: storeState.recent.recentlyAccessedBookmarks,
});

const mapDispatchToProps = { getRecentlyAccessedBookmarks };

export default connect(mapStateToProps, mapDispatchToProps)(BookmarksTable);
