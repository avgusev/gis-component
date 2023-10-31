export const formatDateToString = (date: Date): string => {
  let datestr = '';

  if (date) {
    const year: number | string = date?.getFullYear();

    // тк в js месяц от 0 до 11, а в postrg от 1 до 12
    let month: number | string = date?.getMonth() + 1;

    let day: number | string = date?.getDate();

    if (month < 10) {
      month = `0${month}`;
    }
    if (day < 10) {
      day = `0${day}`;
    }
    datestr = `${year}-${month}-${day}`;
  }

  return datestr;
};
