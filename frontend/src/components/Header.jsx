import { Button, Flex, Link, useColorMode } from "@chakra-ui/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { IoIosNotifications } from "react-icons/io";
import { Link as RouterLink } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import useLogout from "../hooks/useLogout";
import authScreenAtom from "../atoms/authAtom";
import { BsFillChatQuoteFill } from "react-icons/bs";
import {
  MdOutlineSettings,
  MdOutlineDarkMode,
  MdDarkMode,
} from "react-icons/md";
import Search from "./Search";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const logout = useLogout();
  const setAuthScreen = useSetRecoilState(authScreenAtom);

  return (
    <Flex justifyContent={"space-between"} my={6} gap={4}>
      {user && (
        <Link
          as={RouterLink}
          to="/"
          style={{ display: "flex", alignItems: "center" }}
        >
          <AiFillHome size={24} />
        </Link>
      )}
      {!user && (
        <Link
          as={RouterLink}
          to={"/auth"}
          onClick={() => setAuthScreen("login")}
        >
          Login
        </Link>
      )}
      {user && (
        <>
          <Search />
          <Flex alignItems={"center"} gap={4}>
            <Link as={RouterLink} to={`/${user.username}`}>
              <RxAvatar size={24} />
            </Link>
            <Link as={RouterLink} to={`/notifications`}>
              <IoIosNotifications size={24} />
            </Link>
            <Link as={RouterLink} to={`/chat`}>
              <BsFillChatQuoteFill size={24} />
            </Link>
            <Link as={RouterLink} to={`/settings`}>
              <MdOutlineSettings size={24} />
            </Link>
            <Button variant="ghost" size={24} onClick={toggleColorMode}>
              {colorMode === "light" ? <MdOutlineDarkMode /> : <MdDarkMode />}
            </Button>
            <Button variant="ghost" size={24} onClick={logout}>
              <FiLogOut size={24} />
            </Button>
          </Flex>
        </>
      )}

      {!user && (
        <Link
          as={RouterLink}
          to={"/auth"}
          onClick={() => setAuthScreen("signup")}
        >
          Sign up
        </Link>
      )}
    </Flex>
  );
};

export default Header;
