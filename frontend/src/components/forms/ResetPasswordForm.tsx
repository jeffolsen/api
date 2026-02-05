import Form from "./Form";

function ResetPasswordForm() {
  return (
    <Form
      fields={[
        { name: "email", placeholder: "Email", type: "email" },
        { name: "password", placeholder: "Password", type: "text" },
        {
          name: "confirmPassword",
          placeholder: "Confirm Password",
          type: "text",
        },
      ]}
      defaultValues={{ email: "", password: "", confirmPassword: "" }}
      trySubmit={async (args) => {
        console.log(args);
        // await resetPassword(args);
      }}
    />
  );
}

export default ResetPasswordForm;
