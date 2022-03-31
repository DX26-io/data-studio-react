import './header.scss';
import React, { useState, useEffect, ReactText } from 'react';
import { Flex, View, DialogContainer } from '@adobe/react-spectrum';
import SaveFloppy from '@spectrum-icons/workflow/SaveFloppy';
import Asset from '@spectrum-icons/workflow/Asset';
import BookmarkSingle from '@spectrum-icons/workflow/BookmarkSingle';
import Search from '@spectrum-icons/workflow/Search';
import GraphBarVerticalAdd from '@spectrum-icons/workflow/GraphBarVerticalAdd';
import CollectionEdit from '@spectrum-icons/workflow/CollectionEdit';
import Close from '@spectrum-icons/workflow/Close';
import VisualisationsList from 'app/entities/visualisations/visualisations-list';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import {
  createEntity as addVisualmetadataEntity,
  deleteEntity as deleteVisualmetadataEntity,
  toggleEditMode,
} from 'app/entities/visualmetadata/visualmetadata.reducer';
import { toggleFeaturesPanel, toggleFilterPanel,clearFilter,clearFilterForShareLink } from 'app/modules/canvas/filter/filter.reducer';
import { saveViewState } from 'app/entities/views/views.reducer';
import Filter from '@spectrum-icons/workflow/Filter';
import { translate } from 'react-jhipster';
import { toggleSearch } from 'app/entities/search/search.reducer';
import BookmarkUpdate from 'app/entities/bookmarks/bookmark-update';
import { getBookmarks, applyBookmark } from 'app/entities/bookmarks/bookmark.reducer';
import { getFeatureCriteria } from 'app/entities/feature-criteria/feature-criteria.reducer';
import { addFilterFromBookmark, applyDateFilters, getViewFeatureCriteria, removeEnabledFilters } from 'app/modules/canvas/filter/filter-util';
import { applyFilter, saveSelectedFilter } from 'app/modules/canvas/filter/filter.reducer';
import Select from 'react-select';
import { generateBookmarksOptions } from 'app/entities/bookmarks/bookmark.util';
import { saveRecentBookmark } from 'app/modules/home/sections/recent.reducer';
import CanvasHeaderIcon from 'app/shared/components/canvas-header-icon/canvas-header-icon';
import ShareAndroid from '@spectrum-icons/workflow/ShareAndroid';
import CanvasShareModal from 'app/modules/canvas/visualisation/visualisation-modal/visualisation-share-modal/canvas-share-modal';
import SearchModal from '../../../entities/search/search-modal';
import { getViewFeaturesEntities } from 'app/entities/feature/feature.reducer';



