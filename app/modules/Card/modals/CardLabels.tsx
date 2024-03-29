import EditTag from "@/app/common/components/EditTag";
import { TagOutlined } from "@ant-design/icons";
import { Box, IconSearch, Input, Stack, Tag, Text } from "degen";
import React, { memo, useEffect, useState } from "react";
import { matchSorter } from "match-sorter";
import { useLocalCard } from "../../Project/CreateCardModal/hooks/LocalCardContext";
import { Option } from "../../Project/CreateCardModal/constants";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import useModalOptions from "@/app/services/ModalOptions/useModalOptions";
import AddLabel from "./AddLabel";
import { useCircle } from "../../Circle/CircleContext";

function CardLabels() {
  const { labels, setLabels, onCardUpdate, card } = useLocalCard();
  const [modalOpen, setModalOpen] = useState(false);

  const [options, setOptions] = useState<Option[]>();
  const [filteredOptions, setFilteredOptions] = useState<Option[]>();

  const { canTakeAction } = useRoleGate();
  const { getOptions } = useModalOptions();

  const { circle } = useCircle();

  useEffect(() => {
    const ops = getOptions("labels") as Option[];
    setOptions(ops);
    setFilteredOptions(ops);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [circle?.labels]);

  return (
    <EditTag
      tourId="create-card-modal-labels"
      name="Add Labels"
      modalTitle="Add Labels"
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      icon={
        <TagOutlined
          style={{
            fontSize: "1rem",
            marginLeft: "0.2rem",
            marginRight: "0.2rem",
            color: "rgb(191, 90, 242, 1)",
          }}
        />
      }
      disabled={!canTakeAction("cardLabels")}
      handleClose={() => {
        if (card?.labels !== labels) {
          void onCardUpdate();
        }
        setModalOpen(false);
      }}
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
          <Stack direction="horizontal" wrap align="center">
            <AddLabel />
            {filteredOptions?.map((item: any) => (
              <Box
                key={item.value}
                cursor="pointer"
                onClick={() => {
                  if (labels.includes(item.value)) {
                    setLabels(labels.filter((label) => label !== item.value));
                  } else {
                    setLabels([...labels, item.value]);
                  }
                }}
              >
                <Tag
                  hover
                  tone={labels.includes(item.value) ? "accent" : "secondary"}
                >
                  <Stack direction="horizontal" space="1" align="center">
                    {/* {labels.includes(item.value) && <IconCheck size="4" />} */}
                    {item.name}
                  </Stack>
                </Tag>
              </Box>
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

export default memo(CardLabels);
