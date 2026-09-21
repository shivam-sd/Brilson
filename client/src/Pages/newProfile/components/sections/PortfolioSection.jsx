import { useGetProducts } from "../../api/profileApi";
import ItemCard from "../ui/ItemCard";
import QueryState from "../ui/QueryState";

export default function PortfolioSection({ code }) {
  const query = useGetProducts(code);
  const items = query.data?.data ?? [];

  return (
    <QueryState query={query} isEmpty={!items.length} emptyText="No work added yet.">
      <div className="grid gap-3">
        {items.map((item) => (
          <ItemCard key={item._id} item={item} color="purple" />
        ))}
      </div>
    </QueryState>
  );
}
