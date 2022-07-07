import PrimaryButton from "@/app/common/components/PrimaryButton";
import { addColumn } from "@/app/services/Column";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { Box, IconPlusSmall, Stack } from "degen";
import React, { memo, useCallback } from "react";
import {
  DragDropContext,
  Droppable,
  DroppableProvided,
} from "react-beautiful-dnd";
import { toast } from "react-toastify";
import styled from "styled-components";
import { useLocalProject } from "../Context/LocalProjectContext";
import useDragEnd from "../Hooks/useDragEnd";
import ColumnComponent from "../Column";
import { SkeletonLoader } from "../SkeletonLoader";
import BatchPay from "../BatchPay";
import { AnimatePresence } from "framer-motion";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: calc(100vh - 4.5rem);
  @media only screen and (min-width: 0px) {
    max-width: calc(100vw - 5rem);
    padding: 0 0.1rem;
  }
  @media only screen and (min-width: 768px) {
    max-width: calc(100vw - 4rem);
    padding: 0 0.5rem;
  }
  overflow-x: auto;
  overflow-y: hidden;
`;

function BoardView() {
  const { handleDragEnd } = useDragEnd();
  const {
    localProject: project,
    setLocalProject,
    loading,
    batchPayModalOpen,
    selectedCard,
    setBatchPayModalOpen,
  } = useLocalProject();
  const { canDo } = useRoleGate();

  const DroppableContent = (provided: DroppableProvided) => (
    <Container {...provided.droppableProps} ref={provided.innerRef}>
      <Stack direction="horizontal">
        {project?.columnOrder?.map((columnId, index): any => {
          const column = project.columnDetails[columnId];
          const cards = column.cards?.map(
            (cardId: any) => project.cards[cardId]
          );
          return (
            <ColumnComponent
              key={columnId}
              column={column}
              cards={cards}
              id={columnId}
              index={index}
            />
          );
        })}
        {provided.placeholder}
        {project?.id && canDo(["steward"]) && (
          <Box style={{ width: "20rem" }} marginTop="2">
            <PrimaryButton
              variant="tertiary"
              icon={<IconPlusSmall />}
              onClick={async () => {
                const updatedProject = await addColumn(project.id);
                if (!updatedProject) {
                  toast.error("Error adding column", {
                    theme: "dark",
                  });
                }
                setLocalProject(updatedProject);
              }}
            >
              Add new column
            </PrimaryButton>
          </Box>
        )}
      </Stack>
    </Container>
  );

  const DroppableContentCallback = useCallback(DroppableContent, [
    project.columnDetails,
    project?.columnOrder,
    project,
  ]);

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <>
      <AnimatePresence>
        {batchPayModalOpen && selectedCard && (
          <BatchPay card={selectedCard} setIsOpen={setBatchPayModalOpen} />
        )}
      </AnimatePresence>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable
          droppableId="all-columns"
          direction="horizontal"
          type="column"
        >
          {DroppableContentCallback}
        </Droppable>
      </DragDropContext>
    </>
  );
}

export default memo(BoardView);