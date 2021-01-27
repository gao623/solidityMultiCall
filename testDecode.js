const SolidityMultiCall = require('./');

let ret = {
  blockNumber: '11645384',
  results: ['0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000a9a0b81912aa37344db4e183d7773245b0e93be9000000000000000000000000000000000000000000000000000000000000024000000000000000000000000000000000000000000000000000000000000002a0000000000000000000000000d77f328120959618fccc3fea3b9e0c9c0156021c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000500000000000000000000000000000000000000000000001043561a882930000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004b9599ede689c922f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000048db000000000000000000000000000000000000000000746573746e65745f3031390000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000017039f53810f1e5d00000000000000000000000000000000000000000000000001ac26e3813ad5aeb8cae00000000000000000000000000000000000000000000000000000000000000405336304a27619a77ab561110495013a73ee4de779f5aa6dcb4fdebc7340bc045712b3ae2c0d6178fe659519fc3681daf5df4973aeb81af125de35b130dd5277e0000000000000000000000000000000000000000000000000000000000000040d55ef5a1acb26b5340a66406e219c859baa7d30d3d2b10b50af2a3123e9a92c1baaa4965a85429bf2725e06b0c7292afb03c1330a2fca69fe7cb92c6cf223d5c'],
}

let typeAbi = [
  {
    "components": [
      {
        "name": "sender",
        "type": "address"
      },
      {
        "name": "enodeID",
        "type": "bytes"
      },
      {
        "name": "PK",
        "type": "bytes"
      },
      {
        "name": "wkAddr",
        "type": "address"
      },
      {
        "name": "isWhite",
        "type": "bool"
      },
      {
        "name": "quited",
        "type": "bool"
      },
      {
        "name": "delegatorCount",
        "type": "uint256"
      },
      {
        "name": "delegateDeposit",
        "type": "uint256"
      },
      {
        "name": "partnerCount",
        "type": "uint256"
      },
      {
        "name": "partnerDeposit",
        "type": "uint256"
      },
      {
        "name": "crossIncoming",
        "type": "uint256"
      },
      {
        "name": "slashedCount",
        "type": "uint256"
      },
      {
        "name": "incentivedDelegator",
        "type": "uint256"
      },
      {
        "name": "incentivedDay",
        "type": "uint256"
      },
      {
        "name": "groupId",
        "type": "bytes32"
      },
      {
        "name": "nextGroupId",
        "type": "bytes32"
      },
      {
        "name": "deposit",
        "type": "uint256"
      },
      {
        "name": "incentive",
        "type": "uint256"
      }
    ],
    "name": "si",
    "type": "tuple"
  }
];

let typeArray = [];
let s = {};
let b = typeAbi[0];
b.components.map(item => {var ret = {}; ret[item.name]=item.type;return ret}).forEach(json => s[b.name] = {...s[b.name], ...json})
typeArray.push([s]);

const multicall = new SolidityMultiCall("192.168.1.2", 8545);
try {
  for (let idx in ret.results) {
    let res = multicall.decodeParameters(typeArray[idx], ret.results[idx])
    let result = {};
    for (let i = 0; i < res.__length__; ++i) {
      let keys = Object.keys(res[i]);
      keys = keys.filter((key, index) => {
        return key !== index.toString();
      });

      if (keys.length) {
        keys.forEach((key) => {
          result[key] = res[i][key];
        })
      }
    }
    console.log("Result:", idx, result);

  }
} catch (err) {
  console.log("Error:", err);
}

// let outerResultsDecoded = [
//   [
//     "0x0000000000000000000000000000000000000000000000000000000000000000",
//     "0x000000000000000000000000000000000000000000000000f2f3e96b51679b73",
//   ],
// ];
// const multicall = new SolidityMultiCall("192.168.1.2", 8545);
// // multicall.decodeParameters(typeArray, ret.results[0])
// let parsedVals = outerResultsDecoded.reduce((acc, r) => {
//   console.log("=========acc", acc)
//   console.log("=========r", r)
//   r.forEach((results, idx) => {
//     const types = calls[idx].returnTypes;
//     let resultsDecoded = multicall.decodeParameters(types, results);
//     delete resultsDecoded.__length__;
//     resultsDecoded = Object.values(resultsDecoded);
//     console.log("==========resultsDecoded", idx, types, resultsDecoded);
//     acc.push(
//       ...resultsDecoded.map((r, idx) => {
//         if (types[idx] === 'bool') return r.toString() === 'true';
//         return r;
//       })
//     );
//   });
//   return acc;
// }, []);

// console.log("========parsedVals:", parsedVals)