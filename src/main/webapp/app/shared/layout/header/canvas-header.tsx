import './header.scss';
import React, { useState, useEffect, ReactText } from 'react';
import { ActionButton, View, DialogContainer, TooltipTrigger, Tooltip, MenuTrigger, Menu, Item, Picker } from '@adobe/react-spectrum';
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
import { ComboBox, Item as ComboBoxItem } from '@react-spectrum/combobox';
import { getBookmarks } from 'app/entities/bookmarks/bookmark.reducer';
import VisualizationShareModal from 'app/modules/canvas/visualization/visualization-modal/visualization-share-modal/visualization-share-modal';
import { getFeatureCriteria } from 'app/entities/feature-criteria/feature-criteria.reducer';
import { IBookmark } from 'app/shared/model/bookmark.model';
import { addFilterFromBookmark } from 'app/modules/canvas/filter/filter-util';
import { applyFilter } from 'app/modules/canvas/filter/filter.reducer';

const CanvasHeader = props => {
  const [isVisualizationsModelOpen, setVisualizationsModelOpen] = useState(false);
  const [isBookmarkDialogOpen, setIsBookmarkDialogOpen] = useState(false);
  const [bookmarkId, setBookmarkId] = useState('');
  const [bookmark, setBookmark] = useState<IBookmark>();
  const [dialog, setDialog] = useState<ReactText>();

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

  const applyBookmark = id => {
    props.getFeatureCriteria(id);
  };

  useEffect(() => {
    if (props.fetchedFeatureCriteria) {
      const filters = addFilterFromBookmark({ ...bookmark, featureCriteria: props.featureCriteria });
      props.applyFilter(filters, props.visualmetadata, props.view);
     // props.modifyFilterState();
    }
  }, [props.fetchedFeatureCriteria]);

  return (
    <>
      <View>
        {/* <ComboBox
          placeholder={translate('bookmarks.search')}
          items={props.bookmarks}
          inputValue={bookmarkName}
          onSelectionChange={event => {}}
          onInputChange={event => {}}
        >
          {item => <ComboBoxItem>{item.name}</ComboBoxItem>}
        </ComboBox> */}
        {/* TODO : Picker needs to be replaced with combobox in near future 
        using Picker for time being */}
        
        <Picker
          placeholder={translate('bookmarks.search')}
          onSelectionChange={selected => {
            setBookmarkId(selected.toString());
            applyBookmark(selected.toString());
            const _bookmark = props.bookmarks.filter(item => {
              return item.id === selected;
            })[0];
            setBookmark(_bookmark);
          }}
        >
          {props.bookmarks.map(item => (
            <Item key={item.id}>{item.name}</Item>
          ))}
        </Picker>

        <TooltipTrigger>
          <ActionButton onPress={() => handleToggleEditMode()} aria-label="enable edit" isQuiet={true} marginEnd="size-5">
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
            marginEnd="size-5"
            isDisabled={!props.isEditMode}
          >
            <GraphBarVerticalAdd size="M" />
          </ActionButton>
          <Tooltip>Add Visualization</Tooltip>
        </TooltipTrigger>
        <TooltipTrigger>
          <ActionButton onPress={() => saveAllVisualizations()} aria-label="Save" isQuiet={true} marginEnd="size-5">
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
          <ActionButton onPress={() => setIsBookmarkDialogOpen(true)} aria-label="Bookmarks" isQuiet={true} marginEnd="size-5">
            <BookmarkSingle size="M" />
          </ActionButton>
          <Tooltip>{translate('bookmarks.home.createLabel')}</Tooltip>
        </TooltipTrigger>
        <TooltipTrigger>
          <MenuTrigger>
            <ActionButton aria-label="Bookmarks" isQuiet={true} marginEnd="size-5">
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
          <ActionButton onPress={() => toggleSearchModal()} aria-label="{translate('views.menu.search')}" isQuiet={true} marginEnd="size-5">
            <Search size="M" />
          </ActionButton>
          <Tooltip>{translate('views.menu.toggle.search')}</Tooltip>
        </TooltipTrigger>

        <TooltipTrigger>
          <ActionButton onPress={() => handleToggleFilterPanel()} isQuiet={true} marginEnd="size-5">
            <Filter size="M" />
          </ActionButton>
          <Tooltip>Filter</Tooltip>
        </TooltipTrigger>

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
  bookmarks: storeState.bookmarks.bookmarks,
  fetchedFeatureCriteria: storeState.featureCriteria.fetchedFeatureCriteria,
  featureCriteria: storeState.featureCriteria.featureCriteria,
  view: storeState.views.entity,
  selectedFilter: storeState.filter.selectedFilters,
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
  //modifyFilterState,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(CanvasHeader);
