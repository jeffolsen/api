import Grid from "../common/Grid";
import BasicCard from "../cards/BasicCard";
import SectionHeading from "./SectionHeading";
import { Button } from "../common/Button";
import { useGetProfilesSessions, useLogout } from "../../network/session";
import { useModalContext } from "../../contexts/ModalContext";
import EmptyModal, { EmptyModalProps } from "../modals/EmptyModal";
import { LogoutAllSessionsWithSessionForm } from "../forms/LogoutAllSessionsForm";
import Text from "../common/Text";

function LogoutAllModalContent() {
  return (
    <>
      <Text textSize="lg" className="text-center capitalize">
        logout of all sessions
      </Text>
      <LogoutAllSessionsWithSessionForm
        submitButtonText="Logout"
        submitButtonColor="error"
      />
    </>
  );
}

function LoggedInSessionSection() {
  const getSessions = useGetProfilesSessions();
  const logout = useLogout();
  const sessions = getSessions.data;
  const { enqueueModals } = useModalContext();

  const description = "This lists all your active sessions across devices.";

  return (
    <div className="flex flex-col gap-4">
      <SectionHeading text="Current Sessions" description={description}>
        <div className="grid gap-4 grid-cols-2 w-full">
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
          <Button
            color="error"
            onClick={() => {
              enqueueModals([
                {
                  component: EmptyModal,
                  props: {
                    children: <LogoutAllModalContent />,
                  } as EmptyModalProps,
                },
              ]);
            }}
          >
            Logout All Sessions
          </Button>
        </div>
      </SectionHeading>
      {sessions && (
        <Grid
          columns={{ base: "1", sm: "1", md: "2", lg: "3", xl: "3" }}
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
  );
}

export default LoggedInSessionSection;
