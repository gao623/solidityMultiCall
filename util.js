const Web3 = require("web3");

function getClient(host, port, options) {
  options = Object.assign({}, options);
  if (!host) {
    throw new Error("invalid host");
  }
  let nodeUrl = `http://${host}`;
  if (port) {
    nodeUrl = `${nodeUrl}:${port}`;
  }
  return new Web3(new Web3.providers.HttpProvider(nodeUrl));
}

module.exports = {
  getClient
};