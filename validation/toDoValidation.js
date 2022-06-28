const Validator = require("validator");
const isEmpty = require("../validation/isEmpty");

const validationToDoInput = (data) => {
  let errors = {};

  //check content field
  if (isEmpty(data.content)) {
    errors.content = "Content filed can not be empty";
  } else if (!Validator.isLength(data.content, { min: 1, max: 300 })) {
    errors.content = "Content filed must be between 1 and 300 characters";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

module.exports = validationToDoInput;
