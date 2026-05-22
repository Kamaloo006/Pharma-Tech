import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";

import { toast } from "sonner";

const DevelopmentVerify = () => {
  const navigate = useNavigate();
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    try {
      setLoading(true);
      const encodedUrl = link.split("url=")[1];
      if (!encodedUrl) {
        toast.error("الرابط غير صحيح أو لا يحتوي على بارامتر url");
        return;
      }

      const finalApiUrl = decodeURIComponent(encodedUrl);

      const response = await axios.get(finalApiUrl);

      if (response.status === 200) {
        toast.success("تم تفعيل الحساب بنجاح!");
        setInterval(() => {
          navigate("/login/pharmacist");
        }, 1200);
      } else toast.error("فشل تفعيل الحساب، الرجاء المحاولة لاحقاً");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "فشل التحقق");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto space-y-4">
      <h2 className="text-xl font-bold">مختبر تفعيل الحسابات (Dev Mode)</h2>
      <input
        type="text"
        placeholder="الصق رابط "
        className="w-full p-2 border rounded"
        value={link}
        onChange={(e) => setLink(e.target.value)}
      />
      <button
        onClick={handleVerify}
        disabled={loading}
        className="w-full bg-primary text-white p-2 rounded disabled:opacity-50 "
      >
        {loading ? "جار التحميل..." : "تفعيل الحساب فوراً"}
      </button>
    </div>
  );
};

export default DevelopmentVerify;
