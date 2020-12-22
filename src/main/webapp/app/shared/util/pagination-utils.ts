import { IPaginationBaseState } from 'react-jhipster';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';

/**
 * This method returns initial default pagination
 */
export const getDefaultInitialPaginationState = (): IPaginationBaseState => {
  return {
    sort: 'id',
    order: 'asc',
    activePage: 1,
    itemsPerPage: ITEMS_PER_PAGE,
  };
};
