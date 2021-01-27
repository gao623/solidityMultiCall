const util = require("./util");

const defaultAbi = [
  {
    components: [{ type: 'address' }, { type: 'bytes' }],
    name: 'data',
    type: 'tuple[]'
  }
];

const INSIDE_EVERY_PARENTHESES = /\(.*?\)/g;
const FIRST_CLOSING_PARENTHESES = /^[^)]*\)/;

class SolidityMultiCall {
  constructor(host, port, options) {
    options = Object.assign({}, {abi: defaultAbi}, options);
    this.client = util.getClient(host, port);
    // this.scAddr = scAddr;
    this.abi = options.abi;
  }

  encodeParameter(type, val) {
    return this.client.eth.abi.encodeParameters([type], [val]);
  }

  encodeParameters(types, vals) {
    return this.client.eth.abi.encodeParameters(types, vals);
  }

  decodeParameter(type, val) {
    return this.client.eth.abi.decodeParameters([type], val);
  }

  decodeParameters(types, vals) {
    // return this.client.eth.abi.decodeParameters(types, '0x' + vals.replace(/0x/i, ''));
    return this.client.eth.abi.decodeParameters(types, vals);
  }
  static strip0x(str) {
    return str.replace(/^0x/, '');
  }

  makeMulticallData(calls) {
    // console.log("======makeMulticallData before:", JSON.stringify(calls));
    const values = [
      calls.map(({ target, method, args}) => [
        target,
        this.client.eth.abi.encodeFunctionSignature(method).substr(0, 10) +
          (args && args.length > 0
            ? SolidityMultiCall.strip0x(this.encodeParameters(args.map(a => a[1]), args.map(a => a[0])))
            : '')
      ])
    ];
    // console.log("==========makeMulticallData values:", values)
    const calldata = this.encodeParameters(
      // this.abi,
      [
        {
          components: [{ type: 'address' }, { type: 'bytes' }],
          name: 'calls',
          type: 'tuple[]'
        }
      ],
      values
    );
    // console.log("==========makeMulticallData calldata:", calldata)
    return calldata;
  }

  ethCall(scAddr, rawData) {
    // Function signature for: aggregate((address,bytes)[])
    // const AGGREGATE_SELECTOR = '0x252dba42';
    const AGGREGATE_SELECTOR = this.client.eth.abi.encodeFunctionSignature('aggregate((address,bytes)[])');
    const abiEncodedData = AGGREGATE_SELECTOR + SolidityMultiCall.strip0x(rawData);
    // console.log("========ethCall abiEncodedData:", abiEncodedData);
    return this.client.eth.call({
      to: scAddr,
      data: abiEncodedData
    });

  }

  async aggregate(calls, scAddr) {
    calls = Array.isArray(calls) ? calls : [calls];

    calls = calls.map(({ call, target }) => {
      if (!target) target = scAddr;
      const [method, ...argValues] = call;
      const [argTypesString] = method
        .match(INSIDE_EVERY_PARENTHESES)
        .map(match => match.slice(1, -1));
      const argTypes = argTypesString.split(',').filter(e => !!e);
      if (argTypes.length !== argValues.length) {
        throw new Error(`Every method argument must have exactly one type.
        Comparing argument types ${JSON.stringify(argTypes)}
        to argument values ${JSON.stringify(argValues)}.
      `);
      }
      const args = argValues.map((argValue, idx) => [argValue, argTypes[idx]]);
      return {
        method: method.match(FIRST_CLOSING_PARENTHESES)[0],
        args,
        target
      };
    });
    // console.log("========calls:", calls);

    const callDataBytes = this.makeMulticallData(calls);
    const outerResults = await this.ethCall(scAddr, callDataBytes);
    // console.log("========ethCall:", !!outerResults, outerResults.length, outerResults);

    const outerResultsDecoded = this.decodeParameters(['uint256', 'bytes[]'], outerResults);
    // console.log("======outerResultsDecoded:", outerResultsDecoded);
    const blockNumber = outerResultsDecoded[0];
    const results = outerResultsDecoded[1];
    if (results.length !== calls.length) {
      throw new Error(`The parameter calls member count must be equal to the multicall results member count`);
    }
    return {blockNumber:blockNumber, results: results}
  }

}
module.exports = SolidityMultiCall;