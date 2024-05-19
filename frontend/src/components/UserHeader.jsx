import { Avatar } from "@chakra-ui/avatar";
import { Box, Flex, Link, Text, VStack } from "@chakra-ui/layout";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { Portal } from "@chakra-ui/portal";
import {
  List,
  ListItem,
  Button,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  HStack,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
import useFollowUnfollow from "../hooks/useFollowUnfollow";
import useFetchUsers from "../hooks/useFetchUsers";
import { useState } from "react";

const UserHeader = ({ user }) => {
  const toast = useToast();
  const currentUser = useRecoilValue(userAtom);
  const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const {
    isOpen: isOpenFollowers,
    onOpen: onOpenFollowers,
    onClose: onCloseFollowers,
  } = useDisclosure();

  const OverlayTwo = () => (
    <ModalOverlay
      bg="blackAlpha.300"
      backdropFilter="blur(10px) hue-rotate(90deg)"
    />
  );

  const copyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      toast({
        title: "Success.",
        status: "success",
        description: "Profile link copied to clipboard.",
        duration: 1000,
        isClosable: true,
      });
    });
  };

  const followers = useFetchUsers(isOpenFollowers, user.followers, setLoading);
  const followings = useFetchUsers(isOpen, user.following, setLoading);

  return (
    <VStack gap={3} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"xl"} fontWeight={"bold"}>
            {user.name}
          </Text>
          <Text fontSize={"md"} color={"white.dark"} borderRadius={"full"}>
            {`@${user.username}`}
          </Text>
        </Box>
        <Box>
          {user.profilePic && (
            <Avatar
              name={user.name}
              src={user.profilePic}
              size={{
                base: "md",
                md: "lg",
              }}
            />
          )}
          {!user.profilePic && (
            <Avatar
              name={user.name}
              src="https://bit.ly/broken-link"
              size={{
                base: "md",
                md: "lg",
              }}
            />
          )}
        </Box>
      </Flex>

      <Text>{user.bio}</Text>

      {currentUser?._id === user._id && (
        <Link as={RouterLink} to="/update">
          <Button size={"sm"}>Update Profile</Button>
        </Link>
      )}
      {currentUser?._id !== user._id && (
        <Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>
          {following ? "Unfollow" : "Follow"}
        </Button>
      )}
      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Button
            variant="link"
            _hover={{ textDecoration: "no-underline" }}
            onClick={() => {
              onOpenFollowers();
            }}
          >
            <Text color={"gray.light"}>{user.followers.length} followers</Text>
          </Button>
          <Modal isCentered isOpen={isOpenFollowers} onClose={onCloseFollowers}>
            <OverlayTwo />
            <ModalContent>
              <ModalHeader>Followers</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {loading ? (
                  <Center>
                    <Spinner
                      thickness="4px"
                      speed="0.65s"
                      emptyColor="gray.200"
                      color="blue.500"
                      size="xl"
                    />
                  </Center>
                ) : (
                  followers.map((follower) => {
                    return (
                      <>
                        <List>
                          <ListItem style={{ marginBottom: "10px" }}>
                            <HStack spacing="16px">
                              <Box>
                                <Avatar
                                  name={follower.name}
                                  src={follower.image}
                                  size="xs"
                                />
                              </Box>
                              <Box onClick={onCloseFollowers}>
                                <RouterLink
                                  to={`${window.location.origin}/${follower.username}`}
                                >
                                  {follower.name}
                                </RouterLink>
                              </Box>
                            </HStack>
                          </ListItem>
                        </List>
                      </>
                    );
                  })
                )}
              </ModalBody>

              <ModalFooter>
                <Button onClick={onCloseFollowers}>Close</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          <Box w="1" h="1" bg={"gray.light"} borderRadius={"full"}></Box>
          <Button
            variant="link"
            _hover={{ textDecoration: "no-underline" }}
            onClick={() => {
              onOpen();
            }}
          >
            <Text color={"gray.light"}>{user.following.length} following</Text>
          </Button>
          <Modal isCentered isOpen={isOpen} onClose={onClose}>
            <OverlayTwo />
            <ModalContent>
              <ModalHeader>Following</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {loading ? (
                  <Center>
                    <Spinner
                      thickness="4px"
                      speed="0.65s"
                      emptyColor="gray.200"
                      color="blue.500"
                      size="xl"
                    />
                  </Center>
                ) : (
                  followings.map((following) => {
                    return (
                      <>
                        <List>
                          <ListItem style={{ marginBottom: "10px" }}>
                            <HStack spacing="16px">
                              <Box>
                                <Avatar
                                  name={following.name}
                                  src={following.image}
                                  size="xs"
                                />
                              </Box>
                              <Box onClick={onClose}>
                                <RouterLink
                                  to={`${window.location.origin}/${following.username}`}
                                >
                                  {following.name}
                                </RouterLink>
                              </Box>
                            </HStack>
                          </ListItem>
                        </List>
                      </>
                    );
                  })
                )}
              </ModalBody>
              <ModalFooter>
                <Button onClick={onClose}>Close</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Flex>
        <Flex>
          {user.instagram && (
            <Box className="icon-container">
              <Link href={user.instagram} isExternal>
                <BsInstagram size={24} cursor={"pointer"} />
              </Link>
            </Box>
          )}
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList bg={"gray.dark"}>
                  <MenuItem bg={"gray.dark"} onClick={copyURL}>
                    Copy profile link
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>

      <Flex w={"full"}>
        <Flex
          flex={1}
          borderBottom={"1.5px solid white"}
          justifyContent={"center"}
          pb="3"
        >
          <Text fontWeight={"bold"}> Posts</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;
