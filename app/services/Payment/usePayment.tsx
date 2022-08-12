import PrimaryButton from "@/app/common/components/PrimaryButton";
import { useGlobal } from "@/app/context/globalContext";
import { Stack } from "degen";
import Link from "next/link";
import { toast } from "react-toastify";
import { useAccount, useNetwork } from "wagmi";
import { gnosisPayment } from "../Gnosis";
import useDistributor from "./useDistributor";
import useERC20 from "./useERC20";

declare let window: any;

type BatchPayParams = {
  chainId: string;
  type: "tokens" | "currency";
  ethAddresses: string[];
  tokenValues: number[];
  tokenAddresses: string[];
  cardIds?: string[];
  epochId?: string;
};

type ExecuteBatchPayParams = {
  type: string;
  chainId: string;
  userAddresses: string[];
  amounts: number[];
  tokenAddresses: string[];
};

type PayUsingGnosisParams = {
  paymentType: string;
  batchPayType: "card" | "retro";
  chainId: string;
  userAddresses: string[];
  amounts: number[];
  tokenAddresses: string[];
  safeAddress: string;
  cardIds: string[];
  circleId: string;
};

export default function usePaymentGateway(
  handleStatusUpdate?: (status: any, txHash: string) => Promise<void>
) {
  const { distributeEther, distributeTokens } = useDistributor();
  const { hasBalances } = useERC20();
  const { data: account } = useAccount();
  const { activeChain, switchNetworkAsync } = useNetwork();
  const { connectedUser } = useGlobal();
  async function handlePaymentError(
    err: any,
    expectedNetwork: string,
    tokenAddresses: Array<string>,
    tokenValues: Array<number>
  ) {
    const accounts = await window.ethereum?.request({
      method: "eth_accounts",
    });
    if (accounts?.length === 0) {
      // notify(`Cannot fetch account, wallet is most likely locked`, 'error');
      return;
    }
    if (window.ethereum?.networkVersion !== expectedNetwork) console.log("hi");
    // notify(
    //   `Please switch to ${registry[expectedNetwork]?.name} network`,
    //   'error'
    // );
    else {
      const [sufficientBalance, insufficientBalanceTokenAddress] =
        await hasBalances(
          tokenAddresses,
          tokenValues,
          account?.address as string
        );
      console.log(sufficientBalance, insufficientBalanceTokenAddress);
      if (!sufficientBalance) {
        // notify(
        //   `Insufficient balance of ${
        //     registry[expectedNetwork].tokens[
        //       insufficientBalanceTokenAddress as string
        //     ].name
        //   }`,
        //   'error'
        // );
      } else {
        // notify(`${err.message}`, 'error');
      }
    }
  }

  async function executeBatchPay({
    type,
    chainId,
    tokenAddresses,
    userAddresses,
    amounts,
  }: ExecuteBatchPayParams) {
    let tx;
    if (type === "tokens") {
      console.log({ amounts });
      tx = await distributeTokens({
        contributors: userAddresses,
        values: amounts,
        chainId,
        tokenAddresses,
      });
    } else if (type === "currency") {
      tx = await distributeEther({
        contributors: userAddresses,
        values: amounts,
        chainId,
      });
    }
    return tx;
  }

  async function batchPay({
    type,
    chainId,
    ethAddresses,
    tokenValues,
    tokenAddresses,
    cardIds,
    epochId,
  }: BatchPayParams) {
    try {
      console.log({
        ethAddresses,
        tokenValues,
        tokenAddresses,
        cardIds,
        epochId,
      });
      if (activeChain?.id.toString() !== chainId) {
        switchNetworkAsync && (await switchNetworkAsync(parseInt(chainId)));
      }
      console.log({ ethAddresses, tokenValues, type, chainId });
      const tx = await executeBatchPay({
        type,
        chainId,
        tokenAddresses,
        userAddresses: ethAddresses,
        amounts: tokenValues,
      });
      if (handleStatusUpdate) {
        await handleStatusUpdate(epochId || cardIds, tx.transactionHash);
      }
      // notify('Payment done succesfully!', 'success');
      toast(
        <Stack direction="horizontal">
          Transaction Successful
          <PrimaryButton>
            <Link
              href={`https://mumbai.polygonscan.com/tx/${tx.transactionHash}`}
            >
              View Transaction
            </Link>
          </PrimaryButton>
        </Stack>,
        {
          theme: "dark",
        }
      );
      return tx.transactionHash;
    } catch (err: any) {
      void handlePaymentError(err, chainId, tokenAddresses, tokenValues);
      console.log(err);
      // toast.error(err.message, {
      //   theme: "dark",
      // });
      throw err.message;
      return false;
    }
  }

  async function payUsingGnosis({
    paymentType,
    batchPayType,
    chainId,
    amounts,
    userAddresses,
    tokenAddresses,
    safeAddress,
    cardIds,
    circleId,
  }: PayUsingGnosisParams) {
    console.log({ cardIds, safeAddress });
    if (paymentType === "tokens") {
      console.log({ amounts });
      const data = await distributeTokens({
        contributors: userAddresses,
        values: amounts,
        chainId,
        type: batchPayType,
        cardIds,
        circleId,
        gnosis: true,
        callerId: connectedUser,
        tokenAddresses,
      });
      const res = await gnosisPayment(safeAddress, data, chainId);
      if (res)
        toast.success("Transaction sent to your safe", { theme: "dark" });
      else toast.error("Error Occurred while sending your transation to safe");
    } else if (paymentType === "currency") {
      const contractdata = await distributeEther({
        contributors: userAddresses,
        values: amounts,
        chainId,
        type: batchPayType,
        cardIds,
        circleId,
        gnosis: true,
        callerId: connectedUser,
      });
      const res = await gnosisPayment(safeAddress, contractdata, chainId);
      if (res)
        toast.success("Transaction sent to your safe", { theme: "dark" });
      else toast.error("Error Occurred while sending your transation to safe");
    }
  }

  return {
    batchPay,
    payUsingGnosis,
  };
}
