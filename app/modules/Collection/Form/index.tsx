import { reorder } from "@/app/common/utils/utils";
import { updateField, updateFormCollection } from "@/app/services/Collection";
import { Box } from "degen";
import { useCallback, useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  DroppableProvided,
  DropResult,
} from "react-beautiful-dnd";
import { toast } from "react-toastify";
import styled from "styled-components";
import { SkeletonLoader } from "../../Explore/SkeletonLoader";
import { useLocalCollection } from "../Context/LocalCollectionContext";
import FormBuilder from "./FormBuilder";
import InactiveFieldsColumnComponent from "./InactiveFieldsColumn";

export function Form() {
  const {
    localCollection: collection,
    loading,
    updateCollection,
  } = useLocalCollection();

  const [propertyOrder, setPropertyOrder] = useState(collection.propertyOrder);

  useEffect(() => {
    setPropertyOrder(collection.propertyOrder);
  }, [collection]);

  const handleDragCollectionProperty = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination?.droppableId === source.droppableId &&
      destination?.index === source.index
    ) {
      return;
    }

    if (destination?.droppableId === "activeFields") {
      const newPropertyOrder = reorder(
        propertyOrder,
        source.index,
        destination.index
      );
      setPropertyOrder(newPropertyOrder);
      if (
        collection.properties[draggableId].isPartOfFormView === false ||
        !collection.properties[draggableId].isPartOfFormView
      ) {
        updateCollection({
          ...collection,
          properties: {
            ...collection.properties,
            [draggableId]: {
              ...collection.properties[draggableId],
              isPartOfFormView: true,
            },
          },
        });
        const res = await updateField(collection.id, draggableId, {
          isPartOfFormView: true,
        });
        if (res.id) updateCollection(res);
        else toast.error(`Request failed with error ${res.message}`);
      } else {
        updateCollection({
          ...collection,
          propertyOrder: newPropertyOrder,
        });
        const res = await updateFormCollection(collection.id, {
          propertyOrder: newPropertyOrder,
        });
        if (res.id) updateCollection(res);
        else toast.error(`Request failed with error ${res.message}`);
      }
    } else if (destination?.droppableId === "inactiveFields") {
      // setPropertyOrder(reorder(propertyOrder, source.index, destination.index));
      if (collection.properties[draggableId].isPartOfFormView === true) {
        updateCollection({
          ...collection,
          properties: {
            ...collection.properties,
            [draggableId]: {
              ...collection.properties[draggableId],
              isPartOfFormView: false,
            },
          },
        });
        const res = await updateField(collection.id, draggableId, {
          isPartOfFormView: false,
        });
        if (res.id) updateCollection(res);
        else toast.error(`Request failed with error ${res.message}`);
      }
    }
  };

  const DroppableContent = (provided: DroppableProvided) => {
    return (
      <Box {...provided.droppableProps} ref={provided.innerRef}>
        <ScrollContainer>
          <FormContainer>
            <FormBuilder fields={propertyOrder} />
          </FormContainer>
          <InactiveFieldsColumnComponent fields={propertyOrder} />
        </ScrollContainer>
      </Box>
    );
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const DroppableContentCallback = useCallback(DroppableContent, [
    propertyOrder,
  ]);

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <DragDropContext onDragEnd={handleDragCollectionProperty}>
      <Droppable droppableId="all-fields" direction="horizontal" type="fields">
        {DroppableContentCallback}
      </Droppable>
    </DragDropContext>
  );
}

const ScrollContainer = styled(Box)`
  overflow-y: auto;
  ::-webkit-scrollbar {
    width: 5px;
  }
  display: flex;

  @media (max-width: 992px) {
    flex-direction: column;
    padding: 0.5rem;
    margin-top: 0rem;
    height: calc(100vh - 4rem);
  }
  flex-direction: row;
  padding: 1.5rem;
  margin-top: 1rem;
  height: calc(100vh - 7rem);
`;

const FormContainer = styled(Box)`
  @media (max-width: 992px) {
    width: 100%;
  }
  width: 80%;
`;
