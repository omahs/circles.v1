import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { useLocalProject } from "../Context/LocalProjectContext";
import { useGlobal } from "@/app/context/globalContext";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import {
  Box,
  Button,
  IconGrid,
  IconList,
  IconDotsVertical,
  Text,
  IconPlusSmall,
} from "degen";
import Link from "next/link";
import { toast } from "react-toastify";
import CreateViewModal from "./ViewModal/CreateViewModal";
import EditViewModal from "./ViewModal/EditViewModal";
import { AnimatePresence } from "framer-motion";
import PrimaryButton from "@/app/common/components/PrimaryButton";

export const ViewBar = () => {
  const router = useRouter();
  const { circle: cId, project: pId, view: vId } = router.query;
  const { localProject: project } = useLocalProject();
  const { viewName, setViewName } = useGlobal();
  const { canDo } = useRoleGate();

  const [openModal, setOpenModal] = useState(false);
  const [viewMode, setViewMode] = useState("");

  useEffect(() => {
    if (!vId) {
      setViewName("");
    }
  }, [pId]);

  return (
    <>
      <Box display="flex" flexDirection="row" gap="4">
        {project?.viewOrder?.map((view_Id) => {
          const view = project.viewDetails?.[view_Id];

          return (
            <Link href={`/${cId}/${pId}?view=${view_Id}`} key={view_Id}>
              <Button
                prefix={
                  view?.type == "Board" ? (
                    <IconGrid size="4" />
                  ) : (
                    <IconList size="4" />
                  )
                }
                variant={view_Id == viewName ? "tertiary" : "transparent"}
                size="small"
                suffix={
                  view_Id == viewName && canDo(["steward"]) ? (
                    <>
                      <Box
                        onClick={() => {
                          setViewMode("edit");
                          setOpenModal(true);
                        }}
                      >
                        <IconDotsVertical size="4" />
                      </Box>
                    </>
                  ) : (
                    <></>
                  )
                }
              >
                {view?.name}
              </Button>
            </Link>
          );
        })}
      </Box>
      <Box width="44">
        {project?.name && canDo(["steward"]) && (
          <PrimaryButton
            variant="transparent"
            onClick={() => {
              if (project.viewOrder && project.viewOrder?.length < 3) {
                setViewMode("create");
                setOpenModal(true);
              } else {
                toast.warning("You cannot create more than 3 views");
              }
            }}
            icon={<IconPlusSmall size="4" />}
          >
            Create View
          </PrimaryButton>
        )}
      </Box>
      <AnimatePresence>
        {openModal && viewMode == "create" && (
          <CreateViewModal setViewOpen={setOpenModal} />
        )}
        {openModal && viewMode == "edit" && (
          <EditViewModal setViewOpen={setOpenModal} viewId={viewName} />
        )}
      </AnimatePresence>
    </>
  );
};
