import queryClient from "@/app/common/utils/queryClient";
import { useGlobal } from "@/app/context/globalContext";
import { CollectionType } from "@/app/types";
import _ from "lodash";
import { useRouter } from "next/router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";

type LocalCollectionContextType = {
  localCollection: CollectionType;
  setLocalCollection: React.Dispatch<React.SetStateAction<CollectionType>>;
  error: boolean;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  updateCollection: (collection: CollectionType) => void;
  updating: boolean;
  setUpdating: React.Dispatch<React.SetStateAction<boolean>>;
  view: number;
  setView: React.Dispatch<React.SetStateAction<number>>;
  projectViewId: string;
  setProjectViewId: React.Dispatch<React.SetStateAction<string>>;
  searchFilter: string;
  setSearchFilter: React.Dispatch<React.SetStateAction<string>>;
  showMyTasks: boolean;
  setShowMyTasks: React.Dispatch<React.SetStateAction<boolean>>;
};

export const LocalCollectionContext = createContext<LocalCollectionContextType>(
  {} as LocalCollectionContextType
);

export function useProviderLocalCollection() {
  const router = useRouter();
  const { collection: colId } = router.query;
  const { refetch: fetchCollection } = useQuery<CollectionType>(
    ["collection", colId],
    () =>
      fetch(`${process.env.API_HOST}/collection/v1/slug/${colId as string}`, {
        credentials: "include",
      }).then((res) => {
        if (res.status === 403) return { unauthorized: true };
        return res.json();
      }),
    {
      enabled: false,
    }
  );

  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [localCollection, setLocalCollection] = useState({} as CollectionType);
  const [error, setError] = useState(false);
  const [view, setView] = useState(0);
  const { socket, connectedUser } = useGlobal();
  const [projectViewId, setProjectViewId] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [showMyTasks, setShowMyTasks] = useState(false);

  const updateCollection = (collection: CollectionType) => {
    queryClient.setQueryData(["collection", colId], collection);
    setLocalCollection(collection);
  };

  useEffect(() => {
    if (colId) {
      setLoading(true);
      fetchCollection()
        .then((res) => {
          if (res.data) {
            setLocalCollection(res.data);
            if (res.data.collectionType === 1) {
              setProjectViewId(res.data.projectMetadata.viewOrder[0]);
            }
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          toast.error("Something went wrong", {
            theme: "dark",
          });
          setLoading(false);
        });
    }
  }, [colId, fetchCollection]);

  useEffect(() => {
    if (socket && socket.on && localCollection.slug) {
      socket.on(
        `${localCollection.slug}:dataAdded`,
        (collection: CollectionType) => {
          console.log("data added event");
          updateCollection(collection);
        }
      );
      socket.on(
        `${localCollection.slug}:newActivityPrivate`,
        _.debounce((event: { data: CollectionType; user: string }) => {
          if (event.user !== connectedUser) {
            console.log("update event");
            updateCollection(event.data);
          }
        }, 2000)
      );
    }
    return () => {
      if (socket && socket.off) {
        socket.off(`${localCollection.slug}:dataAdded`);
        socket.off(`${localCollection.slug}:newActivityPrivate`);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localCollection.slug]);

  return {
    localCollection,
    setLocalCollection,
    error,
    setError,
    loading,
    updateCollection,
    updating,
    setUpdating,
    view,
    setView,
    projectViewId,
    setProjectViewId,
    searchFilter,
    setSearchFilter,
    showMyTasks,
    setShowMyTasks,
  };
}

export const useLocalCollection = () => useContext(LocalCollectionContext);
