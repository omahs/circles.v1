import Breadcrumbs from "@/app/common/components/Breadcrumbs";
import Editor from "@/app/common/components/Editor";
import Loader from "@/app/common/components/Loader";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import Tabs from "@/app/common/components/Tabs";
import useCardDynamism from "@/app/services/Card/useCardDynamism";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { useGlobal } from "@/app/context/globalContext";
import {
  Box,
  Button,
  IconChevronDown,
  IconChevronUp,
  IconClose,
  IconUserSolid,
  Stack,
  Tag,
  Text,
  useTheme,
} from "degen";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { memo, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import styled from "styled-components";
import { useLocalCard } from "../Project/CreateCardModal/hooks/LocalCardContext";
import CardAssignee from "./modals/CardAssignee";
import CardColumn from "./modals/CardColumn";
import CardDeadline from "./modals/CardDeadline";
import CardStartDate from "./modals/CardStartDate";
import CardLabels from "./modals/CardLabels";
import CardPriority from "./modals/CardPriority";
import CardReviewer from "./modals/CardReviewer";
import CardReward from "./modals/CardReward";
import CardType from "./modals/CardType";
import { IconButton } from "../Project/ProjectHeading";
import ActionPopover from "./OptionPopover";
import Activity from "./Activity";
import Application from "./Application";
import Apply from "./Apply";
import AssignToMe from "./AssignToMe";
import Submission from "./Submission";
import SubTasks from "./SubTasks";
import Discuss from "./Discuss";
import CardProject from "./modals/CardProject";
import MintKudos from "./MintKudos";
import ViewKudos from "./MintKudos/view";
import MultiUserProperty from "./modals/properties/MultiUserProperty";
import DateProperty from "./modals/properties/DateProperty";
import SingleSelectProperty from "./modals/properties/SingleSelectProperty";
import RewardProperty from "./modals/properties/RewardProperty";

const Container = styled(Box)`
  ::-webkit-scrollbar {
    width: 0px;
  }
  height: calc(100vh - 4.5rem);
  overflow-y: auto;
  overflow-x: hidden;
`;

const NameInput = styled.input<{ mode: string }>`
  width: 100%;
  background: transparent;
  border: 0;
  border-style: none;
  border-color: transparent;
  outline: none;
  outline-offset: 0;
  box-shadow: none;
  font-size: 1.8rem;
  caret-color: rgb(255, 255, 255, 0.85);
  color: ${(props) =>
    props.mode === "dark" ? "rgb(255, 255, 255, 0.8)" : "rgb(20, 20, 20, 0.8)"};
  font-weight: 600;
`;

function Card() {
  const [selectedTab, setSelectedTab] = useState(0);
  const handleTabClick = (index: number) => setSelectedTab(index);
  const {
    cardId,
    loading,
    description,
    title,
    setTitle,
    labels,
    setDescription,
    project,
    onCardUpdate,
    card,
    cardType,
    columnId,
    kudosMinted,
  } = useLocalCard();
  const { canTakeAction } = useRoleGate();
  const { viewName } = useGlobal();

  const { getTabs, activityTab, applicationTab, submissionTab } =
    useCardDynamism();

  const router = useRouter();
  const { circle: cId, project: pId, card: tId } = router.query;

  const [isDirty, setIsDirty] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const { mode } = useTheme();

  useEffect(() => {
    if (isDirty) {
      void onCardUpdate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [description, isDirty]);

  if (!tId) {
    return null;
  }

  if (loading) {
    return <Loader loading text="Fetching" />;
  }

  if (card?.unauthorized)
    return (
      <>
        <Text size="headingTwo" weight="semiBold" ellipsis>
          This project is private
        </Text>
        <Button
          size="large"
          variant="transparent"
          onClick={() => router.back()}
        >
          <Text size="extraLarge">Go Back</Text>
        </Button>
      </>
    );

  return (
    <Box padding="4">
      <AnimatePresence>
        {/* {batchPayModalOpen && (
          <BatchPay card={card} setIsOpen={setBatchPayModalOpen} />
        )} */}
        {isApplyModalOpen && (
          <Apply setIsOpen={setIsApplyModalOpen} cardId={card?.id as string} />
        )}
      </AnimatePresence>
      <Box
        borderRadius="large"
        backgroundColor="background"
        style={{
          boxShadow: `0px 0px 10px 0.5rem ${
            mode === "dark" ? "rgba(0, 0, 0, 0.3)" : "rgba(0, 0, 0, 0.1)"
          }`,
        }}
      >
        <ToastContainer
          toastStyle={{
            backgroundColor: `${
              mode === "dark" ? "rgb(20,20,20)" : "rgb(240,240,240)"
            }`,
            color: `${
              mode === "dark" ? "rgb(255,255,255,0.7)" : "rgb(20,20,20,0.7)"
            }`,
          }}
        />
        <Box padding="1" borderBottomWidth="0.375">
          <Stack direction="horizontal">
            <Link
              href={
                viewName?.length > 0
                  ? `/${cId}/${pId}/?view=${viewName}`
                  : `/${cId}/${pId}`
              }
            >
              <IconButton color="textSecondary" paddingX="2">
                <IconClose />
              </IconButton>
            </Link>

            <Box
              display="flex"
              flexDirection="row"
              borderRadius="large"
              backgroundColor="foregroundSecondary"
            >
              <IconButton
                color="textSecondary"
                paddingX="2"
                onClick={() => {
                  // get current card index
                  if (project) {
                    const index = project?.columnDetails[
                      columnId
                    ].cards.findIndex((c) => c === card?.id);
                    const prevCard =
                      project.cards[
                        project?.columnDetails[columnId].cards[index - 1]
                      ];
                    if (prevCard) {
                      void router.push(`/${cId}/${pId}/${prevCard.slug}`);
                    }
                  }
                }}
              >
                <IconChevronUp />
              </IconButton>
              <IconButton
                color="textSecondary"
                paddingX="2"
                onClick={() => {
                  // get current card index
                  if (project) {
                    const index = project?.columnDetails[
                      columnId
                    ].cards.findIndex((c) => c === card?.id);
                    const nextCard =
                      project.cards[
                        project?.columnDetails[columnId].cards[index + 1]
                      ];
                    if (nextCard) {
                      void router.push(`/${cId}/${pId}/${nextCard.slug}`);
                    }
                  }
                }}
              >
                <IconChevronDown />
              </IconButton>
            </Box>
          </Stack>
        </Box>

        <Stack direction="horizontal">
          <Box width="3/4">
            <Container padding="8">
              <Box marginLeft="1">
                {card?.parent && (
                  <Breadcrumbs
                    crumbs={[
                      {
                        name: card?.parent.title,
                        href: `/${cId}/${card.parent.project.slug}/${card?.parent.slug}`,
                      },
                      {
                        name: `#${card?.slug}`,
                        href: "",
                      },
                    ]}
                  />
                )}
              </Box>
              <Stack direction="vertical">
                <Stack direction="horizontal">
                  <NameInput
                    placeholder="Card name"
                    value={title}
                    disabled={!canTakeAction("cardTitle")}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setIsDirty(true);
                    }}
                    onBlur={() => {
                      if (isDirty) {
                        if (title.length > 0) {
                          void onCardUpdate();
                          setIsDirty(false);
                        } else {
                          setTitle(card?.title as string);
                        }
                      }
                    }}
                    mode={mode}
                  />
                  {canTakeAction("cardPopoverActions") && <ActionPopover />}
                </Stack>
                <Stack direction="horizontal" wrap>
                  {canTakeAction("cardLabels") && <CardLabels />}
                  {labels.map((label) => (
                    <Tag key={label}>{label}</Tag>
                  ))}
                </Stack>
                <SubTasks createCard={false} />
                <Box
                  style={{
                    minHeight: "10rem",
                    maxHeight: "25rem",
                    overflowY: "auto",
                  }}
                  marginRight="4"
                  color="accent"
                >
                  {!loading && (
                    <div key={`${cardId}-description`}>
                      <Editor
                        value={card?.description as string}
                        placeholder="Add a description, press '/' for commands"
                        disabled={!canTakeAction("cardDescription")}
                        onSave={(txt) => {
                          setDescription(txt);
                        }}
                        isDirty={isDirty}
                        setIsDirty={setIsDirty}
                      />
                    </div>
                  )}
                </Box>
                <Tabs
                  tabs={getTabs()}
                  selectedTab={selectedTab}
                  onTabClick={handleTabClick}
                  orientation="horizontal"
                  unselectedColor="transparent"
                  shape="circle"
                />
                <AnimatePresence initial={false}>
                  {selectedTab === activityTab && <Activity />}
                  {selectedTab === applicationTab && !loading && (
                    <Application />
                  )}
                  {selectedTab === submissionTab && !loading && <Submission />}
                </AnimatePresence>
              </Stack>
            </Container>
          </Box>
          <Box width="1/4" borderLeftWidth="0" paddingX="4" paddingTop="8">
            {project?.id && (
              <Stack>
                <CardType />
                <CardProject />
                {!card?.parent && <CardColumn />}

                <MultiUserProperty
                  templateId={cardType}
                  propertyId={"assignee"}
                />
                <MultiUserProperty
                  templateId={cardType}
                  propertyId={"reviewer"}
                />
                <DateProperty templateId={cardType} propertyId={"start-date"} />
                <DateProperty templateId={cardType} propertyId={"deadline"} />
                <SingleSelectProperty
                  templateId={cardType}
                  propertyId={"priority"}
                />
                <RewardProperty templateId={cardType} propertyId={"reward"} />
                {/* {canTakeAction("cardPayment") && (
                  <PrimaryButton
                    onClick={() => {
                      setBatchPayModalOpen(true);
                    }}
                    icon={<IconEth />}
                  >
                    Pay
                  </PrimaryButton>
                )} */}
                {cardType === "Bounty" && canTakeAction("cardApply") && (
                  <PrimaryButton
                    icon={<IconUserSolid />}
                    onClick={() => {
                      setIsApplyModalOpen(true);
                    }}
                  >
                    Apply
                  </PrimaryButton>
                )}
                {cardType === "Task" && canTakeAction("assignToMe") && (
                  <AssignToMe />
                )}
                <Discuss />
                {!card?.kudosMinted && <MintKudos />}
                <ViewKudos />
              </Stack>
            )}
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}

export default memo(Card);
