import { Avatar, Box, Stack, useTheme } from "degen";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { CardType, UserType } from "@/app/types";
import Link from "next/link";
import { useRouter } from "next/router";
import useModalOptions from "@/app/services/ModalOptions/useModalOptions";

const TitleInput = styled.input<{ mode: string }>`
  width: 100%;
  background: transparent;
  border: 0;
  border-style: none;
  border-color: transparent;
  outline: none;
  outline-offset: 0;
  box-shadow: none;
  font-size: 1rem;
  caret-color: rgb(255, 255, 255, 0.8);
  color: ${(props) =>
    props.mode === "dark" ? "rgb(255, 255, 255, 0.7)" : "rgb(20, 20, 20, 0.7)"};

  ::placeholder {
    color: rgb(255, 255, 255, 0.25);
  }
  cursor: pointer;
  padding-top: 1rem;
  padding-bottom: 1rem;
`;

const Container = styled(Box)<{ mode: string }>`
  color: rgb(255, 255, 255, 0.85);
  background: ${(props) =>
    props.mode === "dark" ? "rgb(20,20,20)" : "rgb(247, 247, 247)"};
  border-radius: 1rem;
  width: 100%;
  overflow: hidden;
  transition: all 0.2s ease-in-out;
  &:hover {
    border: 2px solid rgb(191, 90, 242, 1);
  }
`;

type Props = {
  child: CardType;
};

type ContainerProps = {
  title: string;
  memberDetails: UserType | undefined;
};

const variants = {
  hidden: { opacity: 0, x: 0, y: "-10h" },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: {
    opacity: 0,
    x: 0,
    y: "10vh",
    transition: {
      duration: 0.3,
    },
  },
};

export const SubTaskContainer = ({ title, memberDetails }: ContainerProps) => {
  const { mode } = useTheme();
  console.log({ memberDetails });
  return (
    <motion.div
      style={{
        background: "transparent",
        border: "none",
        padding: "0rem",
      }}
      variants={variants}
    >
      <Container paddingX="4" borderWidth="0.5" cursor="pointer" mode={mode}>
        <Stack direction="horizontal">
          <TitleInput value={title} disabled mode={mode} />
          <Box paddingY="1">
            {memberDetails && (
              <Stack direction="horizontal" space="1">
                <Avatar
                  size="9"
                  src={memberDetails.avatar}
                  label="avatar"
                  placeholder={!memberDetails.avatar}
                  address={memberDetails.ethAddress}
                />
              </Stack>
            )}
          </Box>
        </Stack>
      </Container>
    </motion.div>
  );
};

export default function CreatedSubTask({ child }: Props) {
  const [assignees, setAssignees] = useState<string[]>([]);
  const router = useRouter();
  const { circle: cId, project: pId } = router.query;
  const { getMemberDetails } = useModalOptions();

  useEffect(() => {
    if (child) {
      setAssignees(child.assignee);
    }
  }, [child]);
  return (
    <Link href={`/${cId}/${pId}/${child.slug}`}>
      <div>
        <SubTaskContainer
          title={child.title}
          memberDetails={getMemberDetails(child.assignee[0])}
        />
      </div>
    </Link>
  );
}
