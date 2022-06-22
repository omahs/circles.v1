import { Box, IconBellSolid, Stack, Tag, Text } from "degen";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "../Modal";
import styled from "styled-components";
import ClickableTag from "./ClickableTag";
import { toast } from "react-toastify";

type Props = {
  name: string;
  modalTitle: string;
  children: React.ReactNode;
  label?: string;
  modalOpen: boolean;
  setModalOpen: (modalOpen: boolean) => void;
  icon?: React.ReactNode;
  tone?: string;
  disabled?: boolean;
};

// const TagContainer = styled(Box)`

function EditTag({
  name,
  modalTitle,
  children,
  label,
  modalOpen,
  icon,
  setModalOpen,
  tone = "accentSecondary",
  disabled = false,
}: Props) {
  return (
    <>
      <Stack direction="horizontal">
        {label && (
          <Box width="1/3">
            <Text variant="label">{label}</Text>
          </Box>
        )}
        <Box width={label ? "2/3" : "full"}>
          <ClickableTag
            name={name}
            tone={tone}
            icon={icon}
            onClick={() => {
              if (disabled) {
                toast.error("Cannot edit", { theme: "dark" });
                return;
              }
              setModalOpen(true);
            }}
          />
        </Box>
      </Stack>
      <AnimatePresence
        initial={false}
        exitBeforeEnter
        onExitComplete={() => null}
      >
        {modalOpen && (
          <Modal handleClose={() => setModalOpen(false)} title={modalTitle}>
            {children}
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}

export default EditTag;

export type { Props as EditTagProps };
