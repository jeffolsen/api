import LoginForm from "../components/forms/LoginForm";
import RegisterForm from "../components/forms/RegisterForm";
import VerificationCodeForm from "../components/forms/VerificationCodeForm";
import Wrapper from "../components/common/Wrapper";
import Heading from "../components/common/Heading";

function LoginPage() {
  return (
    <Wrapper width="sm">
      <Heading
        headingSize="lg"
        headingStyles={"uppercase font-bold text-rimary-content"}
        headingDecorator="underline"
      >
        Should be level 1
      </Heading>
      <LoginForm />
      <RegisterForm />
      <VerificationCodeForm />
    </Wrapper>
  );
}

export default LoginPage;
