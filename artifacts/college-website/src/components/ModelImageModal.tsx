import { useEffect, useState } from "react";

export default function ModelImageModal() {
  const [show, setShow] = useState(false);
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/model-image`)
        .then((res) => res.ok ? res.json() : Promise.reject())
        .then((data) => {
          // If the URL is relative, prepend the API base URL
          let url = data.url;
          if (url && !/^https?:\/\//.test(url)) {
            url = `${import.meta.env.VITE_API_BASE_URL}${url}`;
          }
          setImgUrl(url);
        })
        .catch(() => setImgUrl(null));
      setShow(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!show || !imgUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-xs w-full relative">
        <button
          className="absolute top-2 right-2 text-slate-500 hover:text-slate-900"
          onClick={() => setShow(false)}
        >
          ×
        </button>
        <img src={imgUrl} alt="Model" className="w-full h-auto rounded-xl" />
      </div>
    </div>
  );
}
