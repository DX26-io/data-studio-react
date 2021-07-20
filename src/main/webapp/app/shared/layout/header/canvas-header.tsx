import './header.scss';
import React, { useState, useEffect, ReactText } from 'react';
import { Flex, ActionButton, View, DialogContainer, TooltipTrigger, Tooltip, MenuTrigger, Menu, Item, Picker } from '@adobe/react-spectrum';
import MoreCircle from '@spectrum-icons/workflow/MoreCircle';
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
import { getBookmarks, applyBookmark } from 'app/entities/bookmarks/bookmark.reducer';
import VisualizationShareModal from 'app/modules/canvas/visualization/visualization-modal/visualization-share-modal/visualization-share-modal';
import { getFeatureCriteria } from 'app/entities/feature-criteria/feature-criteria.reducer';
import { addFilterFromBookmark } from 'app/modules/canvas/filter/filter-util';
import { applyFilter } from 'app/modules/canvas/filter/filter.reducer';
import Select from 'react-select';
import { generateBookmarksOptions } from 'app/entities/bookmarks/bookmark.util';
import { saveRecentBookmark } from "app/modules/home/sections/recent.reducer";
import HeaderIcon from 'app/shared/components/header-icon/header-icon';
import ShareAndroid from '@spectrum-icons/workflow/ShareAndroid';

const CanvasHeader = props => {
  const [isVisualizationsModelOpen, setVisualizationsModelOpen] = useState(false);
  const [isBookmarkDialogOpen, setIsBookmarkDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const url = new URL(window.location.toString());

  const adminList = [
    {
      icon: <CollectionEdit size="M" />,
      title: translate('views.menu.edit'),
      onPress: props.toggleEditMode,
      className: props.isEditMode ? 'enableEdit' : 'disableEdit',
      data: true
    },
    {
      icon: <GraphBarVerticalAdd size="M" />,
      title: translate('views.menu.addVisualization'),
      onPress: setVisualizationsModelOpen,
      data: true
    },
    {
      icon: <SaveAsFloppy size="M" />,
      title: translate('views.menu.save'),
      onPress: props.saveViewState,
      data: {
        visualMetadataSet: props.visualmetadata.visualMetadataSet,
        _id: props.view.id,
      }
    },
    {
      icon: <Asset size="M" />,
      title: translate('views.menu.toggleFeatures'),
      onPress: props.toggleFeaturesPanel,
    },
    {
      icon: <BookmarkSingle size="M" />,
      title: translate('featureBookmark.home.createLabel'),
      onPress: setIsBookmarkDialogOpen,
      data: true
    },
   
    {
      icon: <Search size="M" />,
      title: translate('views.menu.search'),
      onPress: props.toggleSearch,
    },
    {
      icon: <Filter size="M" />,
      title: translate('views.menu.filter'),
      onPress: props.toggleFilterPanel
    },
    {
      icon: <ShareAndroid size="M" />,
      title: translate('views.menu.share'),
      onPress: setIsShareDialogOpen,
      data: true
    }
  ];

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
          <div style={{ minWidth: '305px', paddingRight: '10px' }}>
            <Select
              className="basic-single"
              classNamePrefix="select"
              isClearable
              isSearchable
              placeholder={translate('featureBookmark.search')}
              value={props.bookmark && props.bookmark.id ? { value: props.bookmark.id, label: props.bookmark.name } : null}
              options={props.bookmarkSelectOptions}
              onChange={selectedOption => {
                if (selectedOption) {
                  const _bookmark = props.bookmarks.filter(b => b.id === selectedOption.value)[0];
                  props.applyBookmark(_bookmark);
                  props.getFeatureCriteria(selectedOption.value.toString());
                  props.saveRecentBookmark(_bookmark.id, props.view.id);
                  url.searchParams.set("bookmarkId", selectedOption.value.toString());
                  window.history.pushState({}, '', url.href);
                } else {
                  props.applyFilter({}, props.visualmetadata, props.view);
                  props.applyBookmark(null);
                }
              }}
            />

          </div>

          <Flex wrap>
            {adminList && adminList.length > 0 && adminList.map(card => (
              <HeaderIcon
                key={card.title}
                icon={card.icon}
                title={card.title}
                className={card.className}
                onPress={card.onPress}
                data={card.data}
              />
            ))}
          </Flex>

        </Flex>
        <DialogContainer onDismiss={() => setIsShareDialogOpen(false)}>
          {isShareDialogOpen && <VisualizationShareModal />}
        </DialogContainer>
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
