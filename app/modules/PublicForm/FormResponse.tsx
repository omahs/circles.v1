/* eslint-disable @next/next/no-img-element */
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { FormType, KudosType, UserType } from "@/app/types";
import { TwitterOutlined } from "@ant-design/icons";
import { Box, Heading, Stack, Text } from "degen";
import React, { useState } from "react";
import Confetti from "react-confetti";
import { TwitterShareButton } from "react-share";
import { toast } from "react-toastify";
import { useWindowSize } from "react-use";
import styled from "styled-components";
import mixpanel from "@/app/common/utils/mixpanel";
import { useQuery } from "react-query";

type Props = {
  form: FormType;
  kudos: KudosType;
  setSubmitAnotherResponse: (val: boolean) => void;
  setSubmitted: (val: boolean) => void;
  setUpdateResponse: (val: boolean) => void;
  claimed: boolean;
  setClaimed: (val: boolean) => void;
  setViewResponse: (val: boolean) => void;
};

const StyledImage = styled.img`
  @media (max-width: 768px) {
    width: 12rem;
  }
  width: 24rem;
`;

export default function FormResponse({
  form,
  kudos,
  setSubmitAnotherResponse,
  setSubmitted,
  setUpdateResponse,
  claimed,
  setClaimed,
  setViewResponse,
}: Props) {
  const { width, height } = useWindowSize();
  const [claiming, setClaiming] = useState(false);
  const [claimedJustNow, setClaimedJustNow] = useState(false);

  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });

  return (
    <Box
      padding={{
        xs: "2",
        md: "8",
      }}
    >
      {claimedJustNow && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          gravity={0.07}
          numberOfPieces={600}
        />
      )}
      <Stack align="center">
        <Heading align="center">{`${
          form?.formMetadata.messageOnSubmission ||
          "Your response has been submitted!"
        }`}</Heading>
        <Box
          display="flex"
          flexDirection={{
            xs: "column",
            md: "row",
          }}
          gap="4"
          alignItems="center"
        >
          {kudos?.imageUrl && (claimed || form.formMetadata.canClaimKudos) && (
            <StyledImage src={`${kudos.imageUrl}`} alt="kudos" />
          )}
          {claimed ? (
            <Stack>
              <Text variant="extraLarge" weight="bold">
                You have claimed this Kudos 🎉
              </Text>
              <Box>
                <Stack direction="vertical">
                  <TwitterShareButton
                    url={`https://circles.spect.network/`}
                    title={
                      "I just filled out a web3 enabled form and claimed my Kudos on @JoinSpect via @mintkudosXYZ 🎉"
                    }
                  >
                    <Box
                      width={{
                        xs: "full",
                        md: "72",
                      }}
                    >
                      <PrimaryButton
                        variant="transparent"
                        icon={
                          <TwitterOutlined
                            style={{
                              fontSize: "1.8rem",
                              color: "rgb(29, 155, 240, 1)",
                            }}
                          />
                        }
                      >
                        <Text>Share on Twitter</Text>
                      </PrimaryButton>
                    </Box>
                  </TwitterShareButton>
                  <Box
                    width={{
                      xs: "full",
                      md: "72",
                    }}
                  >
                    <PrimaryButton
                      variant="transparent"
                      icon={<img src="/openseaLogo.svg" alt="src" />}
                      onClick={() => {
                        window.open(
                          `https://opensea.io/assets/matic/0x60576A64851C5B42e8c57E3E4A5cF3CF4eEb2ED6/${kudos.tokenId}`,
                          "_blank"
                        );
                      }}
                    >
                      <Text>View on Opensea</Text>
                    </PrimaryButton>
                  </Box>
                  <Box
                    width={{
                      xs: "full",
                      md: "72",
                    }}
                  >
                    <PrimaryButton
                      variant="transparent"
                      icon={<img src="/raribleLogo.svg" alt="src" />}
                      onClick={() => {
                        window.open(
                          `https://rarible.com/token/polygon/0x60576a64851c5b42e8c57e3e4a5cf3cf4eeb2ed6:${kudos.tokenId}?tab=overview`,
                          "_blank"
                        );
                      }}
                    >
                      {" "}
                      <Text>View on Rarible</Text>
                    </PrimaryButton>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          ) : (
            <Box>
              {form.formMetadata.canClaimKudos && (
                <Stack>
                  <Text weight="semiBold" variant="large">
                    The creator of this form is distributing kudos to everyone
                    that submitted a response 🎉
                  </Text>
                  <Box width="full">
                    <PrimaryButton
                      loading={claiming}
                      onClick={async () => {
                        setClaiming(true);
                        try {
                          const res = await fetch(
                            `${process.env.API_HOST}/collection/v1/${form?.id}/airdropKudos`,
                            {
                              method: "PATCH",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              credentials: "include",
                            }
                          );

                          console.log(res);
                          if (res.ok) {
                            setClaimed(true);
                            setClaimedJustNow(true);
                          }
                        } catch (e) {
                          console.log(e);
                          toast.error(
                            "Something went wrong, please try again later"
                          );
                        }

                        setClaiming(false);
                      }}
                    >
                      Claim Kudos
                    </PrimaryButton>
                  </Box>
                </Stack>
              )}
            </Box>
          )}
        </Box>
        <Box
          width="full"
          display="flex"
          flexDirection="row"
          justifyContent="flex-start"
          marginTop="8"
        >
          <Box
            width="full"
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
          >
            <Stack>
              {form?.formMetadata.updatingResponseAllowed &&
                form?.formMetadata.active && (
                  <PrimaryButton
                    variant="transparent"
                    onClick={() => {
                      setUpdateResponse(true);
                      setSubmitted(false);
                    }}
                  >
                    Update response
                  </PrimaryButton>
                )}
              <PrimaryButton
                variant="transparent"
                onClick={() => {
                  setUpdateResponse(true);
                  setViewResponse(true);
                  setSubmitted(false);
                }}
              >
                View response
              </PrimaryButton>
              {form?.formMetadata.multipleResponsesAllowed &&
                form?.formMetadata.active && (
                  <PrimaryButton
                    variant="transparent"
                    onClick={() => {
                      setSubmitAnotherResponse(true);
                    }}
                  >
                    Submit another response
                  </PrimaryButton>
                )}
              <a href="/" target="_blank">
                <PrimaryButton
                  onClick={() => {
                    process.env.NODE_ENV === "production" &&
                      mixpanel.track("Create your own form", {
                        form: form.name,
                        sybilEnabled: form.formMetadata.sybilProtectionEnabled,
                        user: currentUser?.username,
                      });
                  }}
                >
                  Create your own form
                </PrimaryButton>
              </a>
            </Stack>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}
