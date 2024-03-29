import { CompactTable } from "@table-library/react-table-library/compact";
import { TableNode } from "@table-library/react-table-library/types";
import { useTheme as useTableTheme } from "@table-library/react-table-library/theme";

import styled from "styled-components";
import { useTheme, Button, IconPlusSmall, Box } from "degen";
import { memo, useState, useEffect } from "react";
import { ArrowsAltOutlined } from "@ant-design/icons";
import { AnimatePresence } from "framer-motion";
import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "react-toastify";

import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { useLocalProject } from "../Context/LocalProjectContext";
import { useGlobal } from "@/app/context/globalContext";
import { filterCards } from "../ProjectHeading/MoreOptions/Helper/filterCards";
import { SkeletonLoader } from "../SkeletonLoader";
import { titleFilter } from "@/app/modules/Project/ProjectHeading/MoreOptions/Helper/searchBy";
import { sortBy } from "@/app/modules/Project/ProjectHeading/MoreOptions/Helper/sortBy";
import { CardsType, CardType, Filter } from "@/app/types";
import { IconButton } from "@/app/modules/Project/ProjectHeading/index";
import CreateCardModal from "@/app/modules/Project/CreateCardModal";

import { CardTitle } from "./components/CardTitle";
import { CardType as Type } from "./components/CardType";
import { CardColumn } from "./components/CardColumn";
import { CardProject } from "./components/CardProject";
import CardAssignee from "./components/CardAssignee";
import CardReviewer from "./components/CardReviewer";
import CardReward from "./components/CardReward";
import CardDeadline from "./components/CardDeadline";
import CardStartDate from "./components/CardStartDate";
import CardPriority from "./components/CardPriority";
import Link from "next/link";
import { useRouter } from "next/router";

const Container = styled.div`
  height: calc(100vh - 7.5rem);
  overflow-y: auto;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  @media only screen and (min-width: 0px) {
    max-width: calc(100vw - 5rem);
    padding: 0 0.1rem;
  }
  @media only screen and (min-width: 768px) {
    max-width: calc(100vw - 4rem);
    padding: 0 0.5rem;
  }
`;

