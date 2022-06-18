import EditTag from "@/app/common/components/EditTag";
import ModalOption from "@/app/common/components/ModalOption";
import { Box, IconSearch, Input, Text } from "degen";
import React, { useState } from "react";
import { useLocalProject } from "../../Context/LocalProjectContext";
import { useCreateCard } from "../hooks/createCardContext";
import { getOptions } from "../utils";

export default function CardType() {
  const { cardType, setCardType } = useCreateCard();
  const [modalOpen, setModalOpen] = useState(false);

  const { localProject: project } = useLocalProject();
  return (
    <EditTag
      name={cardType}
      modalTitle="Select Card Type"
      tagLabel="Change"
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
    >
      <Box height="96">
        <Box borderBottomWidth="0.375" paddingX="8" paddingY="5">
          <Input
            hideLabel
            label=""
            placeholder="Search"
            prefix={<IconSearch />}
          />
        </Box>
        <Box>
          {getOptions("card", project).map((item: any) => (
            <ModalOption
              key={item.value}
              isSelected={cardType === item.value}
              item={item}
              onClick={() => {
                setCardType(item.value);
                setModalOpen(false);
              }}
            >
              <Box style={{ width: "15%" }}>
                <item.icon
                  color={cardType === item.value ? "accent" : "textSecondary"}
                />
              </Box>
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "25%",
                }}
              >
                <Text
                  size="small"
                  color={cardType === item.value ? "accent" : "text"}
                  weight="bold"
                >
                  {item.name}
                </Text>
              </Box>
              <Box style={{ width: "65%" }}>
                <Text size="label" color="textSecondary">
                  {item.secondary}
                </Text>
              </Box>
            </ModalOption>
          ))}
        </Box>
      </Box>
    </EditTag>
  );
}
