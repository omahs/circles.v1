import Loader from "@/app/common/components/Loader";
import { useGlobal } from "@/app/context/globalContext";
import useConnectDiscord from "@/app/services/Discord/useConnectDiscord";
import useJoinCircle from "@/app/services/JoinCircle/useJoinCircle";
import useExploreOnboarding from "@/app/services/Onboarding/useExploreOnboarding";
import { CircleType } from "@/app/types";
import { Avatar, Box, Button, IconSearch, Input, Stack, Text } from "degen";
import { matchSorter } from "match-sorter";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-grid-system";
import { useQuery } from "react-query";
import { ToastContainer } from "react-toastify";
import styled from "styled-components";
import CircleCard from "./CircleCard";
import Onboarding from "./ExploreOnboarding";
import ExploreOptions from "./ExploreOptions";

const ScrollContainer = styled(Box)`
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  height: calc(100vh - 1rem);
  overflow-y: auto;
`;

const GridContainer = styled(Container)`
  @media only screen and (min-width: 0px) {
    width: calc(100vw - 2rem);
  }
  @media only screen and (min-width: 768px) {
    width: 80rem;
  }
`;

export default function Explore() {
  const { data: circles, isLoading } = useQuery<CircleType[]>(
    "exploreCircles",
    {
      enabled: false,
    }
  );
  const { connectedUser } = useGlobal();
  useJoinCircle();
  const { onboarded } = useExploreOnboarding();

  const [filteredCircles, setFilteredCircles] = useState<CircleType[]>([]);

  useEffect(() => {
    if (circles) {
      setFilteredCircles(circles);
    }
  }, [circles]);

  if (isLoading) {
    return <Loader text="" loading />;
  }

  return (
    <ScrollContainer padding="2" theme="dark">
      {!onboarded && connectedUser && <Onboarding />}
      <ToastContainer
        toastStyle={{
          backgroundColor: "rgb(20,20,20)",
          color: "rgb(255,255,255,0.7)",
        }}
      />
      <GridContainer>
        <Box width="1/2" paddingTop="1" paddingRight="8" paddingBottom="4">
          <Input
            label=""
            placeholder="Explore"
            prefix={<IconSearch />}
            suffix={<ExploreOptions />}
            onChange={(e) => {
              setFilteredCircles(
                matchSorter(circles as CircleType[], e.target.value, {
                  keys: ["name"],
                })
              );
            }}
          />
        </Box>
        <Row>
          {filteredCircles?.map &&
            filteredCircles?.map((circle: CircleType) => (
              <Col key={circle.id} xs={10} sm={6} md={3}>
                <CircleCard
                  href={`/${circle.slug}`}
                  name={circle.name}
                  description={circle.description}
                  gradient={circle.gradient}
                  logo={circle.avatar}
                />
                {/* <Box marginBottom="4">
                    <Stack align="center">
                      <Avatar
                        label={circle.name}
                        src={circle.avatar}
                        size={{ xs: "16", lg: "20" }}
                        placeholder={!circle.avatar}
                      />
                      <Text
                        color="textPrimary"
                        size={{ sm: "base", md: "base", lg: "large" }}
                        wordBreak="break-word"
                        align="center"
                      >
                        {circle.name}
                      </Text>
                      <Button variant="transparent" size="small">
                        <Text>View</Text>
                      </Button>
                    </Stack>
                  </Box> */}
              </Col>
            ))}
        </Row>
      </GridContainer>
    </ScrollContainer>
  );
}
