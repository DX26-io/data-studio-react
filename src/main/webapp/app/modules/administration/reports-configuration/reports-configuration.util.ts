export const isFormValid = (config: any, properties: any) => {
  let error = { message: '', isValid: true };
  properties.forEach(function (property) {
    if (
      (property.fieldType === 'Integer' && property.required && config[property.fieldName] === 0) ||
      (property.required && config[property.fieldName] === '') ||
      (property.required && !config[property.fieldName])
    ) {
      error = { message: property.displayName + ' is required', isValid: false };
      return error;
    }
  });
  return error;
};
