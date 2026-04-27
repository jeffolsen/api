import Grid from "@/components/common/Grid";
import BasicCard from "@/components/cards/BasicCard";
import SectionHeading from "@/components/partials/SectionHeading";
import Button from "@/components/common/Button";
import { useGetProfilesSessions } from "@/network/session";
import { LogoutAllSessionsWithSessionForm } from "@/components/forms/LogoutAllSessionsForm";
import Text from "@/components/common/Text";
import Modal from "@/components/layout/Modal";
import { useState } from "react";
import LogoutButton from "@/components/partials/LogoutButton";

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
  const sessions = getSessions?.data?.sessions || [];

  const [openLogoutAllModal, setOpenLogoutAllModal] = useState(false);

  const description = "This lists all your active sessions across devices.";

  return (
    <>
      <div className="flex flex-col gap-4">
        <SectionHeading text="Current Sessions" description={description}>
          <div className="grid gap-1 md:gap-4 grid-cols-2 w-full">
            <LogoutButton />
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
