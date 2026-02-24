import BasicCard from "../cards/BasicCard";
import SectionHeading from "./SectionHeading";
import { useGetProfilesApiKeys } from "../../network/apiKey";
import toast from "react-hot-toast";
import { Button } from "../common/Button";
import Loading from "../common/Loading";
import Grid from "../common/Grid";

function LoggedInApiKeySection() {
  const getApiKeys = useGetProfilesApiKeys();
  const apiKeys = getApiKeys.data;

  if (getApiKeys.isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-4">
      <SectionHeading
        text="API Key"
        tooltipText="API keys allow you to authenticate a read-only API session for apps."
      >
        <Button
          color="success"
          onClick={() => {
            toast.error("This feature is not implemented yet.");
          }}
        >
          Generate New API Key
        </Button>
      </SectionHeading>

      <Grid
        columns={{ base: "1", sm: "1", md: "1", lg: "1", xl: "1" }}
        items={apiKeys.map((apiKey: { slug: string; origin: string }) => (
          <BasicCard title={apiKey.slug} description={apiKey.origin} />
        ))}
        onEmpty={() => (
          <BasicCard
            title="No API Keys"
            description="You have not generated any API keys yet."
          />
        )}
      />
    </div>
  );
}

export default LoggedInApiKeySection;
