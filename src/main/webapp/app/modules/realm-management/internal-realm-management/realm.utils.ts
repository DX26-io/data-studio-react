import { ACTIVE_PAGE, ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';

export const overridePaginationStateWithQueryParams = (paginationBaseState, locationSearch: string) => {
    const params = new URLSearchParams(locationSearch);
    const page = params.get('page');
    const sort = params.get('sort');
    const organisationId = params.get('organisationId');
    paginationBaseState.itemsPerPage = paginationBaseState.itemsPerPage ? paginationBaseState.itemsPerPage : ITEMS_PER_PAGE;
    if (page && sort) {
      const sortSplit = sort.split(',');
      paginationBaseState.activePage = +page;
      paginationBaseState.sort = sortSplit[0];
      paginationBaseState.order = sortSplit[1];
    } else {
      paginationBaseState.activePage = ACTIVE_PAGE;
    }
    if (organisationId) {
      paginationBaseState.organisationId = organisationId;
    }
    return paginationBaseState;
  };