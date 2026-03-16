import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {

  const navigate = useNavigate();

  useEffect(() => {

    // history ko overwrite karo
    window.history.pushState(null, "", "/payment-success");

    const handleBack = () => {
      window.history.pushState(null, "", "/payment-success");
    };

    window.addEventListener("popstate", handleBack);

    // redirect to orders
    setTimeout(() => {
      navigate("/orders", { replace: true });
    }, 1500);

    return () => {
      window.removeEventListener("popstate", handleBack);
    };

  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <h1 className="text-2xl font-bold text-green-600">
        Payment Successful
      </h1>
    </div>
  );
};

export default PaymentSuccess;