import Form from "./Form";

export type RegisterFormInput = {
  email: string;
  password: string;
  confirmPassword: string;
};

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
const EMAIL_REGEX =
  /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-.]*)[a-z0-9_'+-]@([a-z0-9][a-z0-9-]*\.)+[a-z]{2,}$/i;

function RegisterForm() {
  return (
    <Form
      fields={[
        {
          name: "email",
          placeholder: "Email",
          type: "text",
          registerOptions: {
            required: "Email is required",
            pattern: {
              value: EMAIL_REGEX,
              message: "Invalid Email format",
            },
          },
        },
        {
          name: "password",
          placeholder: "Password",
          type: "text",
          registerOptions: {
            required: "Password is required",
            pattern: {
              value: PASSWORD_REGEX,
              message: "Invalid Password format",
            },
          },
        },
        {
          name: "confirmPassword",
          placeholder: "Confirm Password",
          type: "text",
          registerOptions: {
            required: "Confirm Password is required",
            pattern: {
              value: PASSWORD_REGEX,
              message: "Invalid Password format",
            },
          },
        },
      ]}
      defaultValues={{
        email: "",
        password: "",
        confirmPassword: "",
      }}
      trySubmit={async (args) => {
        console.log(args);
        // await register(args);
      }}
    />
  );
}

export default RegisterForm;
