import { useGetProfilesApiKeys } from "@/network/apiKey";
import {
  OTP_STATUS_CREATE_API_KEY,
  OTP_STATUS_DESTROY_API_KEY,
  useOtpStatus,
} from "@/network/verificationCode";
import {
  GenerateApiKeyWithOTPForm,
  RequestGenerateApiKeyForm,
} from "@/components/forms/GenerateApiKeyForm";
import {
  DestroyApiKeyWithOTPForm,
  RequestDestroyApiKeyForm,
} from "@/components/forms/DestroyApiKeyForm";
import Loading from "@/components/common/Loading";
import Grid from "@/components/common/Grid";
import RevealCard from "@/components/cards/RevealCard";
import SectionHeading from "@/components/partials/SectionHeading";
import Text from "@/components/common/Text";

function LoggedInApiKeySection() {
  const getApiKeys = useGetProfilesApiKeys();
  const apiKeys = getApiKeys.data?.apiKeys || [];
  const otpStatus = useOtpStatus();

  if (getApiKeys.isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        text="API Key"
        description="API keys allow you to authenticate a read-only API session for apps."
      />
      <Grid
        items={apiKeys.map((apiKey: { slug: string; origin: string }) => (
          <ApiKeyCard
            key={apiKey.slug}
            slug={apiKey.slug}
            origin={apiKey.origin}
            otpStatus={otpStatus}
          />
        ))}
        onEmpty={() => <ApiKeyInstructionCard otpStatus={otpStatus} />}
      />
    </div>
  );
}

const ApiKeyCard = ({
  slug,
  origin,
  otpStatus,
}: {
  slug: string;
  origin: string;
  otpStatus: string;
}) => {
  return (
    <RevealCard
      buttonLabel="Destroy API Key"
      buttonColor="error"
      title={slug}
      description={origin}
    >
      {otpStatus === OTP_STATUS_DESTROY_API_KEY ? (
        <>
          <Text textSize="sm" className="mt-4">
            A code has been sent to your email. Please verify it to destroy this
            API key.
          </Text>
          <DestroyApiKeyWithOTPForm
            submitInputConfig={{
              color: "error",
              text: "Destroy API Key",
            }}
            defaultValues={{
              apiSlug: slug,
              origin: origin,
            }}
          />
        </>
      ) : (
        <RequestDestroyApiKeyForm
          submitInputConfig={{
            color: "error",
            text: "Destroy API Key",
          }}
        />
      )}
    </RevealCard>
  );
};

const ApiKeyInstructionCard = ({ otpStatus }: { otpStatus: string }) => {
  return (
    <RevealCard
      buttonLabel="Generate API Key"
      buttonColor="success"
      title="No API Keys"
      description={
        otpStatus === OTP_STATUS_CREATE_API_KEY
          ? "A code has been sent to your email. Please verify it to generate an API key."
          : "You currently have no API keys. Generate one to get started!"
      }
    >
      {otpStatus === OTP_STATUS_CREATE_API_KEY ? (
        <GenerateApiKeyWithOTPForm
          submitInputConfig={{
            color: "success",
            text: "Generate API Key",
          }}
        />
      ) : (
        <RequestGenerateApiKeyForm
          submitInputConfig={{
            color: "success",
            text: "Generate API Key",
          }}
        />
      )}
    </RevealCard>
  );
};

export default LoggedInApiKeySection;
