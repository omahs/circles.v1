import { Action } from "@/app/types";
import CreateCard from "./CreateCard";
import CreateDiscordChannel from "./CreateDiscordChannel";
import GiveDiscordRole from "./GiveDiscordRole";
import GiveRole from "./GiveRole";
import SendEmail from "./SendEmail";

type Props = {
  actionType: string;
  actionMode: "edit" | "create";
  action: Action;
  setAction: (action: Action) => void;
};

export default function SingleAction({
  actionType,
  actionMode,
  action,
  setAction,
}: Props) {
  return (
    <>
      {actionType === "giveRole" && (
        <GiveRole
          action={action}
          actionMode={actionMode}
          setAction={setAction}
        />
      )}
      {actionType === "sendEmail" && (
        <SendEmail
          action={action}
          actionMode={actionMode}
          setAction={setAction}
        />
      )}
      {actionType === "createDiscordChannel" && (
        <CreateDiscordChannel
          action={action}
          actionMode={actionMode}
          setAction={setAction}
        />
      )}
      {actionType === "giveDiscordRole" && (
        <GiveDiscordRole
          action={action}
          actionMode={actionMode}
          setAction={setAction}
        />
      )}
      {actionType === "createCard" && (
        <CreateCard
          action={action}
          actionMode={actionMode}
          setAction={setAction}
        />
      )}
    </>
  );
}
