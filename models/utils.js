const capitalizedFirstLetter = (value) => {
  const valueTrimmed = value.trim();
  return valueTrimmed[0].toUpperCase() + valueTrimmed.slice(1).toLowerCase();
};

const defaultDate = () => {
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const formattedMonth = month < 10 ? `0${month}` : `${month}`;
  const year = currentDate.getFullYear();
  return `${year}-${formattedMonth}-${day}`;
};

module.exports = { capitalizedFirstLetter, defaultDate };
