import React, { useEffect } from 'react';
import { Flex, Heading, ProgressCircle, Text, View } from '@adobe/react-spectrum';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, makeStyles } from '@material-ui/core';
import { Translate, getSortState } from 'react-jhipster';
import uuid from 'react-uuid';

interface ITableProps {
  data: any;
}
const TableView: React.FC<ITableProps> = props => {
  return (
    <>
      <View>
        <Paper className="dx26-table-pager">
          <TableContainer>
            <Table size="small" stickyHeader aria-label="sticky table">
              <TableHead style={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  {Object.keys(props.data[0]).map(col => {
                    return <TableCell  align="left">{col}</TableCell>;
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {props.data &&
                  props.data.length > 0 &&
                  props.data.map(row => {
                    return (
                      <TableRow key={uuid()}>
                        {Object.keys(row).map(col => {
                          return <TableCell align="left">{row[col]}</TableCell>;
                        })}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </View>
    </>
  );
};

export default TableView;
