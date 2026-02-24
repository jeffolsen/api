import Grid from "../common/Grid";
import BasicCard from "../cards/BasicCard";
import SectionHeading from "./SectionHeading";
import Wrapper from "../common/Wrapper";
import { RequestLogoutAllSessionsForm } from "../forms/LogoutAllSessionsForm";
import { useGetProfilesSessions, useLogout } from "../../network/session";
import { useState } from "react";
import { Button } from "../common/Button";

function LoggedInSessionSection() {
  const getSessions = useGetProfilesSessions();
  const sessions = getSessions.data;
  const logout = useLogout();

  const [showLogoutAllSessions, setShowLogoutAllSessions] =
    useState<boolean>(false);

  const tooltipText =
    "This lists all your active sessions across devices. If you see any unfamiliar sessions, consider logging out of all sessions and changing your password.";

  return (
    <div className="flex flex-col gap-4">
      <SectionHeading text="Current Sessions" tooltipText={tooltipText}>
        <Button
          color="error"
          onClick={() => {
            logout.mutateAsync();
          }}
        >
          Logout This Session
        </Button>
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
      <Wrapper width="xs">
        {showLogoutAllSessions ? (
          <div className="relative mt-8">
            <Button
              size="xs"
              className="btn-circle btn-ghost border-white/50 absolute -right-6 -top-6"
              onClick={() => setShowLogoutAllSessions(false)}
            >
              ✕
            </Button>
            <RequestLogoutAllSessionsForm />
          </div>
        ) : (
          <Button color="error" onClick={() => setShowLogoutAllSessions(true)}>
            Logout of all sessions
          </Button>
        )}
      </Wrapper>
    </div>
  );
}

export default LoggedInSessionSection;
