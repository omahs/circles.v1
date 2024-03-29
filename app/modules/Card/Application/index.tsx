import { Box, Text } from "degen";
import { motion } from "framer-motion";
import { useLocalCard } from "../../Project/CreateCardModal/hooks/LocalCardContext";
import { fadeVariant } from "../Utils/variants";
import ApplicationItem from "./ApplicationItem";

export default function Application() {
  const { application, applicationOrder, card } = useLocalCard();
  return (
    <motion.main
      variants={fadeVariant}
      initial="hidden"
      animate="enter"
      exit="exit"
      transition={{ type: "linear" }}
      className=""
      key="editor"
    >
      <Box>
        {card?.myApplication && (
          <ApplicationItem
            key={card.myApplication.applicationId}
            application={card.myApplication}
          />
        )}
        {!card?.myApplication &&
          applicationOrder.map((applicationId) => (
            <ApplicationItem
              key={applicationId}
              application={application[applicationId]}
            />
          ))}
        {applicationOrder.length === 0 && (
          <Text variant="large" weight="semiBold">
            No Applications received yet
          </Text>
        )}
      </Box>
    </motion.main>
  );
}
