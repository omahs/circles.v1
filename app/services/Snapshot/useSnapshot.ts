import snapshot from "@snapshot-labs/snapshot.js";
import { ethers } from "ethers";
import { useLocalCollection } from "@/app/modules/Collection/Context/LocalCollectionContext";

interface createProposalDto {
  title: string;
  body: string;
  start: number;
  end: number;
  block?: number;
}

export default function useSnapshot() {
  const { localCollection: collection, updateCollection } =
    useLocalCollection();

  const hub = "https://testnet.snapshot.org";
  const client = new snapshot.Client712(hub);

  const space = collection?.voting?.snapshot?.id || "";

  async function createProposal({
    title,
    body,
    start,
    end,
    block,
  }: createProposalDto) {
    const window: any = globalThis;
    const provider = new ethers.providers.Web3Provider(window?.ethereum);
    const signer = provider.getSigner();
    const account = await signer.getAddress();
    const blockNumber = await provider.getBlockNumber();

    const receipt = await client.proposal(provider, account, {
      space,
      type: "single-choice",
      title: title,
      body: body,
      choices: collection?.voting?.options?.map((option) => option.label),
      start: start || Math.floor(new Date().getTime() / 1000),
      end: end || Math.floor((new Date().getTime() + 7200000) / 1000),
      snapshot: block || blockNumber - 1,
      network: "5",
      plugins: JSON.stringify({}),
      app: "Spect",
    } as any);

    console.log(receipt);
    return receipt;
  }

  async function castVote(proposal: string, choice: number) {
    const window: any = globalThis;
    const provider = new ethers.providers.Web3Provider(window?.ethereum);
    const signer = provider.getSigner();
    const account = await signer.getAddress();
    const receipt = await client.vote(provider, account, {
      space,
      proposal: proposal,
      type: "single-choice",
      choice: choice,
      app: "Spect",
    });

    console.log(receipt);
    return receipt;
  }

  async function calculateScores(voters: string[], blockNumber: number) {
    const strategies = [
      {
        name: "erc20-balance-of",
        params: {
          address: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
          symbol: "LINK",
          decimals: 18,
        },
      },
    ] as any;
    const network = "5";

    snapshot.utils
      .getScores(space, strategies, network, voters, blockNumber)
      .then((scores) => {
        console.log("Scores", scores);
        return scores;
      });
  }

  return { createProposal, castVote, calculateScores };
}
