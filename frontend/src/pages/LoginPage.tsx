import LoginForm from "../components/forms/LoginForm";
import RegisterForm from "../components/forms/RegisterForm";
import VerificationCodeForm from "../components/forms/VerificationCodeForm";
import Wrapper from "../components/Wrapper";

function LoginPage() {
  return (
    <Wrapper width="sm">
      <h1 className="text-4xl text-accent">Login or Register</h1>
      <LoginForm />
      <RegisterForm />
      <VerificationCodeForm />
    </Wrapper>
  );
}

export default LoginPage;
