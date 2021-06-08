export interface ISchedule {
  cronExp: string;
  timezone: string;
  startDate: Date;
  endDate: Date;
}

export const scheduleDefaultValue: Readonly<ISchedule> = {
  cronExp: '',
  timezone: '',
  startDate: null,
  endDate: null,
};
