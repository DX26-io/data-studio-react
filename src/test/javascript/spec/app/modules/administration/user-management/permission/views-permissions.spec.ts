import { connect } from 'react-redux';
import {
  getUserViewsPermissions,
  getUserGroupViewsPermissions,
  updateUserGroupPermissions,
  updateUserPermissions,
  resetViewsPermissions,
} from 'app/modules/administration/user-management/permission/permissions.reducer';
import { IRootState } from 'app/shared/reducers';
import {
  Flex,
  Dialog,
  Text,
  SearchField,
  Header,
  Button,
  useDialogContainer,
  Heading,
  Divider,
  Content,
  Checkbox,
} from '@adobe/react-spectrum';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@material-ui/core';
import { ITEMS_PER_PAGE, ACTIVE_PAGE, ITEMS_PER_PAGE_OPTIONS } from 'app/shared/util/pagination.constants';
import { Translate, getSortState } from 'react-jhipster';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { findViewsPermissionsChanges } from 'app/modules/administration/user-management/permission/permissions-util';
