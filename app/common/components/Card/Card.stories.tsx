import React from "react";
import { Story, Meta } from "@storybook/react";

import Card, { CardProps } from ".";
import { Avatar, Box, Button, Stack, Text } from "degen";
// import * as DependentStories from './Dependent.stories'

export default {
  title: "Card",
  component: Card,
  args: {
    href: "/",
    height: "60",
  },
} as Meta;

const Template: Story<CardProps> = (args) => <Card {...args} />;

export const Default = Template.bind({});
Default.args = {
  href: "/",
  height: "60",
  children: (
    <Box marginBottom="4">
      <Stack align="center">
        <Avatar
          label="Remy Sharp"
          src={
            "https://ipfs.moralis.io:2053/ipfs/QmVYsa4KQyRwBSJxQCmD1rDjyqYd1HJKrDfqLk3KMKLEhn"
          }
          size="20"
        />
        <Text color="textPrimary" size="large" letterSpacing="0.03" ellipsis>
          {"Spect Circle"}
        </Text>
        <Button variant="tertiary" size="small">
          Follow
        </Button>
      </Stack>
    </Box>
  ),
};

export const CardButton = Template.bind({});
CardButton.args = {
  href: "/",
  height: "32",
  children: (
    <Box width="32">
      <Stack align="center">
        <Text>Test Project 1</Text>
      </Stack>
    </Box>
  ),
};
