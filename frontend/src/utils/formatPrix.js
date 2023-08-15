export const formatPrix = (number) => {
  return number.toLocaleString("en-US").replace(/,/g, " ");
};
