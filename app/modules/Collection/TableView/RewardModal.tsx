/* eslint-disable @typescript-eslint/no-explicit-any */
import Modal from "@/app/common/components/Modal";
import { Reward } from "@/app/types";
import { Box } from "degen";
import React, { memo, useState } from "react";
import RewardField from "../../PublicForm/RewardField";

type Props = {
  form: any;
  collectionData: any[] | undefined;
  dataId?: string;
  propertyName: string;
  handleClose: (reward: Reward, dataId: string, propertyName: string) => void;
};

function RewardModal({
  propertyName,
  dataId,
  handleClose,
  form,
  collectionData,
}: Props) {
  const [data, setData] = useState(
    dataId ? collectionData?.find((data) => data.id === dataId) : undefined
  );

  return (
    <Modal
      handleClose={() => {
        handleClose(
          {
            chain: data[propertyName].chain,
            token: data[propertyName].token,
            value: parseFloat(data[propertyName].value),
          },
          dataId || "",
          propertyName
        );
      }}
      title="Reward"
    >
      <Box padding="8">
        <RewardField
          rewardOptions={form.properties[propertyName].rewardOptions}
          propertyName={propertyName}
          data={data}
          updateData={(reward: Reward) => {
            setData({
              ...data,
              [propertyName]: reward,
            });
          }}
        />
      </Box>
    </Modal>
  );
}

export default memo(RewardModal);