function TableView({ viewId }: { viewId: string }) {
  const { localProject: project, loading, advFilters } = useLocalProject();
  const router = useRouter();
  const { circle: cId, project: pId } = router.query;
  const { currentFilter } = useGlobal();
  const { mode } = useTheme();

  const { canDo } = useRoleGate();
  const [isOpen, setIsOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useHotkeys("c", (e) => {
    e.preventDefault();
    if (!canDo("createNewCard")) {
      toast.error("You don't have permission to add cards in this column", {
        theme: "dark",
      });
      return;
    }
    setIsOpen(true);
  });

  const [viewCards, setViewCards] = useState({} as CardsType);
  const view = project.viewDetails?.[viewId];

  useEffect(() => {
    const vCards = filterCards(project, project.cards, view?.filters as Filter);
    const fVCards = filterCards(project, vCards, currentFilter);
    setViewCards(fVCards);
  }, [
    project?.cards,
    project,
    view?.filters,
    project?.columnOrder,
    currentFilter,
  ]);

  const filteredCards = filterCards(project, project.cards, currentFilter);

  const [tasks, setTasks] = useState([] as CardType[]);

  useEffect(() => {
    let tcards;
    if (viewId === "") {
      tcards = filteredCards;
    } else {
      tcards = viewCards;
    }
    let cards =
      tcards &&
      Object.values(tcards)?.filter((card) => card.status.archived == false);
    const fcards = titleFilter(cards, advFilters.inputTitle);
    cards = sortBy(advFilters.sortBy, fcards, advFilters.order);
    setTasks(cards);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    viewCards,
    project.cards,
    currentFilter,
    advFilters.inputTitle,
    advFilters.sortBy,
    advFilters.order,
  ]);

  const theme = useTableTheme({
    Table: `--data-table-library_grid-template-columns:  4% 40% 15% 15% 15% 15% 15% 15% 15% 15% 15%;
    ::-webkit-scrollbar {
      display: none;
    }
    height: ${tasks?.length < 12 ? `calc(${tasks.length + 1}*52px)` : "90%"};
    border: 1px solid ${
      mode === "dark" ? "rgb(255, 255, 255, 0.1);" : "rgb(0, 0, 0, 0.1)"
    };
    `,
    Header: ``,
    Body: ``,
    BaseRow: `
    background-color: ${
      mode === "dark" ? "rgb(20,20,20)" : "rgb(250, 250, 250)"
    };
    `,
    HeaderRow: `
      font-size: 16px;
      color: ${
        mode === "dark" ? "rgb(255, 255, 255, 0.4)" : "rgb(20, 20, 20, 0.7)"
      };
      z-index: 0;
  
      .th {
        border-bottom: 1px solid ${
          mode === "dark" ? "rgb(255, 255, 255, 0.1);" : "rgb(0, 0, 0, 0.1)"
        };
      }
    `,
    Row: `
      font-size: 12px;
      color: grey;
    `,
    BaseCell: `
      border-bottom: 1px solid ${
        mode === "dark" ? "rgb(255, 255, 255, 0.1);" : "rgb(0, 0, 0, 0.1)"
      };
      border-right: 1px solid ${
        mode === "dark" ? "rgb(255, 255, 255, 0.1);" : "rgb(0, 0, 0, 0.1)"
      };
  
      padding: 8px;
      height: 52px;
      &:nth-of-type(1) {
        left: 0px;
      }
    `,
    HeaderCell: ``,
    Cell: ``,
  });

  const columns = [
    {
      label: "",
      renderCell: (item: TableNode) => (
        <Link href={`/${cId}/${pId}/${item.slug}`}>
          <IconButton color="textSecondary" paddingX="2" paddingY="1">
            <ArrowsAltOutlined style={{ fontSize: "1.1rem" }} />
          </IconButton>
        </Link>
      ),
    },
    {
      label: "Title",
      renderCell: (item: TableNode) => (
        <CardTitle name={item.title} id={item.id} />
      ),
      resize: true,
    },
    {
      label: "Type",
      renderCell: (item: TableNode) => <Type id={item.id} type={item.type} />,
      resize: true,
    },
    {
      label: "Status",
      renderCell: (item: TableNode) => <CardColumn id={item.id} />,
      resize: true,
    },
    {
      label: "Project",
      renderCell: (item: TableNode) => <CardProject id={item.id} />,
      resize: true,
    },
    {
      label: "Assignee",
      renderCell: (item: TableNode) => (
        <CardAssignee id={item.id} card={item} />
      ),
      resize: true,
    },
    {
      label: "Reviewer",
      renderCell: (item: TableNode) => (
        <CardReviewer id={item.id} card={item} />
      ),
      resize: true,
    },
    {
      label: "Reward",
      renderCell: (item: TableNode) => <CardReward id={item.id} card={item} />,
      resize: true,
    },
    {
      label: "Priority",
      renderCell: (item: TableNode) => (
        <CardPriority id={item.id} card={item} />
      ),
      resize: true,
    },
    {
      label: "Start Date",
      renderCell: (item: TableNode) => (
        <CardStartDate id={item.id} card={item} />
      ),
      resize: true,
    },
    {
      label: "Deadline",
      renderCell: (item: TableNode) => (
        <CardDeadline id={item.id} card={item} />
      ),
      resize: true,
    },
  ];

  const data =
    tasks &&
    Object.values(tasks)?.map((card) => ({
      id: card.id,
      title: card.title,
      type: card.type,
      assignee: card.assignee,
      reviewer: card.reviewer,
      deadline: card.deadline,
      startDate: card.startDate,
      reward: card.reward,
      priority: card.priority,
      slug: card.slug,
    }));

  if (loading || !project.cards) {
    return <SkeletonLoader />;
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <CreateCardModal
            column={project?.columnOrder?.[0]}
            handleClose={() => {
              if (isDirty && !showConfirm) {
                setShowConfirm(true);
              } else {
                setIsOpen(false);
              }
            }}
            setIsDirty={setIsDirty}
            showConfirm={showConfirm}
            setShowConfirm={setShowConfirm}
            setIsOpen={setIsOpen}
          />
        )}
      </AnimatePresence>
      <Container>
        {viewId === "" && (
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            paddingY="2"
          >
            <Button
              prefix={<IconPlusSmall />}
              size="small"
              variant="secondary"
              onClick={() => {
                if (!canDo("createNewCard")) {
                  toast.error(
                    "You don't have permission to add cards in this column",
                    { theme: "dark" }
                  );
                  return;
                }
                setIsOpen(true);
              }}
            >
              Create
            </Button>
          </Box>
        )}
        <CompactTable
          columns={columns}
          theme={theme}
          data={{ nodes: data }}
          layout={{ custom: true, horizontalScroll: true, fixedHeader: true }}
        />
      </Container>
    </>
  );
}

export default memo(TableView);
