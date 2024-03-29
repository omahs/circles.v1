/* eslint-disable @typescript-eslint/no-explicit-any */
import Modal from "@/app/common/components/Modal";
import { Milestone } from "@/app/types";
import { Box } from "degen";
import { memo, useState } from "react";
import MilestoneField from "../../PublicForm/MilestoneField";

type Props = {
  form: any;
  dataId: string;
  propertyName: string;
  handleClose: (
    value: Milestone[],
    dataId: string,
    propertyName: string
  ) => void;
  disabled?: boolean;
};

function MultiMilestoneModal({
  propertyName,
  dataId,
  form,
  handleClose,
  disabled,
}: Props) {
  console;
  const [value, setValue] = useState(form.data[dataId]);

  return (
    <Modal
      handleClose={() => {
        value
          ? handleClose(value[propertyName], dataId, propertyName)
          : handleClose([], dataId, propertyName);
      }}
      title="Edit Milestones"
    >
      <Box
        padding="8"
        width="full"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
        gap="4"
      >
        <MilestoneField
          form={form}
          dataId={dataId}
          propertyName={propertyName}
          data={value}
          setData={setValue}
          showDescription={true}
          disabled={disabled}
        />
      </Box>
    </Modal>
  );
}

export default memo(MultiMilestoneModal);
