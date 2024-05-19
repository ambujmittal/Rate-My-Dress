import { Button, Center, Text } from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
import useLogout from "../hooks/useLogout";

export const SettingsPage = () => {
  const showToast = useShowToast();
  const logout = useLogout();

  const freezeAccount = async () => {
    if (
      !window.confirm(
        "Your account will no longer be accessible to other users until you unfreeze it. Do you wish to continue?"
      )
    )
      return;

    try {
      const res = await fetch("/api/users/freeze", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (data.error) {
        return showToast("Error", data.error, "error");
      }
      if (data.success) {
        await logout();
        showToast("Success", "Your account has been frozen", "success");
      }
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  return (
    <Center>
      <Text my={1} fontWeight={"bold"}>
        Freeze Your Account
      </Text>
      <Text my={1} mr={2}>
        You can unfreeze your account anytime by logging in.
      </Text>
      <Button size={"sm"} colorScheme="red" onClick={freezeAccount}>
        Freeze
      </Button>
    </Center>
  );
};
