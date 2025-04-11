import Checkout from "../Checkout/Checkout";
import { auth } from "../../../auth";

const CheckoutPage = async() => {
  const session = await auth();
  return (
    <div className="flex flex-col lg:flex-row items-start justify-center min-h-screen bg-gray-50 p-6">
      <Checkout session = {session}/>
    </div>
  );
};

export default CheckoutPage;