const CanvasHeader = props => {
  const [isVisualisationsModelOpen, setVisualisationsModelOpen] = useState(false);
  const [isSearchModelOpen,setIsSearchModelOpen] = useState(false)
  const [isBookmarkDialogOpen, setIsBookmarkDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const url = new URL(window.location.toString());

  const resetFilter = () => {
    if (!props.visualmetadataEntity.id) {
      props.clearFilter(removeEnabledFilters(props.selectedFilter,props.featuresList), props.visualmetadata, props.view);
      props.applyBookmark(null);
    } 
  }
  
  const headerIconList = [
    {
      icon: <CollectionEdit size="M" />,
      title: translate('canvas.menu.edit'),
      onPress: props.toggleEditMode,
      className: props.isEditMode ? 'enableEdit' : 'disableEdit',
      data: true,
    },
    {
      icon: <GraphBarVerticalAdd size="M" />,
      title: translate('canvas.menu.addVisualisation'),
      onPress: setVisualisationsModelOpen,
      data: true,
    },
    {
      icon: <SaveFloppy size="M" />,
      title: translate('canvas.menu.save'),
      onPress: props.saveViewState,
      data: {
        visualMetadataSet: props.visualmetadata.visualMetadataSet,
        _id: props.view.id,
        viewFeatureCriterias : getViewFeatureCriteria(props.selectedFilter,props.features,props.view.id,props.dynamicDateRangeMetaData),
      },
    },
    {
      icon: <Close size="M" />,
      title: translate('canvas.menu.resetFilter'),
      onPress:resetFilter,
    },
    {
      icon: <Asset size="M" />,
      title: translate('canvas.menu.toggleFeatures'),
      onPress: props.toggleFeaturesPanel,
    },
    {
      icon: <BookmarkSingle size="M" />,
      title: translate('featureBookmark.home.createLabel'),
      onPress: setIsBookmarkDialogOpen,
      data: true,
    },
    {
      icon: <Filter size="M" />,
      title: translate('canvas.menu.filter'),
      onPress: props.toggleFilterPanel,
    },
    {
      icon: <ShareAndroid size="M" />,
      title: translate('canvas.menu.share'),
      onPress: setIsShareDialogOpen,
      data: true,
    }, {
      icon: <Search size="M" />,
      title: translate('canvas.menu.search'),
      onPress: setIsSearchModelOpen,
      data: true
    },
  ];
  

  useEffect(() => {
    if (props.view.id) {
      props.getBookmarks(props.view.viewDashboard?.dashboardDatasource?.id);
    }
  }, [props.view]);

  const handleVisualisationClick = v => {
    props.addVisualmetadataEntity({
      viewId: props.view.id,
      visualMetadata: v,
    });
    setVisualisationsModelOpen(false);
  };

  useEffect(() => {
    if (props.fetchedFeatureCriteria) {
      const bookmarkFilters = addFilterFromBookmark({ ...props.bookmark, featureCriteria: props.featureCriteria });
      const filters=props.selectedFilter;
      Object.keys(bookmarkFilters).map((item)=>{
        filters[item]=bookmarkFilters[item];
      })
      props.saveSelectedFilter(filters);
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
                  url.searchParams.set('bookmarkId', selectedOption.value.toString());
                  window.history.pushState({}, '', url.href);
                } else {
                  props.applyFilter({}, props.visualmetadata, props.view);
                  props.applyBookmark(null);
                  url.searchParams.set('bookmarkId', '');
                  window.history.pushState({}, '', url.href);
                }
              }}
            />
          </div>
          <Flex wrap gap="size-100" marginTop="size-50">
            {headerIconList &&
              headerIconList.length > 0 &&
              headerIconList.map(card => (
                <CanvasHeaderIcon
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
        <DialogContainer onDismiss={() => setIsShareDialogOpen(false)}>{isShareDialogOpen && <CanvasShareModal />}</DialogContainer>
        <DialogContainer type="fullscreen" onDismiss={() => setVisualisationsModelOpen(false)} {...props}>
          {isVisualisationsModelOpen && (
            <VisualisationsList
              handleVisualisationClick={handleVisualisationClick}
              view={props.view}
              visualisations={props.visualisationsList}
              totalItem={props.visualmetadata.visualmetadataList?.length || 0}
              setVisualisationsModelOpen={setVisualisationsModelOpen}
            />
          )}
        </DialogContainer>
        <DialogContainer onDismiss={() => setIsBookmarkDialogOpen(false)}>
          {isBookmarkDialogOpen && <BookmarkUpdate setOpen={setIsBookmarkDialogOpen} />}
        </DialogContainer>
        <DialogContainer type="fullscreen" onDismiss={() => setIsSearchModelOpen(false)}>
          {isSearchModelOpen && (
            <SearchModal viewId={props.view.id} setOpen={setIsSearchModelOpen} />
          )}
        </DialogContainer>
      </View>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  isAuthenticated: storeState.authentication.isAuthenticated,
  visualmetadata: storeState.views.viewState,
  visualisationsList: storeState.visualisations.entities,
  visualmetadataEntity: storeState.visualmetadata.entity,
  isEditMode: storeState.visualmetadata.isEditMode,
  bookmarkSelectOptions: generateBookmarksOptions(storeState.bookmarks.bookmarks),
  bookmarks: storeState.bookmarks.bookmarks,
  fetchedFeatureCriteria: storeState.featureCriteria.fetchedFeatureCriteria,
  featureCriteria: storeState.featureCriteria.featureCriteria,
  view: storeState.views.entity,
  selectedFilter: storeState.filter.selectedFilters,
  featuresList: storeState.feature.entities,
  bookmark: storeState.bookmarks.appliedBookmark,
  features: storeState.feature.entities,
  dynamicDateRangeMetaData: storeState.filter.dynamicDateRangeMetaData
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
  saveRecentBookmark,
  saveSelectedFilter,
  getViewFeaturesEntities,
  clearFilter,
  clearFilterForShareLink
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(CanvasHeader);
