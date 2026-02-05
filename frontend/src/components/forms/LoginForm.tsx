import Form from "./Form";

function LoginForm() {
  return (
    <Form
      fields={[
        { name: "email", placeholder: "Email", type: "email" },
        { name: "password", placeholder: "Password", type: "text" },
      ]}
      defaultValues={{ email: "", password: "" }}
      trySubmit={async (args) => {
        console.log(args);
        // await login(args);
      }}
    />
  );
}

export default LoginForm;
