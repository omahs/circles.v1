import Dropdown from "@/app/common/components/Dropdown";
import Editor from "@/app/common/components/Editor";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import RewardField from "@/app/modules/PublicForm/RewardField";
import { CollectionType, MemberDetails } from "@/app/types";
import { Box, IconPlusSmall, Input, useTheme } from "degen";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { DateInput } from "../../Form/Field";

type Props = {
  collection: CollectionType;
  propertyId: string;
  type: string;
  data: any;
  setData: (value: any) => void;
};

export function Field({ collection, propertyId, type, data, setData }: Props) {
  const { mode } = useTheme();
  const router = useRouter();
  const { circle: cId } = router.query;

  const { data: memberDetails } = useQuery<MemberDetails>(
    ["memberDetails", cId],
    {
      enabled: false,
    }
  );
  const memberOptions = memberDetails?.members?.map((member: string) => ({
    label: memberDetails && memberDetails.memberDetails[member]?.username,
    value: member,
  }));

  return (
    <>
      {type === "shortText" && (
        <Input
          label=""
          placeholder={`Enter text`}
          value={data}
          onChange={(e) => setData(e.target.value)}
        />
      )}
      {type === "email" && (
        <Input
          label=""
          placeholder={`Enter email`}
          value={data}
          inputMode="email"
          onChange={(e) => setData(e.target.value)}
        />
      )}
      {type === "singleURL" && (
        <Input
          label=""
          placeholder={`Enter url`}
          value={data}
          inputMode="text"
          onChange={(e) => setData(e.target.value)}
        />
      )}
      {type === "multiURL" && (
        <Input
          label=""
          placeholder={`Enter url`}
          value={data?.[0]}
          inputMode="text"
          onChange={(e) => setData(e.target.value)}
        />
      )}
      {type === "number" && (
        <Input
          label=""
          placeholder={`Enter number`}
          value={data}
          onChange={(e) => setData(e.target.value)}
          type="number"
        />
      )}
      {type === "date" && (
        <DateInput
          placeholder={`Enter date`}
          value={data}
          onChange={(e) => setData(e.target.value)}
          type="date"
          mode={mode}
        />
      )}
      {type === "ethAddress" && (
        <Input
          label=""
          placeholder={`Enter eth address`}
          value={data}
          onChange={(e) => setData(e.target.value)}
        />
      )}
      {type === "longText" && (
        <Box
          width="full"
          borderWidth="0.375"
          padding="4"
          borderRadius="large"
          maxHeight="64"
          overflow="auto"
          id="editorContainer"
        >
          <Editor
            placeholder={`Enter text`}
            isDirty={true}
            onChange={(v) => setData(v)}
          />
        </Box>
      )}
      {(type === "singleSelect" ||
        type === "user" ||
        type === "multiSelect" ||
        type === "user[]") && (
        <Box width="full">
          <Dropdown
            placeholder={`Select option`}
            multiple={type === "multiSelect" || type === "user[]"}
            options={
              type === "user" || type === "user[]"
                ? (memberOptions as any)
                : collection.properties[propertyId]?.options
            }
            selected={data}
            onChange={(value: any) => {
              setData(value);
            }}
            portal={false}
          />
        </Box>
      )}
      {type === "reward" && (
        <Box>
          <RewardField
            form={collection}
            propertyName={collection.properties[propertyId]?.name}
            data={{}}
            updateData={(reward) => {
              setData(reward);
            }}
          />
        </Box>
      )}
      {type === "milestone" && (
        <Box width="full">
          <PrimaryButton
            variant="tertiary"
            icon={<IconPlusSmall />}
            onClick={async () => {}}
          >
            Add new milestone
          </PrimaryButton>
        </Box>
      )}
    </>
  );
}