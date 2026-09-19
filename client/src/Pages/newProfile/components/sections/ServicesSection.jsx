import { useGetServices } from "../../api/profileApi";
import ItemCard from "../ui/ItemCard";
import QueryState from "../ui/QueryState";

export default function ServicesSection({ code }) {
  const query = useGetServices(code);
  const items = query.data?.data ?? [];

  return (
    <QueryState query={query} isEmpty={!items.length} emptyText="No services added yet.">
      <div className="grid gap-3">
        {items.map((item) => (
          <ItemCard key={item._id} item={item} color="orange" />
        ))}
      </div>
    </QueryState>
  );
}
