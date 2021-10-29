const sortByLastName = (arr: string[]) => {
  return arr.sort((a, b) => {
    const lastNameA = a.split(' ').slice(-1)[0];
    const lastNameB = b.split(' ').slice(-1)[0];
    return lastNameA.localeCompare(lastNameB);
  })
};

export { sortByLastName }