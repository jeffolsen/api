import cookiesHtml from "@/assets/html/cookies.html?raw";
import Iframe from "@/components/common/Iframe";

function CookiePolicy() {
  return (
    <div className="bg-gray-50 border-8 border-secondary">
      <Iframe html={cookiesHtml} />
    </div>
  );
}

export default CookiePolicy;
