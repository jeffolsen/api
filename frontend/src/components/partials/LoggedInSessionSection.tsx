import Grid from "../common/Grid";
import BasicCard from "../cards/BasicCard";
import SectionHeading from "./SectionHeading";
import Button from "../common/Button";
import { useGetProfilesSessions, useLogout } from "../../network/session";
import { LogoutAllSessionsWithSessionForm } from "../forms/LogoutAllSessionsForm";
import Text from "../common/Text";
import Modal from "../layout/Modal";
import { useState } from "react";

function LogoutAllModalContent() {
  return (
    <>
      <Text textSize="lg" className="text-center capitalize">
        logout of all sessions
      </Text>
      <LogoutAllSessionsWithSessionForm
        submitInputConfig={{ text: "Logout", color: "error" }}
      />
    </>
  );
}

function LoggedInSessionSection() {
  const getSessions = useGetProfilesSessions();
  const logout = useLogout();
  const sessions = getSessions?.data?.sessions || [];

  const [openLogoutAllModal, setOpenLogoutAllModal] = useState(false);

  const description = "This lists all your active sessions across devices.";

  return (
    <>
      <div className="flex flex-col gap-4">
        <SectionHeading text="Current Sessions" description={description}>
          <div className="grid gap-1 md:gap-4 grid-cols-2 w-full">
            <Button
              color="error"
              onClick={() => {
                if (
                  confirm("Are you sure you want to logout of this session?")
                ) {
                  logout.mutateAsync();
                }
              }}
            >
              Logout
            </Button>
            <Button
              color="error"
              onClick={() => {
                setOpenLogoutAllModal(true);
              }}
            >
              Logout All
            </Button>
          </div>
        </SectionHeading>
        {sessions && (
          <Grid
            columns={{ md: "2", lg: "3" }}
            items={sessions?.map(
              (session: { userAgent: string; createdAt: string }) => (
                <BasicCard
                  title={session.userAgent}
                  description={new Date(session.createdAt).toLocaleString()}
                />
              ),
            )}
            onEmpty={() => (
              <BasicCard title="No active sessions found." description="" />
            )}
          />
        )}
      </div>
      <Modal isOpen={openLogoutAllModal} setIsOpen={setOpenLogoutAllModal}>
        <LogoutAllModalContent />
      </Modal>
    </>
  );
}

export default LoggedInSessionSection;
