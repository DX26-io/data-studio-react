import React, { useEffect, useRef, useState } from 'react';
import {
  ActionButton,
  Button,
  ButtonGroup,
  Content,
  Dialog,
  Divider,
  Flex,
  Form,
  Heading,
  TextArea,
  View,
  ProgressBar,
  Text,
} from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { translate, Translate } from 'react-jhipster';
import { disconnectSocket, receiveSocketResponse, resetSearch, doSearch } from 'app/entities/search/search.reducer';
import { forwardCall, searchItemSelected } from 'app/shared/websocket/proxy-websocket.service';
import Search from '@spectrum-icons/workflow/Search';
import { getEntity as getVisualmetadataEntity, setVisual } from 'app/entities/visualmetadata/visualmetadata.reducer';
import { getEntity as getFeatureEntity } from 'app/entities/feature/feature.reducer';
import { getEntity as getViewEntity } from 'app/entities/views/views.reducer';
import { convertSearchStructToQueryDTO, convertSearchStructToFilters } from './search.util';
import { getConditionExpression } from './search.util';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';
import { toggleLoading,setFilterData } from 'app/shared/websocket/websocket.reducer';

// TODO: let the code commented as it will be used in future

export interface ISearchModalProps extends StateProps, DispatchProps {
  setOpen: (boolean) => void;
  viewId: string;
}

const SearchModal = (props: ISearchModalProps) => {
  const [searchText, setSearchText] = useState<string>('');

  // const onSearchSelect = event => {
  //   setSearchCursorPos(event.target.selectionStart);
  // };

  // const onAutoSuggestionItemChange = selectedSet => {
  //   const item = props.autoSuggestion.find(ft => selectedSet.has(ft.text));
  //   if (item) {
  //     searchItemSelected(props.viewId, { text: props.searchText, item: item.text, cursor: searchCursorPos });
  //   }
  // };

  const handleSearchClick = () => {};

  useEffect(() => {
    props.receiveSocketResponse();
    props.disconnectSocket;
    props.setFilterData(null);
  }, []);

  const handleClose = () => {
    props.resetSearch();
    props.setOpen(false);
  };

  const onSearchPressed = () => {
    props.doSearch(props.viewId, searchText);
  };

  const onSearchTextChange = value => {
    setSearchText(value);
  };

  useEffect(() => {
    if (props.searchStructRequest && props.searchStruct) {
      const queryDTO = convertSearchStructToQueryDTO(props.searchStruct);
      const filters = convertSearchStructToFilters(props.features, props.searchStruct.where.conditions);
      queryDTO['conditionExpressions'] = [getConditionExpression(filters)];
      queryDTO['limit'] = 20;
      props.toggleLoading(true);
      forwardCall(
        props.datasourceId,
        {
          queryDTO,
          type: 'filters',
          viewId: props.viewId,
        },
        props.viewId
      );
    }
  }, [props.searchStructRequest]);

  const generateTableHead = () => {
    const cells = props.filterData
      ? Object.keys(props.filterData[0]).map(function (key) {
          return (
            <TableCell align="center" key={key}>
              {key}
            </TableCell>
          );
        })
      : null;
    return cells;
  };

  const generateTableBody = row => {
    const cells = row
      ? Object.keys(row).map(function (key) {
          return (
            <TableCell align="center" key={key}>
              {row[key]}
            </TableCell>
          );
        })
      : null;
    return cells;
  };

  return (
    <>
      <Dialog>
        <Heading>
          <Translate contentKey="views.search.title">_Search</Translate>
        </Heading>
        <Divider />
        <Content>
          <Form isRequired necessityIndicator="icon" width="100%">
            <Flex alignItems={'center'} direction="column" gap="size-100">
              <Flex alignItems={'center'} direction="row" width="100%" alignContent="end">
                <TextArea
                  width="100%"
                  labelPosition="side"
                  labelAlign="end"
                  marginX={'size-100'}
                  label={translate('views.search.search')}
                  value={searchText}
                  onChange={onSearchTextChange}
                />
                <ActionButton onPress={onSearchPressed} aria-label="{translate('views.menu.search')}" isQuiet>
                  <Search size="M" />
                </ActionButton>
              </Flex>
              {/* {rendering} */}
              {/* <ListBox
                aria-label="Auto-suggestions"
                selectionMode="single"
                onSelectionChange={onAutoSuggestionItemChange}
                items={props.autoSuggestion}
              >
                {item => <Item key={item.text}>{item.text}</Item>}
              </ListBox> */}
            </Flex>
          </Form>
          {props.loading ? (
            <View marginTop="size-125">
              <Flex direction="column" gap="size-125" marginTop="size-250">
                <ProgressBar label="Loading…" isIndeterminate />
              </Flex>
            </View>
          ) : (
            <React.Fragment>
              {props.filterData && props.filterData.length > 0 ? (
                <View marginTop="size-125">
                  <Flex direction="column" gap="size-125">
                    <Text>
                      <Translate contentKey="views.search.results">Results</Translate>
                    </Text>
                    <Divider size="M" />
                  </Flex>
                </View>
              ) : null}
              <View marginTop="size-250">
                <div className="dx26-container">
                  <Paper className="dx26-table-pager">
                    <TableContainer>
                      <Table aria-label="customized table">
                        <TableHead>
                          <TableRow>{generateTableHead()}</TableRow>
                        </TableHead>
                        <TableBody>
                          {props.filterData &&
                            props.filterData.map((row, i) => <TableRow key={`row-${i}`}>{generateTableBody(row)}</TableRow>)}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </div>
              </View>
            </React.Fragment>
          )}
        </Content>
        <ButtonGroup>
          <Button variant="primary" onPress={handleClose}>
            <Translate contentKey="entity.action.cancel">_Cancel</Translate>
          </Button>
          <Button onPress={handleSearchClick} variant="primary">
            <Translate contentKey="entity.action.pin">_Pin</Translate>
          </Button>
          <Button onPress={handleSearchClick} variant="primary">
            <Translate contentKey="entity.action.savebookmark">_Save</Translate>
          </Button>
          <Button onPress={handleSearchClick} variant="primary">
            <Translate contentKey="entity.action.createview">_Create</Translate>
          </Button>
        </ButtonGroup>
      </Dialog>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  autoSuggestion: storeState.search.autoSuggestion,
  searchText: storeState.search.searchText,
  searchStruct: storeState.search.searchStruct,
  searchStructRequest: storeState.search.searchStructRequest,
  visualmetadataEntity: storeState.visualmetadata.entity,
  features: storeState.feature.entities,
  visualizations: storeState.visualisations.entities,
  datasourceId: storeState.views.entity?.viewDashboard?.dashboardDatasource?.id,
  filterData: storeState.visualmetadata.filterData?.body,
  loading: storeState.visualmetadata.loading,
});

const mapDispatchToProps = {
  resetSearch,
  receiveSocketResponse,
  disconnectSocket,
  doSearch,
  setVisual,
  getVisualmetadataEntity,
  getViewEntity,
  getFeatureEntity,
  toggleLoading,
  setFilterData
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(SearchModal);
