import { useState } from "react";
import {
  Input,
  InputGroup,
  InputLeftElement,
  IconButton,
  Box,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import useShowToast from "../hooks/useShowToast";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchingUser, setSearchingUser] = useState(false);
  const showToast = useShowToast();
  const navigate = useNavigate();
  const handleSearch = async () => {
    setSearchingUser(true);
    try {
      const res = await fetch(`/api/users/profile/${searchQuery}`);
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      navigate(`/${data.username}`);
      setSearchQuery("");
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setSearchingUser(false);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    setSearchQuery(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Box width="400px">
      <InputGroup size="sm">
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.300" />
        </InputLeftElement>
        <Input
          type="text"
          placeholder="Search for a user"
          value={searchQuery}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          size="sm"
          borderRadius="full"
        />
        <IconButton
          aria-label="Search"
          icon={<SearchIcon />}
          onClick={handleSearch}
          size="sm"
          ml={2}
          borderRadius="full"
          isLoading={searchingUser}
        />
      </InputGroup>
    </Box>
  );
};

export default Search;
