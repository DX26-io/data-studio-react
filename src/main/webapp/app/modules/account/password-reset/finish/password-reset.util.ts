export const isPasswordNull = (password: string) => {
  return !password;
};

export const isPasswordMinLengthValid = (password: string) => {
  return password && password.length < 4;
};

export const isPasswordMaxLengthValid = (password: string) => {
  return password && password.length > 50;
};

export const isPasswordEqual = (newPassword: string, confirmPassword: string) => {
  return newPassword && confirmPassword && newPassword !== confirmPassword;
};
