import Button from "@/components/common/Button";
import { useLogout } from "@/network/session";

function LogoutButton({ ...props }) {
  const logout = useLogout();
  return (
    <Button
      color="accent"
      onClick={() => {
        if (confirm("Are you sure you want to logout of this session?")) {
          logout.mutateAsync();
        }
      }}
      {...props}
    >
      Logout
    </Button>
  );
}

export default LogoutButton;
