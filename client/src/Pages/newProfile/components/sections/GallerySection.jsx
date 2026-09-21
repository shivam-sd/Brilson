import { useState } from "react";
import { useGetGallery } from "../../api/profileApi";
import { optimizeImage } from "../../utils/helpers";
import Lightbox from "../ui/Lightbox";
import QueryState from "../ui/QueryState";
import SafeImage from "../ui/SafeImage";

export default function GallerySection({ code }) {
  const query = useGetGallery(code);
  const items = query.data?.data ?? [];
  const [selected, setSelected] = useState(null);

  return (
    <QueryState query={query} isEmpty={!items.length} emptyText="No photos added yet.">
      <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {items.map((item, i) => (
          <li key={item._id}>
            <button
              type="button"
              onClick={() => setSelected(i)}
              aria-label={`Open photo ${i + 1} of ${items.length}`}
              className="group block aspect-square w-full overflow-hidden rounded-xl border border-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/80"
            >
              <SafeImage
                src={item.image}
                alt=""
                className="h-full w-full"
                imgClassName="transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
              />
            </button>
          </li>
        ))}
      </ul>

      {selected !== null && (
        <Lightbox items={items} index={selected} onChange={setSelected} onClose={() => setSelected(null)} />
      )}
    </QueryState>
  );
}
