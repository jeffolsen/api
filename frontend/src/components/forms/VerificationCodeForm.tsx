import Form from "./Form";

function VerificationCodeForm() {
  return (
    <Form
      fields={[{ name: "code", placeholder: "Code", type: "text" }]}
      defaultValues={{ code: "" }}
      trySubmit={async (args) => {
        console.log(args);
        // await submitCode(args);
      }}
    />
  );
}

export default VerificationCodeForm;
