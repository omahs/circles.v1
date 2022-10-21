import React, {
  createContext,
  memo,
  useContext,
  useState,
  useEffect,
} from "react";
import { Filter } from "@/app/types";
import { ViewMode } from "gantt-task-react";
import { useRouter } from "next/router";
import { io, Socket } from "socket.io-client";

interface GlobalContextType {
  isSidebarExpanded: boolean;
  setIsSidebarExpanded: (isSidebarExpanded: boolean) => void;
  isProfilePanelExpanded: boolean;
  setIsProfilePanelExpanded: (isProfilePanelExpanded: boolean) => void;
  connectedUser: string;
  connectUser: (userId: string) => void;
  disconnectUser: () => void;
  quickProfileUser: string;
  openQuickProfile: (userId: string) => void;
  view: number;
  setView: React.Dispatch<React.SetStateAction<number>>;
  viewName: string;
  setViewName: React.Dispatch<React.SetStateAction<string>>;
  tab: string;
  setTab: React.Dispatch<React.SetStateAction<string>>;
  notifseen: boolean;
  setNotifSeen: React.Dispatch<React.SetStateAction<boolean>>;
  currentFilter: Filter;
  setCurrentFilter: React.Dispatch<React.SetStateAction<Filter>>;
  calendarView: ViewMode;
  setCalendarView: React.Dispatch<React.SetStateAction<ViewMode>>;
  socket: Socket;
  setSocket: React.Dispatch<React.SetStateAction<Socket>>;
  groupBy: "Folder" | "Type";
  setGroupBy: React.Dispatch<React.SetStateAction<"Folder" | "Type">>;
}

const useProviderGlobalContext = () => {
  const router = useRouter();
  const { project: pId } = router.query;

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  // const [registry, setRegistry] = useState<Registry>({} as Registry);
  const [connectedUser, setConnectedUser] = useState("");

  const [isProfilePanelExpanded, setIsProfilePanelExpanded] = useState(false);
  const [quickProfileUser, setQuickProfileUser] = useState("");

  const [groupBy, setGroupBy] = useState<"Folder" | "Type">("Folder");

  const [viewName, setViewName] = useState("" as string);
  const [view, setView] = useState(0);
  const [calendarView, setCalendarView] = useState<ViewMode>(ViewMode.Day);

  const [tab, setTab] = useState("Work");
  const [notifseen, setNotifSeen] = useState(false);

  const [currentFilter, setCurrentFilter] = useState({} as Filter);

  const [socket, setSocket] = useState<Socket>({} as Socket);

  function connectUser(userId: string) {
    setConnectedUser(userId);
  }
  const disconnectUser = () => {
    setConnectedUser("");
  };

  const openQuickProfile = (userId: string) => {
    setIsProfilePanelExpanded(true);
    setQuickProfileUser(userId);
  };

  useEffect(() => {
    const filter = localStorage.getItem(pId as string);
    if (filter == null) {
      setCurrentFilter({} as Filter);
    } else {
      setCurrentFilter(JSON.parse(filter));
    }
  }, [pId]);

  useEffect(() => {
    const socket = io(process.env.API_HOST || "");
    socket.on("connect", function () {
      console.log("Connected");
      setSocket(socket);
    });

    socket.on("disconnect", function () {
      console.log("Disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return {
    isSidebarExpanded,
    setIsSidebarExpanded,
    connectedUser,
    connectUser,
    disconnectUser,
    isProfilePanelExpanded,
    setIsProfilePanelExpanded,
    quickProfileUser,
    openQuickProfile,
    view,
    setView,
    viewName,
    setViewName,
    calendarView,
    setCalendarView,
    tab,
    setTab,
    notifseen,
    setNotifSeen,
    currentFilter,
    setCurrentFilter,
    groupBy,
    setGroupBy,
    socket,
    setSocket,
  };
};

const GlobalContext = createContext<GlobalContextType>({} as GlobalContextType);

export const useGlobal = () => useContext(GlobalContext);

function GlobalContextProvider({ children }: { children: React.ReactNode }) {
  const context = useProviderGlobalContext();

  return (
    <GlobalContext.Provider value={context}>{children}</GlobalContext.Provider>
  );
}

export default memo(GlobalContextProvider);
