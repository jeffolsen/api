import { useGetProfilesApiKeys } from "../../network/apiKey";
import {
  OTP_STATUS_CREATE_API_KEY,
  OTP_STATUS_DESTROY_API_KEY,
  useOtpStatus,
} from "../../network/verificationCode";
import {
  GenerateApiKeyWithOTPForm,
  RequestGenerateApiKeyForm,
} from "../forms/GenerateApiKeyForm";
import {
  DestroyApiKeyWithOTPForm,
  RequestDestroyApiKeyForm,
} from "../forms/DestroyApiKeyForm";
import Loading from "../common/Loading";
import Grid from "../common/Grid";
import RevealCard from "../cards/RevealCard";
import SectionHeading from "./SectionHeading";
import Text from "../common/Text";

function LoggedInApiKeySection() {
  const getApiKeys = useGetProfilesApiKeys();
  const apiKeys = getApiKeys.data;
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
        columns={{ base: "1", sm: "1", md: "1", lg: "1", xl: "1" }}
        items={apiKeys.map((apiKey: { slug: string; origin: string }) => (
          <RevealCard
            buttonLabel="Destroy API Key"
            buttonColor="error"
            title={apiKey.slug}
            description={apiKey.origin}
          >
            {otpStatus === OTP_STATUS_DESTROY_API_KEY ? (
              <>
                <Text textSize="sm" className="mt-4">
                  A code has been sent to your email. Please verify it to
                  destroy this API key.
                </Text>
                <DestroyApiKeyWithOTPForm
                  defaultValues={{
                    apiSlug: apiKey.slug,
                    origin: apiKey.origin,
                  }}
                />
              </>
            ) : (
              <RequestDestroyApiKeyForm
                submitButtonColor="error"
                submitButtonText="Destroy API Key"
              />
            )}
          </RevealCard>
        ))}
        onEmpty={() => (
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
                submitButtonText="Generate API Key"
                submitButtonColor="success"
              />
            ) : (
              <RequestGenerateApiKeyForm
                submitButtonText="Generate API Key"
                submitButtonColor="success"
              />
            )}
          </RevealCard>
        )}
      />
    </div>
  );
}

export default LoggedInApiKeySection;
