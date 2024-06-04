export const RPC = {
  testnet: "https://sepolia.era.zksync.dev",
  mainnet: "https://mainnet.era.zksync.io",
};

//Use for internal
export const INTERNAL_PAYMASTER_ADDRESS = {
  testnet: "0xE151D85eA1Bc32Fb4863a484F590983F11bd688A",

  mainnet: "0x4081e092F948Cffd946a75e1F556c13c372304bc",
};

//Use for partners
export const PAYMASTER_ADDRESS = {
  testnet: "0xd24aEB2FF210510827Ef1F43FA898469C17a7E65",

  mainnet: "0x069246dFEcb95A6409180b52C071003537B23c27",
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
