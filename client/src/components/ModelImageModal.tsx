import { useEffect, useState } from "react";

export default function ModelImageModal() {
  const [show, setShow] = useState(false);
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetch(`${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000"}/api/model-image`)
        .then((res) => res.ok ? res.json() : Promise.reject())
        .then((data) => {
          // If the URL is relative, prepend the API base URL
          let url = data.url;
          if (url && !/^https?:\/\//.test(url)) {
            url = `${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000"}${url}`;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 sm:px-8 sm:py-10">
      <div className="bg-white rounded-[2rem] shadow-2xl p-4 sm:p-6 max-w-5xl w-full relative">
        <button
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-900 bg-white/80 rounded-full w-10 h-10 flex items-center justify-center shadow-sm"
          onClick={() => setShow(false)}
        >
          ×
        </button>
        <div className="rounded-[1.5rem] bg-slate-100 overflow-auto">
          <img src={imgUrl} alt="Model" className="mx-auto max-w-full max-h-[90vh] object-contain" />
        </div>
      </div>
    </div>
  );
}
