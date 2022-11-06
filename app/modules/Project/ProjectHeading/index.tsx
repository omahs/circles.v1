import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { Box, Button, Stack, Text, useTheme } from "degen";
import React, { memo } from "react";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import { useLocalProject } from "../Context/LocalProjectContext";
import ProjectOptions from "./ProjectOptions";
import { ViewBar } from "../ProjectViews";
import { useRouter } from "next/router";
import { useGlobal } from "@/app/context/globalContext";
import AdvancedOptions from "./MoreOptions";
import Breadcrumbs from "@/app/common/components/Breadcrumbs";
import { useCircle } from "../../Circle/CircleContext";
import InviteMemberModal from "@/app/modules/Circle/ContributorsModal/InviteMembersModal";

export const IconButton = styled(Box)`
  cursor: pointer;
  &:hover {
    color: rgb(191, 90, 242, 1);
  }
`;

function ProjectHeading() {
  const { localProject: project, loading } = useLocalProject();
  const { canDo } = useRoleGate();
  const { mode } = useTheme();
  const router = useRouter();
  const { circle: cId, project: pId, view: vId } = router.query;
  const { setViewName, viewName } = useGlobal();
  const { navigationBreadcrumbs } = useCircle();

  const defaultView = () => {
    if (viewName.length > 0) setViewName("");
    if (vId) void router.push(`/${cId}/${pId}/`);
  };

  return (
    <Box
      width="full"
      display="flex"
      flexDirection="column"
      // borderBottomWidth="0.375"
      paddingLeft="3"
      paddingRight="5"
    >
      <Box marginLeft="4" marginTop="2">
        {navigationBreadcrumbs && (
          <Breadcrumbs crumbs={navigationBreadcrumbs} />
        )}
      </Box>
      <Box
        width="full"
        height="14"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Stack direction="horizontal" align="center">
          {!loading && (
            <Button
              variant="transparent"
              size="small"
              onClick={() => defaultView()}
            >
              <Text size="headingTwo" weight="semiBold" ellipsis>
                {project?.name}
              </Text>
            </Button>
          )}
          {loading && (
            <Skeleton
              enableAnimation
              style={{
                height: "2rem",
                width: "15rem",
                borderRadius: "0.5rem",
              }}
              baseColor={mode === "dark" ? "rgb(20,20,20)" : "rgb(255,255,255)"}
              highlightColor={
                mode === "dark" ? "rgb(255,255,255,0.1)" : "rgb(20,20,20,0.1)"
              }
            />
          )}
          {project?.name && canDo("manageProjectSettings") && (
            <ProjectOptions />
          )}
          <ViewBar />
        </Stack>
        <Box width="52">
          <InviteMemberModal />
        </Box>
      </Box>
      <AdvancedOptions />
    </Box>
  );
}

export default memo(ProjectHeading);
