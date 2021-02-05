const Web3 = require("web3");

function getClient(nodeUrl, options) {
  options = Object.assign({}, options);
  if (!nodeUrl) {
    throw new Error("invalid node url");
  }
  return new Web3(new Web3.providers.HttpProvider(nodeUrl));
}

module.exports = {
  getClient
};