import Dropdown from "@/app/common/components/Dropdown";
import Editor from "@/app/common/components/Editor";
import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import useProfileUpdate from "@/app/services/Profile/useProfileUpdate";
import { Milestone, Option, Registry } from "@/app/types";
import { Box, Button, Input, Stack, Tag, Text, useTheme } from "degen";
import { useEffect, useState } from "react";
import styled from "styled-components";

type Props = {
  handleClose: () => void;
  addExperience?: (experience: Milestone) => void;
  modalMode: "create" | "edit";
  experienceId?: number;
};

export default function AddExperienceModal({
  handleClose,
  addExperience,
  modalMode,
  experienceId,
}: Props) {
  const [value, setValue] = useState("");
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [organization, setOrganization] = useState("");
  const [linkedCredentials, setLinkedCredentials] = useState("");
  const { addExperience: createExperience, updateExperience } =
    useProfileUpdate();

  const [requiredFieldsNotSet, setRequiredFieldsNotSet] = useState({
    role: false,
    organization: false,
    startDate: false,
  });

  const { mode } = useTheme();

  const isEmpty = (fieldName: string, value: any) => {
    switch (fieldName) {
      case "role":
      case "organization":
      case "startDate":
        return !value;
      default:
        return false;
    }
  };

  return (
    <Modal
      handleClose={() => {
        handleClose();
      }}
      title={`Add Experience`}
    >
      <Box
        width="72"
        padding={{
          xs: "2",
          md: "8",
        }}
        paddingTop={{
          xs: "2",
          md: "4",
        }}
        paddingBottom={{
          xs: "2",
          md: "0",
        }}
      >
        <PrimaryButton
          variant="tertiary"
          onClick={() => {
            console.log("clicked");
          }}
        >
          Import from Lens
        </PrimaryButton>
      </Box>
      <Box
        padding={{
          xs: "2",
          md: "8",
        }}
        width="full"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
        gap="4"
      >
        <Box>
          <Box display="flex" flexDirection="row" alignItems="center" gap="2">
            <Text variant="label">Role</Text>
            <Tag size="small" tone="accent">
              Required
            </Tag>
          </Box>
          {requiredFieldsNotSet["role"] && (
            <Text color="red" variant="small">
              This is a required field and cannot be empty
            </Text>
          )}
          <Input
            label=""
            placeholder={`Enter Role`}
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setRequiredFieldsNotSet({
                ...requiredFieldsNotSet,
                role: isEmpty("role", e.target.value),
              });
            }}
          />
        </Box>
        <Box>
          <Box display="flex" flexDirection="row" alignItems="center" gap="2">
            <Text variant="label">Organization</Text>
            <Tag size="small" tone="accent">
              Required
            </Tag>
          </Box>
          {requiredFieldsNotSet["organization"] && (
            <Text color="red" variant="small">
              This is a required field and cannot be empty
            </Text>
          )}
          <Input
            label=""
            placeholder={`Enter Organization`}
            value={organization}
            onChange={(e) => {
              setOrganization(e.target.value);
              setRequiredFieldsNotSet({
                ...requiredFieldsNotSet,
                organization: isEmpty("organization", e.target.value),
              });
            }}
          />
        </Box>
        <Box>
          <Text variant="label">Description</Text>

          <Box
            marginTop="2"
            width="full"
            borderWidth="0.375"
            padding="4"
            borderRadius="large"
            maxHeight="64"
            overflow="auto"
          >
            <Editor
              value={description}
              onSave={(value) => {
                setDescription(value);
              }}
              placeholder={`Enter Description, press / for commands`}
              isDirty={true}
            />
          </Box>
        </Box>
        <Box>
          <Box
            display="flex"
            flexDirection={{
              xs: "column",
              md: "row",
            }}
            gap={{
              xs: "0",
              md: "4",
            }}
          >
            <Box
              width={{
                xs: "full",
                md: "72",
              }}
            >
              <Text variant="label">Start Date</Text>

              <DateInput
                placeholder={`Enter Start Date`}
                value={startDate}
                type="date"
                mode={mode}
                onChange={(e) => {
                  setStartDate(e.target.value);
                }}
              />
            </Box>
            <Box
              width={{
                xs: "full",
                md: "72",
              }}
              marginTop={{
                xs: "2",
                md: "0",
              }}
            >
              <Text variant="label">End Date</Text>

              <DateInput
                placeholder={`Enter End Date`}
                value={startDate}
                type="date"
                mode={mode}
                onChange={(e) => {
                  setStartDate(e.target.value);
                }}
              />
            </Box>
          </Box>
        </Box>
        <Box>
          <Text variant="label">Credentials</Text>
          <Box
            width={{
              xs: "full",
              md: "full",
            }}
            marginTop="2"
          >
            <Text variant="small">
              Link all your on-chain and verifiable credentials to this
              experience and showcase it with more confidence!
            </Text>
            <Box marginTop="2" width="48">
              <PrimaryButton variant="tertiary" onClick={() => {}}>
                Add Credentials
              </PrimaryButton>
            </Box>
          </Box>
        </Box>
        <Box
          marginTop={{
            xs: "0",
            md: "4",
          }}
          display="flex"
          flexDirection="row"
          justifyContent="flex-end"
        >
          <Button
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            marginRight="2"
            variant="secondary"
            size="small"
            width="32"
            onClick={async () => {
              console.log({ role, organization });
              if (!role || !organization) {
                setRequiredFieldsNotSet({
                  ...requiredFieldsNotSet,
                  role: isEmpty("role", role),
                  organization: isEmpty("organization", organization),
                });
                return;
              }
              if (modalMode === "create") {
                const res = await createExperience({
                  role,
                  organization,
                  description,
                  startDate,
                  endDate,
                });
              } else if (modalMode === "edit") {
                if (!experienceId) {
                  return;
                }
                const res = await updateExperience(experienceId?.toString(), {
                  role,
                  organization,
                  description,
                  startDate,
                  endDate,
                });
              }
              handleClose();
            }}
          >
            {modalMode === "create" ? "Add" : "Update"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
export const DateInput = styled.input<{ mode: string }>`
  padding: 1rem;
  border-radius: 0.55rem;
  border 1px solid ${(props) =>
    props.mode === "dark" ? "rgb(255, 255, 255,0.1)" : "rgb(20,20,20,0.1)"};
  background-color: ${(props) =>
    props.mode === "dark" ? "rgb(20,20,20)" : "rgb(255, 255, 255)"};
  width: 100%;
  color: ${(props) =>
    props.mode === "dark" ? "rgb(255, 255, 255,0.7)" : "rgb(20,20,20,0.7)"};
  margin-top: 10px;
  outline: none;
  &:focus {
    border-color: rgb(191, 90, 242, 1);
  }
  transition: border-color 0.5s ease;
`;
