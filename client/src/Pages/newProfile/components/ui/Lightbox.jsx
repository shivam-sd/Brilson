import { useEffect, useRef } from "react";
import { LuChevronLeft, LuChevronRight, LuX } from "react-icons/lu";
import { optimizeImage } from "../../utils/helpers";

const iconBtn =
  "absolute grid h-10 w-10 place-items-center rounded-full bg-black/60 text-white backdrop-blur transition-colors hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white";

export default function Lightbox({ items, index, onClose, onChange }) {
  const ref = useRef(null);
  const item = items[index];
  const many = items.length > 1;

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const go = (dir) => onChange((index + dir + items.length) % items.length);

  const onKeyDown = (e) => {
    if (!many) return;
    if (e.key === "ArrowRight") go(1);
    if (e.key === "ArrowLeft") go(-1);
  };

  return (
    <dialog
      ref={ref}
      aria-label="Photo viewer"
      onClose={onClose}
      onKeyDown={onKeyDown}
      onClick={(e) => e.target === ref.current && onClose()}
      className="m-auto max-h-[92vh] w-[min(94vw,920px)] overflow-hidden rounded-2xl border border-white/10 bg-[#05090d] p-0 text-white backdrop:bg-black/85"
    >
      <div className="relative">
        <img
          src={item.image}
          alt={`Gallery photo ${index + 1} of ${items.length}`}
          className="max-h-[92vh] w-full object-contain"
        />
        <button type="button" onClick={onClose} aria-label="Close photo viewer" className={`${iconBtn} right-3 top-3`}>
          <LuX className="h-5 w-5" aria-hidden="true" />
        </button>
        {many && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className={`${iconBtn} left-3 top-1/2 -translate-y-1/2`}>
              <LuChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next photo" className={`${iconBtn} right-3 top-1/2 -translate-y-1/2`}>
              <LuChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </>
        )}
      </div>
    </dialog>
  );
}
