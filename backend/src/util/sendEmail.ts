import { CodeType } from "../db/client";
import env from "../config/env";
import resend from "../config/resend";
import templates from "./temlates";

const getSender = () =>
  env.NODE_ENV !== "production" ? "onboarding@resend.dev" : env.EMAIL_SENDER;
const getRecipient = (to: string) =>
  env.NODE_ENV !== "production" ? env.EMAIL_SENDER : to;

const getSubject = (topic: CodeType) => topic;

const sendEmail = async (email: string, code: string, codeType: CodeType) => {
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
