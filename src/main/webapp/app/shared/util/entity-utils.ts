import pick from 'lodash/pick';
import { IPaginationBaseState } from 'react-jhipster';
import { ACTIVE_PAGE, ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';

/**
 * Removes fields with an 'id' field that equals ''.
 * This function was created to prevent entities to be sent to
 * the server with relationship fields with empty an empty id and thus
 * resulting in a 500.
 *
 * @param entity Object to clean.
 */
export const cleanEntity = entity => {
  const keysToKeep = Object.keys(entity).filter(k => !(entity[k] instanceof Object) || (entity[k]['id'] !== '' && entity[k]['id'] !== -1));

  return pick(entity, keysToKeep);
};

/**
 * Simply map a list of element to a list a object with the element as id.
 *
 * @param idList Elements to map.
 * @returns The list of objects with mapped ids.
 */
export const mapIdList = (idList: ReadonlyArray<any>) =>
  idList.filter((entityId: any) => entityId !== '').map((entityId: any) => ({ id: entityId }));

export const overridePaginationStateWithQueryParams = (paginationBaseState: IPaginationBaseState, locationSearch: string) => {
  const params = new URLSearchParams(locationSearch);
  const page = params.get('page');
  const sort = params.get('sort');
  paginationBaseState.itemsPerPage = paginationBaseState.itemsPerPage ? paginationBaseState.itemsPerPage : ITEMS_PER_PAGE;
  if (page && sort) {
    const sortSplit = sort.split(',');
    paginationBaseState.activePage = +page;
    paginationBaseState.sort = sortSplit[0];
    paginationBaseState.order = sortSplit[1];
  } else {
    paginationBaseState.activePage = ACTIVE_PAGE;
  }
  return paginationBaseState;
};

export const setItemsPerPagePerPage = itemsPerPage => {
  return itemsPerPage ? itemsPerPage : ITEMS_PER_PAGE;
};
