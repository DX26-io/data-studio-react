import './header.scss';
import React, { useState, useEffect, ReactText } from 'react';
import { Flex, ActionButton, View, DialogContainer, TooltipTrigger, Tooltip, MenuTrigger, Menu, Item, Picker } from '@adobe/react-spectrum';
import MoreSmallListVert from '@spectrum-icons/workflow/MoreSmallListVert';
import SaveAsFloppy from '@spectrum-icons/workflow/SaveAsFloppy';
import Asset from '@spectrum-icons/workflow/Asset';
import BookmarkSingle from '@spectrum-icons/workflow/BookmarkSingle';
import Search from '@spectrum-icons/workflow/Search';
import GraphBarVerticalAdd from '@spectrum-icons/workflow/GraphBarVerticalAdd';
import CollectionEdit from '@spectrum-icons/workflow/CollectionEdit';
import VisualizationsList from 'app/entities/visualizations/visualizations-list';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import {
  createEntity as addVisualmetadataEntity,
  deleteEntity as deleteVisualmetadataEntity,
  toggleEditMode,
} from 'app/entities/visualmetadata/visualmetadata.reducer';
import { toggleFeaturesPanel, toggleFilterPanel } from 'app/modules/canvas/filter/filter.reducer';
import { saveViewState } from 'app/entities/views/views.reducer';
import Filter from '@spectrum-icons/workflow/Filter';
import { translate } from 'react-jhipster';
import { toggleSearch } from 'app/entities/search/search.reducer';
import BookmarkUpdate from 'app/entities/bookmarks/bookmark-update';
import { getBookmarks,applyBookmark } from 'app/entities/bookmarks/bookmark.reducer';
import VisualizationShareModal from 'app/modules/canvas/visualization/visualization-modal/visualization-share-modal/visualization-share-modal';
import { getFeatureCriteria } from 'app/entities/feature-criteria/feature-criteria.reducer';
import { addFilterFromBookmark } from 'app/modules/canvas/filter/filter-util';
import { applyFilter } from 'app/modules/canvas/filter/filter.reducer';
import Select from 'react-select';
import { generateBookmarksOptions } from 'app/entities/bookmarks/bookmark.util';
import {saveRecentBookmark  } from "app/modules/home/sections/recent.reducer";

