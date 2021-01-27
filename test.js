const SolidityMultiCall = require('./');

const myTestAddr = '0x4cf0a877e906dead748a41ae7da8c220e4247d9e';

const smgAdmin = `0xaA5A0f7F99FA841F410aafD97E8C435c75c22821`;
const wanBTC = `0x89a3e1494bc3db81dadc893ded7476d33d47dcbd`;
const wanETH = `0x48344649b9611a891987b2db33faada3ac1d05ec`;
const FNX = `0x974ab46969d3d9a4569546051a797729e301d6eb`;
const wanUSDT = `0x3d5950287b45f361774e5fb6e50d70eea06bc167`;
const wanUSDC = `0x7ff465746e4f47e1cbbb80c864cd7de9f13337fe`;

function testBalance() {
  const multicall = new SolidityMultiCall("192.168.1.2", 8545);
  const calls = [
    {
      target: wanBTC,
      call: ['balanceOf(address)', myTestAddr],
    },
    {
      target: wanETH,
      call: ['balanceOf(address)', myTestAddr],
    },
    {
      target: FNX,
      call: ['balanceOf(address)', myTestAddr],
    },
    {
      target: wanUSDT,
      call: ['balanceOf(address)', myTestAddr],
    },
    {
      target: wanUSDC,
      call: ['balanceOf(address)', myTestAddr],
    },
  ];

  multicall.aggregate(calls, "0x14095a721Dddb892D6350a777c75396D634A7d97").then((ret)=>{
    console.log("result", ret);
    let typeArrays = [["uint256"], ["uint256"], ["uint256"], ["uint256"], ["uint256"]];
    for (let idx in ret.results) {
      console.log("Result:", multicall.decodeParameters(typeArrays[idx], ret.results[idx]));
    }
  }).catch(err => console.log("Error:", err));
}

function testStoremanInfo() {
  const calls = [
    {
      target: smgAdmin,
      call: ['getStoremanInfo(address)((address,bytes,bytes,address,bool,bool,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,bytes32,bytes32,uint256,uint256)[])', "0xd77f328120959618fccc3fea3b9e0c9c0156021c"],
    },
    {
      target: wanETH,
      call: ['balanceOf(address)(uint256)', myTestAddr],
      returns: [['wanETH', val => val / 10 ** 18]]
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
}

function testStoremanGroupInfo() {
  const calls = [
    {
      target: smgAdmin,
      call: ['getStoremanGroupInfo(bytes32)', "0x000000000000000000000000000000000000000000746573746e65745f303139"],
    },
    {
      target: wanETH,
      call: ['balanceOf(address)', myTestAddr],
    },
  ];
  const smgInfoAbi = [
    {
      "components": [
        {
          "name": "groupId",
          "type": "bytes32"
        },
        {
          "name": "status",
          "type": "uint8"
        },
        {
          "name": "deposit",
          "type": "uint256"
        },
        {
          "name": "depositWeight",
          "type": "uint256"
        },
        {
          "name": "selectedCount",
          "type": "uint256"
        },
        {
          "name": "memberCount",
          "type": "uint256"
        },
        {
          "name": "whiteCount",
          "type": "uint256"
        },
        {
          "name": "whiteCountAll",
          "type": "uint256"
        },
        {
          "name": "startTime",
          "type": "uint256"
        },
        {
          "name": "endTime",
          "type": "uint256"
        },
        {
          "name": "registerTime",
          "type": "uint256"
        },
        {
          "name": "registerDuration",
          "type": "uint256"
        },
        {
          "name": "memberCountDesign",
          "type": "uint256"
        },
        {
          "name": "threshold",
          "type": "uint256"
        },
        {
          "name": "chain1",
          "type": "uint256"
        },
        {
          "name": "chain2",
          "type": "uint256"
        },
        {
          "name": "curve1",
          "type": "uint256"
        },
        {
          "name": "curve2",
          "type": "uint256"
        },
        {
          "name": "tickedCount",
          "type": "uint256"
        },
        {
          "name": "minStakeIn",
          "type": "uint256"
        },
        {
          "name": "minDelegateIn",
          "type": "uint256"
        },
        {
          "name": "minPartIn",
          "type": "uint256"
        },
        {
          "name": "crossIncoming",
          "type": "uint256"
        },
        {
          "name": "gpk1",
          "type": "bytes"
        },
        {
          "name": "gpk2",
          "type": "bytes"
        },
        {
          "name": "delegateFee",
          "type": "uint256"
        }
      ],
      "name": "info",
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
}

testBalance()
testStoremanInfo()
testStoremanGroupInfo()
