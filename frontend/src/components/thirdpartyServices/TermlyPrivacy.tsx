import termslyPrivacyHtml from "@/assets/html/privacy.html?raw";
import Iframe from "@/components/common/Iframe";

function TermlyPrivacy() {
  return (
    <div className="bg-gray-50 border-8 border-secondary">
      <Iframe html={termslyPrivacyHtml} />;
    </div>
  );
}

export default TermlyPrivacy;
