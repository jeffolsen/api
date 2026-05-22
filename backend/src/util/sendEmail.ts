import { CodeType } from "@db/client";
import env from "@config/env";
import resend from "@config/resend";
import templates from "./templates";
// import { generateApiKeyValue } from "@/services/apiKey";

const getSender = () =>
  env.NODE_ENV !== "production" ? "onboarding@resend.dev" : env.EMAIL_SENDER;
const getRecipient = (to: string) => to;
// env.NODE_ENV !== "production" ? env.EMAIL_SENDER : to;

const SUBJECTS: Record<CodeType, string> = {
  LOGIN: "Your meetjeffolsen.com login code",
  LOGOUT_ALL: "Sign out of all active sessions",
  PASSWORD_RESET: "Password reset code",
  DELETE_PROFILE: "Account deletion confirmation",
  CREATE_API_KEY: "API key management code",
};

const getSubject = (topic: CodeType) => SUBJECTS[topic];

const sendEmail = async (email: string, code: string, codeType: CodeType) => {
  if (env.NODE_ENV !== "production") {
    console.log(
      "sendEmail",
      "from",
      getSender(),
      "to",
      getRecipient(email),
      codeType,
      code,
      // generateApiKeyValue(),
    );
    return true;
  }

  const emailResponse = await resend.emails
    .send({
      from: getSender(),
      to: getRecipient(email),
      subject: getSubject(codeType),
      html: templates[codeType](codeType, code),
    })
    .catch(() => false);

  return emailResponse;
};

export default sendEmail;