const CanvasHeader = props => {
  const [isVisualizationsModelOpen, setVisualizationsModelOpen] = useState(false);
  const [isBookmarkDialogOpen, setIsBookmarkDialogOpen] = useState(false);
  const [dialog, setDialog] = useState<ReactText>();
  const url = new URL(window.location.toString());

  useEffect(() => {
    if (props.view.id) {
      props.getBookmarks(props.view.viewDashboard?.dashboardDatasource?.id);
    }
  }, [props.view]);

  const handleVisualizationClick = v => {
    props.addVisualmetadataEntity({
      viewId: props.view.id,
      visualMetadata: v,
    });
    setVisualizationsModelOpen(false);
  };
  const handleToggleEditMode = () => {
    props.toggleEditMode();
  };
  const handleToggleFilterPanel = () => {
    props.toggleFilterPanel();
  };

  const saveAllVisualizations = () => {
    props.saveViewState({
      visualMetadataSet: props.visualmetadata.visualMetadataSet,
      _id: props.view.id,
    });
  };

  const toggleFeatures = () => {
    props.toggleFeaturesPanel();
  };

  const toggleSearchModal = () => {
    props.toggleSearch();
  };

  useEffect(() => {
    if (props.fetchedFeatureCriteria) {
      const filters = addFilterFromBookmark({ ...props.bookmark, featureCriteria: props.featureCriteria });
      props.applyFilter(filters, props.visualmetadata, props.view);
    }
  }, [props.fetchedFeatureCriteria]);

  return (
    <>
      <View marginEnd="size-600">
        <Flex gap="size-50" wrap="nowrap">
          <div style={{ minWidth: '305px',paddingRight:'10px'}}>
            <Select
              className="basic-single"
              classNamePrefix="select"
              isClearable
              isSearchable
              placeholder={translate('bookmarks.search')}
              value={props.bookmark && props.bookmark.id ? { value: props.bookmark.id, label: props.bookmark.name } : null}
              options={props.bookmarkSelectOptions}
              onChange={selectedOption => {
                if (selectedOption) {
                  const _bookmark = props.bookmarks.filter(b => b.id === selectedOption.value)[0];
                  props.applyBookmark(_bookmark);
                  props.getFeatureCriteria(selectedOption.value.toString());
                  props.saveRecentBookmark(_bookmark.id,props.view.id);
                  url.searchParams.set("bookmarkId",selectedOption.value.toString());
                  window.history.pushState({}, '', url);
                } else {
                  props.applyFilter({}, props.visualmetadata, props.view);
                  props.applyBookmark(null);
                }
              }}
            />
          </div>
          <TooltipTrigger>
            <ActionButton onPress={() => handleToggleEditMode()} aria-label="enable edit" isQuiet={true} >
              <div className={props.isEditMode ? 'enableEdit' : 'disableEdit'}>
                <CollectionEdit color="informative" size="M" />
              </div>
            </ActionButton>
            <Tooltip>Edit</Tooltip>
          </TooltipTrigger>
          <TooltipTrigger>
            <ActionButton
              onPress={() => setVisualizationsModelOpen(true)}
              aria-label="GraphBarVerticalAdd"
              isQuiet={true}
              isDisabled={!props.isEditMode}
            >
              <GraphBarVerticalAdd size="M" />
            </ActionButton>
            <Tooltip>Add Visualization</Tooltip>
          </TooltipTrigger>
          <TooltipTrigger>
            <ActionButton onPress={() => saveAllVisualizations()} aria-label="Save" isQuiet={true} >
              <SaveAsFloppy size="M" />
            </ActionButton>
            <Tooltip>Save</Tooltip>
          </TooltipTrigger>
          <TooltipTrigger>
            <ActionButton onPress={() => toggleFeatures()} aria-label="Features" isQuiet={true} isDisabled={!props.isEditMode}>
              <Asset size="M" />
            </ActionButton>
            <Tooltip>Toggle features</Tooltip>
          </TooltipTrigger>
          <TooltipTrigger>
            <ActionButton onPress={() => setIsBookmarkDialogOpen(true)} aria-label="Bookmarks" isQuiet={true} >
              <BookmarkSingle size="M" />
            </ActionButton>
            <Tooltip>{translate('bookmarks.home.createLabel')}</Tooltip>
          </TooltipTrigger>
          <TooltipTrigger>
            <MenuTrigger>
              <ActionButton aria-label="Bookmarks" isQuiet={true} >
                <MoreSmallListVert size="M" />
              </ActionButton>
              <Menu onAction={key => setDialog(key)}>
                <Item key="Bookmarks">Bookmarks</Item>
                <Item key="Share">Share</Item>
                <Item key="Print">Print</Item>
              </Menu>
            </MenuTrigger>
            <Tooltip>More</Tooltip>
          </TooltipTrigger>
          <DialogContainer onDismiss={() => setDialog(null)}>{dialog === 'Share' && <VisualizationShareModal />}</DialogContainer>
          <TooltipTrigger>
            <ActionButton
              onPress={() => toggleSearchModal()}
              aria-label="{translate('views.menu.search')}"
              isQuiet={true}
            >
              <Search size="M" />
            </ActionButton>
            <Tooltip>{translate('views.menu.toggle.search')}</Tooltip>
          </TooltipTrigger>
          <TooltipTrigger>
            <ActionButton onPress={() => handleToggleFilterPanel()} isQuiet={true} >
              <Filter size="M" />
            </ActionButton>
            <Tooltip>Filter</Tooltip>
          </TooltipTrigger>
        </Flex>
        <DialogContainer type="fullscreen" onDismiss={() => setVisualizationsModelOpen(false)} {...props}>
          {isVisualizationsModelOpen && (
            <VisualizationsList
              handleVisualizationClick={handleVisualizationClick}
              view={props.view}
              visualizations={props.visualizationsList}
              totalItem={props.visualmetadata.visualmetadataList?.length || 0}
              setVisualizationsModelOpen={setVisualizationsModelOpen}
            />
          )}
        </DialogContainer>
        <DialogContainer onDismiss={() => setIsBookmarkDialogOpen(false)}>
          {isBookmarkDialogOpen && <BookmarkUpdate setOpen={setIsBookmarkDialogOpen} />}
        </DialogContainer>
      </View>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  isAuthenticated: storeState.authentication.isAuthenticated,
  visualmetadata: storeState.views.viewState,
  visualizationsList: storeState.visualizations.entities,
  visualmetadataEntity: storeState.visualmetadata.entity,
  isEditMode: storeState.visualmetadata.isEditMode,
  bookmarkSelectOptions: generateBookmarksOptions(storeState.bookmarks.bookmarks),
  bookmarks: storeState.bookmarks.bookmarks,
  fetchedFeatureCriteria: storeState.featureCriteria.fetchedFeatureCriteria,
  featureCriteria: storeState.featureCriteria.featureCriteria,
  view: storeState.views.entity,
  selectedFilter: storeState.filter.selectedFilters,
  bookmark: storeState.bookmarks.appliedBookmark,
});

const mapDispatchToProps = {
  addVisualmetadataEntity,
  toggleEditMode,
  toggleFilterPanel,
  toggleFeaturesPanel,
  toggleSearch,
  saveViewState,
  getBookmarks,
  getFeatureCriteria,
  applyFilter,
  applyBookmark,
  saveRecentBookmark
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(CanvasHeader);
