import { useState, useEffect } from "react";
import useShowToast from "./useShowToast";
const useFetchUsers = (isOpen, followers, setLoading) => {
  const [fetchedUsers, setFetchedUsers] = useState([]);
  const showToast = useShowToast();
  useEffect(() => {
    setLoading(true);
    const fetchUsers = async () => {
      try {
        const promises = followers.map(async (follower) => {
          const res = await fetch("/api/users/profile/" + follower);
          const data = await res.json();
          return {
            name: data.name,
            image: data.profilePic,
            username: data.username,
          };
        });
        const users = await Promise.all(promises);
        setFetchedUsers(users);
      } catch (error) {
        showToast("Error", error.message, "error");
        setFetchedUsers([]);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchUsers();
    } else {
      setFetchedUsers([]);
    }
  }, [isOpen, followers, showToast]);

  return fetchedUsers;
};

export default useFetchUsers;
