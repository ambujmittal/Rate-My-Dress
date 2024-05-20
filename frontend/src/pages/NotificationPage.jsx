import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Flex,
  Text,
  Spinner,
  IconButton,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { IoSettingsOutline } from "react-icons/io5";
import { FaUser, FaHeart, FaComment } from "react-icons/fa";
import useShowToast from "../hooks/useShowToast";
import { formatDistanceToNow } from "date-fns";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

const NotificationPage = () => {
  const toast = useShowToast();
  const currentUser = useRecoilValue(userAtom);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/notifications");
        const data = await res.json();
        if (data.error) {
          toast("Error", data.error, "error");
          return;
        }
        setNotifications(data);
      } catch (error) {
        toast("Error", error.message, "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotifications();
  }, [toast]);

  const deleteNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/notifications", {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.error) {
        toast("Error", data.error, "error");
        return;
      }
      setNotifications([]);
      toast("Success", "Notifications deleted successfully", "success");
    } catch (error) {
      toast("An error occurred", error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const bg = useColorModeValue("white", "black");
  const iconFollowColor = useColorModeValue("blue.500", "blue.300");
  const iconLikeColor = useColorModeValue("red.500", "red.300");
  const iconCommentColor = useColorModeValue("black", "white");
  const boxShadowHover = useColorModeValue(
    "0px 4px 12px rgba(0, 0, 0, 0.2)",
    "0px 4px 12px rgba(255, 255, 255, 0.2)"
  );

  return (
    <Box flex="4" minH="100vh" bg={bg}>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        p="4"
        borderBottom="1px"
        borderColor={useColorModeValue("gray.200", "gray.700")}
        bg={bg}
        boxShadow="sm"
      >
        <Text fontSize="xl" fontWeight="bold">
          Notifications
        </Text>
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<IoSettingsOutline />}
            variant="outline"
          />
          <MenuList>
            <MenuItem onClick={deleteNotifications}>
              Delete all notifications
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
      {isLoading ? (
        <Flex justifyContent="center" alignItems="center" height="100%">
          <Spinner size="xl" />
        </Flex>
      ) : (
        <>
          {notifications.length === 0 ? (
            <Box textAlign="center" p="4" fontWeight="bold">
              No notifications 🤔
            </Box>
          ) : (
            <VStack spacing="4" p="4">
              {notifications.map((notification) => (
                <Box
                  key={notification._id}
                  w="full"
                  p="2"
                  bg={bg}
                  borderRadius="md"
                  boxShadow="sm"
                  _hover={{ boxShadow: boxShadowHover }}
                >
                  <Link
                    to={
                      notification.type === "follow"
                        ? `/${notification.from.username}`
                        : `/${currentUser.username}/post/${notification.postId}`
                    }
                  >
                    <HStack justifyContent="space-between">
                      <HStack spacing="4">
                        <Icon
                          as={
                            notification.type === "follow"
                              ? FaUser
                              : notification.type === "like"
                              ? FaHeart
                              : FaComment
                          }
                          w="5"
                          h="5"
                          color={
                            notification.type === "follow"
                              ? iconFollowColor
                              : notification.type === "like"
                              ? iconLikeColor
                              : iconCommentColor
                          }
                        />

                        <Avatar
                          name={notification.from.username}
                          src={
                            notification.from.profilePic ||
                            "https://bit.ly/broken-link"
                          }
                          size="md"
                        />

                        <HStack align="start" spacing="1">
                          <Text fontWeight="bold">
                            {notification.from.username}
                          </Text>

                          <Text>
                            {notification.type === "follow"
                              ? "followed you"
                              : notification.type === "like"
                              ? "liked your post"
                              : "commented on your post"}
                          </Text>
                        </HStack>
                      </HStack>
                      <Text fontSize={"xs"} color={"gray.light"} mr={2}>
                        {formatDistanceToNow(new Date(notification.createdAt))}{" "}
                        ago
                      </Text>
                    </HStack>
                  </Link>
                </Box>
              ))}
            </VStack>
          )}
        </>
      )}
    </Box>
  );
};

export default NotificationPage;
