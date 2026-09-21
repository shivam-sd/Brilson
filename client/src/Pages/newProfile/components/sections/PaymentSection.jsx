import { useGetPaymentDetails } from "../../api/profileApi";
import QueryState from "../ui/QueryState";
import PaymentDetails from "./PaymentDetails";

export default function PaymentSection({ code }) {
  const query = useGetPaymentDetails(code);
  const data = query.data?.data;
  const d = data?.paymentDetails ?? {};
  const hasAnything = Boolean(data?.upi || data?.image || d.bankName || d.bankHolderName || d.accountNumber || d.ifscCode);

  return (
    <QueryState query={query} isEmpty={!hasAnything} emptyText="No payment details added yet.">
      <PaymentDetails data={data} />
    </QueryState>
  );
}
