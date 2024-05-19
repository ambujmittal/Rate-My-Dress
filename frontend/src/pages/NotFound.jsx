// NotFound.js
import { Box, Heading, Text, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  return (
    <Box
      textAlign="center"
      py={10}
      px={6}
      bg="black"
      color="white"
      height="80vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Heading
        display="inline-block"
        as="h2"
        size="2xl"
        bgGradient="linear(to-r, red.500, yellow.500)"
        bgClip="text"
      >
        404
      </Heading>
      <Text fontSize="2xl" mt={3} mb={2}>
        Oops! The page you&apos;re looking for isn&apos;t here.
      </Text>
      <Text fontSize="sm" color={"gray.400"} mb={6}>
        You might have the wrong address, or the page may have moved.
      </Text>

      <Button
        colorScheme="red"
        bgGradient="linear(to-r, red.400, yellow.400)"
        color="white"
        variant="solid"
        onClick={handleClick}
      >
        Go to Home
      </Button>
    </Box>
  );
};

export default NotFound;
