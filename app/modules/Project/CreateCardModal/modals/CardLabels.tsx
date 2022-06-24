import EditTag from "@/app/common/components/EditTag";
import { ProjectType } from "@/app/types";
import { TagOutlined } from "@ant-design/icons";
import { Box, IconCheck, IconSearch, Input, Stack, Tag, Text } from "degen";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { matchSorter } from "match-sorter";
import { useLocalCard } from "../hooks/LocalCardContext";
import { Option } from "../constants";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import useModalOptions from "@/app/services/ModalOptions/useModalOptions";

export default function CardLabels() {
  const { labels, setLabels, setIsDirty } = useLocalCard();
  const [modalOpen, setModalOpen] = useState(false);

  const [options, setOptions] = useState<Option[]>();
  const [filteredOptions, setFilteredOptions] = useState<Option[]>();

  const { canTakeAction } = useRoleGate();
  const { getOptions } = useModalOptions();

  useEffect(() => {
    const ops = getOptions("labels") as Option[];
    setOptions(ops);
    setFilteredOptions(ops);
  }, []);

  return (
    <EditTag
      name="Add Tags"
      modalTitle="Select Card Type"
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      icon={
        <TagOutlined
          style={{
            fontSize: "1rem",
            marginLeft: "0.2rem",
            marginRight: "0.2rem",
            color: "rgb(175, 82, 222, 1)",
          }}
        />
      }
      disabled={!canTakeAction("cardLabels")}
    >
      <Box>
        <Box borderBottomWidth="0.375" paddingX="8" paddingY="5">
          <Input
            hideLabel
            label=""
            placeholder="Search"
            prefix={<IconSearch />}
            onChange={(e) => {
              setFilteredOptions(
                matchSorter(options as Option[], e.target.value, {
                  keys: ["name"],
                })
              );
            }}
          />
        </Box>
        <Box padding="8">
          <Stack direction="horizontal" wrap>
            {filteredOptions?.map((item: any) => (
              <motion.button
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "0rem",
                }}
                key={item.value}
                onClick={() => {
                  if (labels.includes(item.value)) {
                    setLabels(labels.filter((label) => label !== item.value));
                  } else {
                    setLabels([...labels, item.value]);
                  }
                  setIsDirty(true);
                }}
              >
                <Tag
                  hover
                  tone={labels.includes(item.value) ? "accent" : "secondary"}
                >
                  <Box display="flex">
                    {labels.includes(item.value) && <IconCheck />}
                    {item.name}
                  </Box>
                </Tag>
              </motion.button>
            ))}
            {!filteredOptions?.length && (
              <Text variant="label">No Labels found</Text>
            )}
          </Stack>
        </Box>
      </Box>
    </EditTag>
  );
}