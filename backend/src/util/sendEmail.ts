import { CodeType } from "../db/client";

const sendEmail = (email: string, code: string, codeType: CodeType) => {
  console.log(`SENDING CODE: ${code} TO EMAIL: ${email} FOR: ${codeType}`);
};

export default sendEmail;
