const capitalizedFirstLetter = (value) => {
  const valueTrimmed = value.trim();
  return valueTrimmed[0].toUpperCase() + valueTrimmed.slice(1).toLowerCase();
};

module.exports = capitalizedFirstLetter;
