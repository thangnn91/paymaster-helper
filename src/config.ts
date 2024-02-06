export const RPC = {
  testnet: "https://zksync2-testnet.zksync.dev",
  mainnet: "https://mainnet.era.zksync.io",
};

export const PAYMASTER_ADDRESS = {
  testnet: "0xB92ba3fA75554dbC6425e28A3C345A3070C2d566",

  mainnet: "0x4081e092F948Cffd946a75e1F556c13c372304bc",
};

export const PAYMASTER_NFT_ADDRESS = {
  testnet: "0x09dF8c177002ceBb7C585C2eFf497BE0B779c630",

  mainnet: "0x0000000000000000000000000000000000000000",
};

export const PAYMASTER_CONTRACT_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_ethFee",
        type: "uint256",
      },
    ],
    name: "getTokenFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export const PAYMASTER_NFT_CONTRACT_ABI = [
  {
    inputs: [],
    name: "nftAsset",
    outputs: [
      {
        internalType: "contract INft",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
      {
        internalType: "uint8",
        name: "_nftType",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "_ethFee",
        type: "uint256",
      },
    ],
    name: "getTokenFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_ethFee",
        type: "uint256",
      },
    ],
    name: "getFullTokenFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export const NFT_ABI = [
  {
    inputs: [
      {
        internalType: "enum HoldstationNft.TokenType",
        name: "",
        type: "uint8",
      },
    ],
    name: "maxSponsorGas",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "getAllNfts",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "balance",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "uri",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "maxSponsor",
            type: "uint256",
          },
        ],
        internalType: "struct HoldstationNft.UserNfts[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export const ERC20_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
