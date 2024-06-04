import * as chai from "chai";
import { Contract, ethers, BigNumber } from "ethers";
import { RPC, Partner } from "../src/index";
const { expect } = chai;

import { L2VoidSigner, Provider, Wallet } from "zksync-ethers";
import { ERC20_ABI } from "./erc20-abi";
import { parseEther } from "ethers/lib/utils";
import * as dotenv from "dotenv";
dotenv.config({ path: process.cwd() + "/.env" });

describe("Paymaster", () => {
  const PRIVATE_KEY = process.env.PRIVATE_KEY!;
  const mockErc20 = "0x5e52023FcE53c1e0C433847147617a795ae2842C";
  const paymasterTestnet = "0xd24aEB2FF210510827Ef1F43FA898469C17a7E65";
  const paymentToken = "0x01af5C55dd98842556f5d22e03FC7dcE2aC04c94";
  const provider = new Provider(RPC["testnet"]);
  const wallet = new Wallet(PRIVATE_KEY, provider);
  describe("#Partner", () => {
    it("use ERC20 token to pay transaction fee by wallet", async () => {
      const INIT_MINT_AMOUNT = parseEther("1");
      const erc20 = new Contract(mockErc20, ERC20_ABI);
      const populateTx = await erc20.populateTransaction.mint(
        await wallet.getAddress(),
        INIT_MINT_AMOUNT
      );
      const projectName = "TEST";
      const partnerCode = ethers.utils.formatBytes32String(projectName);
      const receipt = await (
        await Partner.paymasterExecute({
          network: "testnet",
          populateTransaction: populateTx,
          signer: wallet,
          paymentToken,
          innerInput: partnerCode,
        })
      ).wait();
      expect(BigNumber.from(receipt.status).eq(1)).to.be.true;
      const paymasterLogs = receipt.logs.filter(
        (o) => o.address.toLowerCase() == paymasterTestnet.toLowerCase()
      );
      expect(paymasterLogs).not.to.be.empty;
    });

    it("use ERC20 token to pay transaction fee by private key", async () => {
      const INIT_MINT_AMOUNT = parseEther("1");
      const erc20 = new Contract(mockErc20, ERC20_ABI);
      const populateTx = await erc20.populateTransaction.mint(
        await wallet.getAddress(),
        INIT_MINT_AMOUNT
      );
      const projectName = "TEST";
      const partnerCode = ethers.utils.formatBytes32String(projectName);
      const receipt = await (
        await Partner.paymasterExecute({
          network: "testnet",
          populateTransaction: populateTx,
          signer: PRIVATE_KEY,
          paymentToken,
          innerInput: partnerCode,
        })
      ).wait();

      expect(BigNumber.from(receipt.status).eq(1)).to.be.true;
      const paymasterLogs = receipt.logs.filter(
        (o) => o.address.toLowerCase() == paymasterTestnet.toLowerCase()
      );
      expect(paymasterLogs).not.to.be.empty;
    });
  });
});
