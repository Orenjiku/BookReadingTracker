const sortByLastName = (arr: string[]) => {
  return arr.sort((a, b) => {
    const lastNameA = a.split(' ').slice(-1)[0];
    const lastNameB = b.split(' ').slice(-1)[0];
    return lastNameA.localeCompare(lastNameB);
  })
};

const isValidDate = (s: string) => {
  if ( ! /^\d{4}-\d{2}-\d{2}$/.test(s) ) return false;
  let [ yyyy, mm, dd ] = s.split('-').map((p: string) => parseInt(p, 10));
  const compareDate = new Date(`${mm}-${dd}-${yyyy}`); //arrange mm-dd-yyyy because new Date(yyyy-mm-dd) modifies the date based on the time zone.
  return compareDate.getFullYear() === yyyy && compareDate.getMonth() === mm - 1 && compareDate.getDate() === dd; //subtract 1 from mm because .getMonth() starts at 0, January.
};

const dateDiffInDays = (a: Date, b: Date) => {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  // Discard the time and time-zone information.
  // const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  // const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  const utc1 = Date.UTC(new Date(a).getFullYear(), new Date(a).getMonth(), new Date (a).getDate());
  const utc2 = Date.UTC(new Date(b).getFullYear(), new Date(b).getMonth(), new Date(b).getDate());
  console.log(a, b)
  console.log(utc1, utc2);
  console.log(Math.abs(Math.floor((utc1 - utc2) / _MS_PER_DAY)))
  return Math.abs(Math.floor((utc1 - utc2) / _MS_PER_DAY));
};

const getTitleSort = (title: string) => {
  const titleWordsArr = title.toLowerCase().split(/\s+/);
  return titleWordsArr[0] === 'the' ? `${titleWordsArr.slice(1).join(' ')}, the` : titleWordsArr.join(' ');
};

export { sortByLastName, isValidDate, dateDiffInDays, getTitleSort }