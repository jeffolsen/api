import termsHtml from "@/assets/html/terms.html?raw";
import Iframe from "@/components/common/Iframe";

function TermsOfService() {
  return (
    <div className="bg-gray-50 border-8 border-secondary">
      <Iframe html={termsHtml} />
    </div>
  );
}

export default TermsOfService;
