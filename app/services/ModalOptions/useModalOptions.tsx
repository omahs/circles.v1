/* eslint-disable @typescript-eslint/no-explicit-any */
import { labels } from "@/app/common/utils/constants";
import { useGlobal } from "@/app/context/globalContext";
import { useCircle } from "@/app/modules/Circle/CircleContext";
import {
  cardTypes,
  priority,
} from "@/app/modules/Project/CreateCardModal/constants";
import { useLocalCard } from "@/app/modules/Project/CreateCardModal/hooks/LocalCardContext";
import { MemberDetails } from "@/app/types";
import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "react-query";

export default function useModalOptions() {
  const router = useRouter();
  const { circle: cId } = router.query;
  const { data: memberDetails, refetch } = useQuery<MemberDetails>(
    ["memberDetails", cId],
    {
      enabled: false,
    }
  );
  const { project } = useLocalCard();
  const { circle } = useCircle();
  const { connectedUser } = useGlobal();

  const fetchMemberDetails = () => {
    void refetch();
  };

  const getOptions = (type: string) => {
    switch (type) {
      case "card":
        return cardTypes;
      case "priority":
        return priority;
      case "labels":
        return labels.concat(circle?.labels || []).map((label) => {
          return {
            name: label,
            value: label,
          };
        });
      case "column":
        return project?.columnOrder?.map((column: string) => ({
          name: project?.columnDetails[column].name,
          value: column,
        }));
      case "project":
        return (
          circle?.projects &&
          Object.values(circle?.projects)?.map((p) => ({
            name: p.name,
            value: p.id,
          }))
        );
      case "circle":
        return (
          circle?.children &&
          Object.values(circle?.children).map((c) => ({
            name: c.name,
            value: c.id,
          }))
        );
      case "assignee":
        // eslint-disable-next-line no-case-declarations
        let tempArr = memberDetails?.members?.map((member: string) => ({
          name: memberDetails && memberDetails.memberDetails[member]?.username,
          avatar: memberDetails && memberDetails.memberDetails[member]?.avatar,
          ethAddress:
            memberDetails && memberDetails.memberDetails[member]?.ethAddress,
          value: member,
        }));
        tempArr = tempArr?.filter(
          (member: any) => member.value !== connectedUser
        );

        if (
          memberDetails &&
          memberDetails.memberDetails[connectedUser]?.username
        ) {
          tempArr?.unshift({
            name:
              (memberDetails &&
                memberDetails.memberDetails[connectedUser]?.username +
                  " (me)") ||
              " (me)",
            avatar:
              (memberDetails &&
                memberDetails.memberDetails[connectedUser]?.avatar) ||
              "",
            value: connectedUser,
            ethAddress:
              (memberDetails &&
                memberDetails.memberDetails[connectedUser]?.ethAddress) ||
              "",
          });
        }

        tempArr?.unshift({
          name: "Unassigned",
          avatar: "",
          value: "",
          ethAddress: "",
        });

        return tempArr;
      default:
        return [];
    }
  };

  const getMemberDetails = React.useCallback(
    (id: string) => {
      return memberDetails?.memberDetails[id];
    },
    [memberDetails]
  );

  const getMemberAvatars = React.useCallback(
    (members: string[]) => {
      return members.map((member) => {
        const memberDetails = getMemberDetails(member);
        return {
          src: memberDetails?.avatar,
          label: memberDetails?.username || "",
          address: memberDetails?.ethAddress,
          id: member,
        };
      });
    },
    [getMemberDetails]
  );
  return {
    getOptions,
    getMemberDetails,
    fetchMemberDetails,
    getMemberAvatars,
  };
}
