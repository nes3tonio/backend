const { format } = require("date-fns");

function formatDate(date) {
  return format(date, "yyyy-MM-dd HH:mm:ss");
}

async function validate(schema, data) {
  try {
      await schema.validateAsync(data);
  } catch (error) {
      error.httpStatus = 400;
      throw error;
  }
}

module.exports = {
  formatDate,
  validate,
};
