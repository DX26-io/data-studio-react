import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Flex, SearchField } from '@adobe/react-spectrum';
import { getRecentlyAccessedBookmarks } from 'app/modules/home/sections/recent.reducer';
import { translate } from 'react-jhipster';
import { debouncedSearch } from 'app/shared/util/common-utils';

const BookmarkSearch = props => {
  const [searchedText, setSearchedText] = React.useState('');

  const onChangeSearchedText = event => {
    setSearchedText(event);
    debouncedSearch(props.getRecentlyAccessedBookmarks,[0, 5, 'watchTime,desc', event]);
  };

  useEffect(() => {
    props.getRecentlyAccessedBookmarks(0, 5, 'watchTime,desc', '');
  }, []);

  return (
    <Flex justifyContent="center" alignItems="center">
      <SearchField
        placeholder={translate('featureBookmark.search')}
        onClear={() => {
          setSearchedText('');
        }}
        onChange={onChangeSearchedText}
        onSubmit={event => {
          setSearchedText(event);
          props.getRecentlyAccessedBookmarks(0, 5, 'watchTime,desc', event);
        }}
        value={searchedText}
        width="size-4600"
      />
    </Flex>
  );
};

const mapDispatchToProps = { getRecentlyAccessedBookmarks };

type DispatchProps = typeof mapDispatchToProps;

export default connect(null, mapDispatchToProps)(BookmarkSearch);
