import Editor from "@/app/common/components/Editor";
import Modal from "@/app/common/components/Modal";
import { SnippetsOutlined } from "@ant-design/icons";
import { Box, Button, Stack, Tag } from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useEffect } from "react";
import styled from "styled-components";
import EditableSubTask from "./EditableSubTask";
import CardAssignee from "./modals/CardAssignee";
import CardColumn from "./modals/CardColumn";
import CardDeadline from "./modals/CardDeadline";
import CardLabels from "./modals/CardLabels";
import CardType from "./modals/CardType";
import CardReward from "./modals/CardReward";
import ClickableTag from "@/app/common/components/EditTag/ClickableTag";
import CardPriority from "./modals/CardPriority";
import {
  LocalCardContext,
  useProviderLocalCard,
} from "./hooks/LocalCardContext";
import { ProjectType } from "@/app/types";
import CardReviewer from "./modals/CardReviewer";
import ConfirmModal from "@/app/common/components/Modal/ConfirmModal";

type Props = {
  column: string;
  setIsDirty: (isDirty: boolean) => void;
  showConfirm: boolean;
  setShowConfirm: (showConfirm: boolean) => void;
  handleClose: () => void;
  setIsOpen: (isOpen: boolean) => void;
};

const Container = styled(Box)`
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  height: 60vh;
  overflow-y: auto;
`;

const NameInput = styled.input`
  width: 100%;
  background: transparent;
  border: 0;
  border-style: none;
  border-color: transparent;
  outline: none;
  outline-offset: 0;
  box-shadow: none;
  font-size: 1.8rem;
  caret-color: rgb(191, 90, 242);
  color: rgb(191, 90, 242);
  font-weight: 600;
`;

export default function CreateCardModal({
  column,
  setIsDirty,
  showConfirm,
  setShowConfirm,
  handleClose,
  setIsOpen,
}: Props) {
  const closeModal = () => setIsOpen(false);
  const context = useProviderLocalCard({ handleClose: closeModal });
  const {
    setColumnId,
    onSubmit,
    title,
    setTitle,
    labels,
    subTasks,
    setSubTasks,
    description,
    setDescription,
    project,
  } = context;

  useEffect(() => {
    setColumnId(column);
  }, []);
  return (
    <LocalCardContext.Provider value={context}>
      <Modal size="large" title="Create Card" handleClose={handleClose}>
        <AnimatePresence>
          {showConfirm && (
            <ConfirmModal
              title="Are you sure you want to discard the changes?"
              handleClose={() => setShowConfirm(false)}
              onConfirm={() => {
                setIsDirty(false);
                setShowConfirm(false);
                handleClose();
              }}
              onCancel={() => setShowConfirm(false)}
            />
          )}
        </AnimatePresence>
        <Stack direction="horizontal">
          <Box width="2/3">
            <Container height="full" padding="8" width="full">
              <Stack direction="vertical">
                {/* <Heading>{task.title}</Heading> */}
                <NameInput
                  placeholder="Enter card name"
                  autoFocus
                  value={title}
                  onChange={(e) => {
                    setIsDirty(true);
                    setTitle(e.target.value);
                  }}
                />

                <Stack direction="horizontal" wrap>
                  <CardLabels />
                  {labels.map((label) => (
                    <Tag key={label}>{label}</Tag>
                  ))}
                </Stack>
                <Box width="fit">
                  <ClickableTag
                    name="Add Subtasks"
                    icon={
                      <SnippetsOutlined
                        style={{
                          fontSize: "1rem",
                          marginLeft: "0.2rem",
                          marginRight: "0.2rem",
                          color: "rgb(175, 82, 222, 1)",
                        }}
                      />
                    }
                    onClick={() =>
                      setSubTasks([...subTasks, { title: "", assignee: "" }])
                    }
                  />
                </Box>
                <AnimatePresence>
                  {subTasks?.map((subTask, index) => (
                    <EditableSubTask subTaskIndex={index} key={index} />
                  ))}
                </AnimatePresence>
                <Box style={{ minHeight: "10rem" }} marginTop="2">
                  <Editor
                    value={description}
                    onChange={(txt) => {
                      setDescription(txt);
                    }}
                  />
                </Box>
              </Stack>
            </Container>
          </Box>
          <Box width="1/3" borderLeftWidth="0.375" padding="8">
            {(project as ProjectType)?.id && (
              <Stack>
                <CardType />
                <CardColumn />
                <CardAssignee />
                <CardReviewer />
                <CardDeadline />
                <CardPriority />
                <CardReward />
              </Stack>
            )}
          </Box>
        </Stack>
        <Box borderTopWidth="0.375" paddingX="8" paddingY="4">
          <Stack direction="horizontal">
            <Button
              size="small"
              width="1/3"
              onClick={() => {
                onSubmit(false);
                setIsDirty(false);
              }}
              variant="secondary"
            >
              Create Card
            </Button>
            <Button
              size="small"
              width="1/3"
              onClick={() => {
                onSubmit(true);
                setIsDirty(false);
              }}
              variant="secondary"
            >
              Save and Create Again
            </Button>
          </Stack>
        </Box>
      </Modal>
    </LocalCardContext.Provider>
  );
}