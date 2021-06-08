export interface IEmail {
  userEmail: string;
  userName: string;
}

export const emailDefaultValue: Readonly<IEmail> = {
  userEmail: '',
  userName: '',
};
