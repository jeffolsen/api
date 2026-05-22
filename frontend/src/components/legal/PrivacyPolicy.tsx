import privacyHtml from "@/assets/html/privacy.html?raw";
import Iframe from "@/components/common/Iframe";

function PrivacyPolicy() {
  return (
    <div className="bg-gray-50 border-8 border-secondary">
      <Iframe html={privacyHtml} />
    </div>
  );
}

export default PrivacyPolicy;
