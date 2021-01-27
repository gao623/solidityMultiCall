# solidityMultiCall

## Description
This is <code>JavaScript</code> sdk only used for solidity contract to access multicall contract to reduce interaction with ethereum, wanchain and so on.
<p>Example:

```bash
  const SolidityMultiCall = require('SolidityMultiCall');
  const FNX = `0x974ab46969d3d9a4569546051a797729e301d6eb`;
  const calls = [
    {
      target: smgAdmin,
      call: ['getStoremanInfo(address)', "0xd77f328120959618fccc3fea3b9e0c9c0156021c"],
    },
    {
      target: FNX,
      call: ['balanceOf(address)', myTestAddr]
    },
  ]
  const smgInfoAbi = [
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
  let smgTypeArray = [];
  let s = {};
  let b = smgInfoAbi[0];
  b.components.map(item => {var ret = {}; ret[item.name]=item.type;return ret}).forEach(json => s[b.name] = {...s[b.name], ...json})
  smgTypeArray.push(s);

  let balanceTypesArray = ['uint256'];

  const returnTypes = [];
  returnTypes.push(smgTypeArray);
  returnTypes.push(balanceTypesArray);

  const multicall = new SolidityMultiCall("192.168.1.2", 8545);
  multicall.aggregate(calls, "0x14095a721Dddb892D6350a777c75396D634A7d97").then((ret)=>{
    console.log("result", ret);
    for (let idx in ret.results) {
      let res = multicall.decodeParameters(returnTypes[idx], ret.results[idx])
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
        } else {
          result = res[i];
        }
      }
      console.log("Result:", idx, result);
      // console.log("Result:", multicall.decodeParameters(returnTypes[idx], ret.results[idx]));
    }
  }).catch(err => console.log("Error:", err));
```
