import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Box, Input, Stack, Tag, Text } from "degen";
import React, { useState } from "react";
import useERC20 from "@/app/services/Payment/useERC20";
import { Chain, Option, Registry } from "@/app/types";
import { AnimatePresence } from "framer-motion";
import { addToken } from "@/app/services/Payment";
import Loader from "@/app/common/components/Loader";
import { useCircle } from "../../CircleContext";
import Dropdown from "@/app/common/components/Dropdown";

interface Props {
  chain: Chain | undefined;
}

export default function AddToken({ chain }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [network, setNetwork] = useState({
    label: chain?.name,
    value: chain?.chainId,
  });
  const [address, setAddress] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenLoading, setTokenLoading] = useState(false);
  const { symbol, name } = useERC20();
  const { circle, setRegistryData, registry } = useCircle();

  const options = Object.values(registry as Registry)?.map((r) => ({
    label: r.name,
    value: r.chainId,
  }));
  return (
    <>
      <Box cursor="pointer" onClick={() => setIsOpen(true)}>
        <Tag hover label="Add">
          <Stack direction="horizontal" align="center" space="1">
            <Text>Custom Token</Text>
          </Stack>
        </Tag>
      </Box>
      <AnimatePresence>
        {isOpen && (
          <Modal handleClose={() => setIsOpen(false)} title="Add Token">
            <Box padding="8">
              {tokenLoading && <Loader loading text="Fetching" />}
              <Stack>
                <Dropdown
                  multiple={false}
                  options={options}
                  selected={network as Option}
                  onChange={(option) => {
                    setNetwork(option);
                  }}
                  portal={false}
                  isClearable={false}
                />
                <Input
                  label=""
                  placeholder="Token Address"
                  value={address}
                  onChange={async (e) => {
                    setAddress(e.target.value);
                    setTokenLoading(true);
                    console.log({ chain });
                    try {
                      console.log(await symbol(e.target.value, network?.value));
                      setTokenSymbol(
                        await symbol(e.target.value, network?.value)
                      );
                      setTokenName(await name(e.target.value, network?.value));
                    } catch (e) {
                      console.log(e);
                      setTokenLoading(false);
                    }
                    setTokenLoading(false);
                  }}
                />
                <Text weight="semiBold">{tokenSymbol}</Text>
                <Text weight="semiBold">{tokenName}</Text>
                <PrimaryButton
                  loading={loading}
                  disabled={!tokenSymbol}
                  onClick={async () => {
                    setLoading(true);
                    const res = await addToken(circle?.id, {
                      chainId: network.value as string,
                      address,
                      symbol: tokenSymbol,
                      name: tokenName,
                    });
                    console.log({ res });
                    setLoading(false);
                    setRegistryData(res as Registry);
                    res && setIsOpen(false);
                  }}
                >
                  Add
                </PrimaryButton>
              </Stack>
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
