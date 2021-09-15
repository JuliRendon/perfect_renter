const getUser = require('./getUser');
const recoverUserPass = require('./recoverUserPass');
const newUser = require('./newUser');
const loginUser = require('./loginUser');
const deleteUser = require('./deleteUser');

module.exports = {
  recoverUserPass,
  newUser,
  getUser,
  loginUser,
  deleteUser,
};
