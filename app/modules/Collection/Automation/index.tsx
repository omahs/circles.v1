import Breadcrumbs from "@/app/common/components/Breadcrumbs";
import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import Tabs from "@/app/common/components/Tabs";
import {
  addAutomation,
  removeAutomation,
  updateAutomation,
} from "@/app/services/UpdateCircle";
import {
  Action,
  Automation as SingleAutomationType,
  AutomationType,
  Trigger,
} from "@/app/types";
import { GatewayOutlined } from "@ant-design/icons";
import { Box, Stack, Text, useTheme } from "degen";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCircle } from "../../Circle/CircleContext";
import { useLocalCollection } from "../Context/LocalCollectionContext";
import SingleAutomation from "./SingleAutomation";

export default function Automation() {
  const { circle, setCircleData } = useCircle();
  const { localCollection: collection } = useLocalCollection();
  const router = useRouter();
  const { collection: colId } = router.query;
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const onTabClick = (id: number) => {
    if (automationOrder[id] in automationInCreate) setAutomationMode("create");
    else setAutomationMode("edit");
    setAutomationId(automationOrder[id]);
    setTab(id);
  };
  const [tabs, setTabs] = useState([
    `𝘕𝘦𝘸: Automation ${circle.automationCount || 0 + 1}`,
  ] as string[]);
  const [automationMode, setAutomationMode] = useState("create");
  const [automations, setAutomations] = useState(circle.automations || {});
  const [automationOrder, setAutomationOrder] = useState(
    circle.automationsIndexedByCollection[colId as string] || []
  );
  const [automationId, setAutomationId] = useState(automationOrder[tab]);
  const [automationInCreate, setAutomationInCreate] = useState(
    {} as AutomationType
  );
  const [automationInEdit, setAutomationInEdit] = useState(
    {} as AutomationType
  );

  const saveDraftLocal = (
    automation: SingleAutomationType,
    isDirty: boolean
  ) => {
    if (automationMode === "create") {
      setAutomationInCreate({
        [automationId]: automation,
      });
    }
    // } else {
    //   if (isDirty) {
    //     setAutomationInEdit({
    //       [automationId]: automation,
    //     });
    //     // const newTabs = automationOrder.map((aId, index) => {
    //     //   if (aId === automationId) {
    //     //     return `𝘜𝘱𝘥𝘢𝘵𝘪𝘯𝘨: ${automations[automationId].name}`;
    //     //   }
    //     //   return tabs[index];
    //     // });
    //     // setTabs(newTabs);
    //   }
    // }
  };

  const init = (initTab?: number) => {
    setAutomationOrder(circle.automationsIndexedByCollection[colId as string]);
    setAutomations(circle.automations);
    if (initTab || initTab === 0) {
      setAutomationId(
        circle.automationsIndexedByCollection[colId as string][initTab]
      );
      setTab(initTab);
    } else
      setAutomationId(
        circle.automationsIndexedByCollection[colId as string][tab]
      );
    const tabs = circle.automationsIndexedByCollection[colId as string].map(
      (automationId) => {
        return circle.automations[automationId].name;
      }
    );

    setTabs(tabs);
    setAutomationMode("edit");
  };

  const initNew = () => {
    setTabs(["𝘕𝘦𝘸: Automation 1"]);
    setAutomationOrder(["automation-1"]);
    setAutomationId("automation-1");
    setAutomations({
      "automation-1": {
        id: "automation-1",
        name: "Automation 1",
        description: "",
        trigger: {} as Trigger,
        actions: [] as Action[],
        triggerCategory: "collection",
      },
    });
    setAutomationMode("create");
    setTab(0);
    setAutomationInCreate({
      "automation-1": {
        id: "automation-1",
        name: "Automation 1",
        description: "",
        trigger: {} as Trigger,
        actions: [] as Action[],
        triggerCategory: "collection",
      },
    });
  };

  const onSave = async (
    name: string,
    description: string,
    trigger: Trigger,
    actions: Action[]
  ) => {
    const newAutomation = {
      name,
      description,
      trigger,
      actions,
    };
    if (automationMode === "create") {
      const res = await addAutomation(circle?.id, {
        ...newAutomation,
        triggerCategory: "collection",
        triggerCollectionSlug: collection?.slug,
      });
      if (res) setCircleData(res);
    } else {
      const res = await updateAutomation(
        circle?.id,
        automationId,
        newAutomation
      );
      if (res) setCircleData(res);
    }
    setAutomationMode("edit");
    if (automationId in automationInCreate) {
      setAutomationInCreate({});
    } else if (automationId in automationInEdit) {
      delete automationInEdit[automationId];
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    if (
      !circle.automationsIndexedByCollection ||
      !colId ||
      !circle.automationsIndexedByCollection[colId as string]?.length
    ) {
      initNew();
    } else {
      init();
    }
  }, [circle.automationsIndexedByCollection, circle.automations]);

  useEffect(() => {
    setAutomationInCreate({});
    setAutomationMode("edit");

    if (
      !circle.automationsIndexedByCollection ||
      !colId ||
      !circle.automationsIndexedByCollection[colId as string]?.length
    ) {
      initNew();
    } else {
      init(0);
    }
  }, [isOpen]);

  return (
    <>
      <Stack direction="vertical">
        <Text variant="small">{`Reduce recurring chores`}</Text>
      </Stack>
      <Box
        width={{
          xs: "full",
          md: "full",
        }}
      >
        <PrimaryButton
          variant={automationOrder?.length > 0 ? "tertiary" : "secondary"}
          onClick={() => setIsOpen(true)}
          icon={<GatewayOutlined />}
        >
          {automationOrder?.length > 0 ? `Edit Automations` : `Add Automations`}
        </PrimaryButton>
      </Box>
      <AnimatePresence>
        {isOpen && (
          <Modal
            title="Automation"
            size="large"
            handleClose={() => setIsOpen(false)}
          >
            <Box display="flex">
              <Box width="1/4" paddingY="8" paddingRight="1">
                <Tabs
                  selectedTab={tab}
                  onTabClick={onTabClick}
                  tabs={tabs}
                  tabTourIds={[]}
                  orientation="vertical"
                  unselectedColor="transparent"
                />
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                width="3/4"
                paddingRight="8"
                paddingLeft="2"
                justifyContent="flex-start"
              >
                <SingleAutomation
                  automation={
                    automationMode === "create"
                      ? automationInCreate[automationId] ||
                        automations[automationId]
                      : automationInEdit[automationId] ||
                        automations[automationId]
                  }
                  automationMode={automationMode}
                  onDelete={async () => {
                    const res = await removeAutomation(automationId, circle.id);
                    if (res) {
                      if (
                        tab >=
                        res.automationsIndexedByCollection[colId as string]
                          .length
                      )
                        setTab(tab - 1);
                      setCircleData(res);
                    }
                  }}
                  onSave={onSave}
                  onMouseLeave={(
                    name,
                    description,
                    trigger,
                    actions,
                    isDirty
                  ) => {
                    saveDraftLocal(
                      {
                        id: automationId,
                        name,
                        description,
                        trigger,
                        actions,
                        triggerCategory: "collection",
                      },
                      isDirty
                    );
                  }}
                />
              </Box>
            </Box>
            <Box width="1/4" paddingBottom="4" padding="2">
              <PrimaryButton
                variant="secondary"
                disabled={Object.keys(automationInCreate).length > 0}
                onClick={() => {
                  setTabs([
                    ...tabs,
                    `𝘕𝘦𝘸: Automation ${circle.automationCount + 1}`,
                  ]);
                  setAutomationOrder([
                    ...automationOrder,
                    `automation-${circle.automationCount + 1}`,
                  ]);
                  setAutomationId(`automation-${circle.automationCount + 1}`);

                  setAutomations({
                    ...automations,
                    [`automation-${circle.automationCount + 1}`]: {
                      id: `automation-${circle.automationCount + 1}`,
                      name: `Automation ${circle.automationCount + 1}`,
                      description: "",
                      trigger: {} as Trigger,
                      actions: [] as Action[],
                      triggerCategory: "collection",
                    },
                  });
                  setAutomationMode("create");
                  setTab(tabs.length);
                  setAutomationInCreate({
                    [`automation-${circle.automationCount + 1}`]: {
                      id: `automation-${circle.automationCount + 1}`,
                      name: `Automation ${circle.automationCount + 1}`,
                      description: "",
                      trigger: {} as Trigger,
                      actions: [] as Action[],
                      triggerCategory: "collection",
                    },
                  });
                }}
              >
                + New Automation
              </PrimaryButton>
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
