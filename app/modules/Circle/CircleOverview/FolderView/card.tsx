import React, { memo, useCallback, useMemo, useState } from "react";
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from "react-beautiful-dnd";
import {
  Avatar,
  AvatarGroup,
  Box,
  IconEth,
  Stack,
  Tag,
  Text,
  useTheme,
} from "degen";
import styled from "styled-components";

const Container = styled(Box)<{ isDragging: boolean; mode: string }>`
  border-width: 2px;
  border-color: ${(props) =>
    props.isDragging
      ? "rgb(191, 90, 242, 1)"
      : props.mode === "dark"
      ? "rgb(255, 255, 255, 0.05)"
      : "rgb(20,20,20,0.05)"};
  };
  &:hover {
    border-color: ${(props) =>
      props.mode === "dark" ? "rgb(255, 255, 255, 0.1)" : "rgb(20,20,20,0.1)"};
  }
`;

const Card = ({card, index} : any) => {
  const { mode } = useTheme();

  const DraggableContent = (
    provided: DraggableProvided,
    snapshot: DraggableStateSnapshot
  ) => (
    <Container
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
      padding="4"
      marginBottom="2"
      borderRadius="large"
      isDragging={snapshot.isDragging}
      mode={mode}
    >
      {" "}
    </Container>
  );
  const DraggableContentCallback = useCallback(DraggableContent, []);

  return (
    <Draggable draggableId={card.id} index={index}>
      {DraggableContentCallback}
    </Draggable>
  );
};

export default memo(Card);