import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Flex, SearchField } from '@adobe/react-spectrum';
import { getRecentlyAccessedBookmarks } from 'app/modules/home/sections/recent.reducer';
import { translate } from 'react-jhipster';

const BookmarksCard = props => {
  const [searchedText, setSearchedText] = React.useState('');
  let delayTimer;

  const getBookmarks = text => {
    clearTimeout(delayTimer);
    delayTimer = setTimeout(() => {
      props.getRecentlyAccessedBookmarks(0, 5, 'watchTime,desc', text);
    }, 1000);
  };

  const onChangeSearchedText = event => {
    setSearchedText(event);
    if (event.length >= 2 || event.length === 0) {
      getBookmarks(event);
    }
  };

  useEffect(() => {
    getBookmarks('');
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

export default connect(null, mapDispatchToProps)(BookmarksCard);
