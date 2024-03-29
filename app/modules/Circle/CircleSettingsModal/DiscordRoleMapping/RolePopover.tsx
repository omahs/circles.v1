import Popover from "@/app/common/components/Popover";
import { PopoverOption } from "@/app/modules/Card/OptionPopover";
import { Box, Tag, Text } from "degen";
import React, { useState } from "react";

type Props = {
  roles: {
    id: string;
    name: string;
  }[];
  circleRole: string;
  roleMap: any;
  setRoleMap: (roleMap: any) => void;
};

export default function RolePopover({
  setRoleMap,
  roleMap,
  circleRole,
  roles,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Popover
      width="fit"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      butttonComponent={
        <Box cursor="pointer" onClick={() => setIsOpen(!isOpen)} padding="1">
          <Tag label="Add" hover>
            <Text>Role</Text>
          </Tag>
        </Box>
      }
    >
      <Box
        backgroundColor="backgroundSecondary"
        borderRadius="2xLarge"
        borderWidth="0.5"
        maxHeight="72"
        overflow="auto"
      >
        {/* <Input label="" placeholder="Search" prefix={<IconSearch />} /> */}
        {roles?.map((role) => (
          <PopoverOption
            onClick={() => {
              if (roleMap[role.id]) {
                setRoleMap({
                  ...roleMap,
                  [role.id]: {
                    ...roleMap[role.id],
                    circleRole: [...roleMap[role.id].circleRole, circleRole],
                  },
                });
              } else {
                setRoleMap({
                  ...roleMap,
                  [role.id]: {
                    circleRole: [circleRole],
                    name: role.name,
                  },
                });
              }
              setIsOpen(false);
            }}
            key={role.id}
          >
            {role.name}
          </PopoverOption>
        ))}
      </Box>
    </Popover>
  );
}
