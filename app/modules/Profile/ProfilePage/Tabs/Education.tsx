import { memo, useState, useEffect } from "react";
import { Box, Text, Tag, Avatar, useTheme, Stack } from "degen";
import { UserType, CardDetails, LensEducation } from "@/app/types";
import { PriorityIcon } from "@/app/common/components/PriorityIcon";
import styled from "styled-components";
import ReactPaginate from "react-paginate";
import { ScrollContainer, Card, TextBox, GigInfo, Tags } from "./index";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import AddEducationModal from "../AddEducationModal";
import router from "next/router";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import useProfileUpdate from "@/app/services/Profile/useProfileUpdate";

const Paginate = styled(ReactPaginate)<{ mode: string }>`
  display: flex;
  flex-direction: row;
  width: 30rem;
  margin: 1rem auto;
  justify-content: space-between;
  list-style-type: none;
  li a {
    border-radius: 7px;
    padding: 0.1rem 0.5rem;
    border: ${(props) =>
        props.mode === "dark"
          ? "rgb(255, 255, 255, 0.02)"
          : "rgb(20, 20, 20, 0.2)"}
      1px solid;
    cursor: pointer;
    color: ${({ mode }) =>
      mode === "dark" ? "rgba(255, 255, 255, 0.5)" : "rgba(20, 20, 20, 0.5)"};
  }
  li.selected a {
    color: rgb(191, 90, 242, 1);
    border-color: rgb(191, 90, 242, 0.2);
  }
  li.previous a,
  li.next a,
  li.break a {
    border-color: transparent;
  }
  li.active a {
    border-color: transparent;
    color: rgb(191, 90, 242, 1);
    min-width: 32px;
  }
  li.disabled a {
    color: grey;
  }
  li.disable,
  li.disabled a {
    cursor: default;
  }
`;

const Education = ({ userData }: { userData: UserType }) => {
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [endOffset, setEndOffset] = useState(0);
  const [addEducation, setAddEducation] = useState(false);
  const [editEducation, setEditEducation] = useState(false);
  const [editEducationId, setEditEducationId] = useState<number>();
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const { removeEducation } = useProfileUpdate();
  const username = router.query.user;
  const { mode } = useTheme();

  const education = userData.education;

  const dateExists = (date: LensDate) => {
    return date.day && date.month && date.year;
  };

  useEffect(() => {
    setEndOffset(itemOffset + 5);
    if (userData.education?.length < 6) {
      setPageCount(Math.floor(userData.education?.length / 5));
    } else {
      setPageCount(Math.ceil(userData.education?.length / 5));
    }
  }, [education?.length, endOffset, itemOffset]);

  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * 5) % education?.length;
    setItemOffset(newOffset);
  };

  return (
    <Box>
      {addEducation && (
        <AddEducationModal
          modalMode="create"
          handleClose={() => setAddEducation(false)}
        />
      )}
      <ScrollContainer>
        {!education?.length && (
          <Box style={{ margin: "35vh 15vw" }}>
            <Text color="accent" align="center">
              You havent added your education yet :/
            </Text>
            <Box marginTop="4">
              <PrimaryButton
                variant="tertiary"
                onClick={() => setAddEducation(true)}
              >
                Add Education
              </PrimaryButton>
            </Box>
          </Box>
        )}
        {education?.length > 0 && (
          <>
            <Box width="48" marginTop="4">
              <PrimaryButton onClick={() => setAddEducation(true)}>
                Add Education
              </PrimaryButton>
            </Box>
            {education
              ?.slice(0)
              .slice(itemOffset, endOffset)
              .map((edu: LensEducation, index) => {
                return (
                  <Card mode={mode} key={index}>
                    <Box display="flex" flexDirection="row" gap="4">
                      <Box
                        display="flex"
                        flexDirection="column"
                        width="128"
                        marginBottom="4"
                      >
                        <Text variant="extraLarge" weight="semiBold">
                          {edu.courseDegree}
                        </Text>

                        {dateExists(edu.start_date) &&
                          dateExists(edu.end_date) &&
                          !edu.currentlyStudying && (
                            <Text variant="label" weight="light">
                              {`${edu.start_date.month}/${edu.start_date.day}/${edu.start_date.year} - ${edu.end_date.month}/${edu.end_date.day}/${edu.end_date.year}`}
                            </Text>
                          )}
                        {dateExists(edu.start_date) && edu.currentlyStudying && (
                          <Text variant="label" weight="light">
                            {`${edu.start_date.month}/${edu.start_date.day}/${edu.start_date.year} - Present`}
                          </Text>
                        )}
                      </Box>
                      {username === userData.username && (
                        <Box display="flex" flexDirection="row" gap="2">
                          <PrimaryButton
                            variant="transparent"
                            onClick={() => {
                              setModalMode("edit");
                              setEditEducationId(index);
                              setAddEducation(true);
                            }}
                          >
                            <EditOutlined />
                          </PrimaryButton>

                          <PrimaryButton
                            onClick={async () => {
                              await removeEducation(index.toString());
                            }}
                            variant="transparent"
                          >
                            <DeleteOutlined />
                          </PrimaryButton>
                        </Box>
                      )}
                    </Box>
                  </Card>
                );
              })}
          </>
        )}
      </ScrollContainer>
      {
        <Paginate
          breakLabel="..."
          nextLabel="Next"
          onPageChange={handlePageClick}
          pageRangeDisplayed={2}
          pageCount={pageCount}
          previousLabel="Previous"
          renderOnZeroPageCount={() => null}
          mode={mode}
        />
      }
    </Box>
  );
};

export default memo(Education);
