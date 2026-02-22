import BasicCard from "../cards/BasicCard";
import SectionHeading from "./SectionHeading";
import { useGetProfilesApiKeys } from "../../network/apiKey";
import toast from "react-hot-toast";
import { Button } from "../common/Button";

function LoggedInApiKeySection() {
  const getApiKeys = useGetProfilesApiKeys();
  const apiKeys = getApiKeys.data;

  return (
    <div className="flex flex-col gap-4">
      <SectionHeading text="API Key">
        <Button
          color="success"
          onClick={() => {
            toast.error("This feature is not implemented yet.");
          }}
        >
          Generate New API Key
        </Button>
      </SectionHeading>
      {apiKeys?.length ? (
        <></>
      ) : (
        <BasicCard
          title="No API Keys"
          description="You have not generated any API keys yet."
        />
      )}
    </div>
  );
}

export default LoggedInApiKeySection;
