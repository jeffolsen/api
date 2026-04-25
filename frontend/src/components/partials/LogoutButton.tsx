import Button from "../common/Button";
import { useLogout } from "../../network/session";

function LogoutButton() {
  const logout = useLogout();
  return (
    <Button
      color="error"
      onClick={() => {
        if (confirm("Are you sure you want to logout of this session?")) {
          logout.mutateAsync();
        }
      }}
    >
      Logout
    </Button>
  );
}

export default LogoutButton;
