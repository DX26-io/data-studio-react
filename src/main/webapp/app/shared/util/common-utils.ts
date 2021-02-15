/**
 * Extracts the first letters of two words in a text
 * @param stringText
 */
export const getFirstLettersFromString = (stringText: string): string => {
  const splitString = stringText.split(' ', 2);
  let finalString = '';
  if (splitString.length > 1) splitString.map(word => (finalString = finalString + word.charAt(0)));
  else finalString = splitString[0].slice(0, 2);
  return finalString.toUpperCase();
};

export const parseBool = str => {
  if (str.length === null) {
    return str === 1 ? true : false;
  } else {
    if (typeof str === 'boolean') {
      return str;
    } else {
      return str.toLowerCase() === 'true' ? true : false;
    }
  }
};

export const parseString = str => {
  if (str) {
    return str;
  } else {
    return '';
  }
};

export const isCanvas = () => {
  if (window.location.href.endsWith('build')) {
    return true;
  } else {
    return false;
  }
};
