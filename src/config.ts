export const RPC = {
  testnet: "https://sepolia.era.zksync.dev",
  mainnet: "https://mainnet.era.zksync.io",
};

export const PAYMASTER_ADDRESS = {
  testnet: "0xE151D85eA1Bc32Fb4863a484F590983F11bd688A",

  mainnet: "0x4081e092F948Cffd946a75e1F556c13c372304bc",
};

export const PAYMASTER_NFT_ADDRESS = {
  testnet: "0xD5b27C040Eb91516cd7467Aab337Ae0119cef52B",
  mainnet: "0x09004cd2B2397C1E1404FB2a364AB1147Bd08bcc",
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

export const DEFAULT_GAS_LIMIT = 1_500_000;
