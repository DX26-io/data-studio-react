import { IBookmark } from 'app/shared/model/bookmark.model';
import { IError, defaultValue } from 'app/shared/model/error.model';

const isValidName = (name: string) => {
  return name !== '';
};

const isValidLength = (name: string) => {
  return name.length > 50;
};

export const isFormValid = (bookmark: IBookmark): IError => {
  let error = defaultValue;
  if (!isValidName(bookmark.name)) {
    error = { translationKey: 'featureBookmark.error.name', isValid: false };
  } else if (isValidLength(bookmark.name)) {
    error = { translationKey: 'featureBookmark.error.length', isValid: false };
  }
  return error;
};

export const generateBookmarksOptions = (bookmarks) => {
  const options = [];
  bookmarks.forEach(function (item) {
    options.push({ value: item.id, label: item.name });
  });
  return options;
};

