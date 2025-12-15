import Header from "@/components/Custom/Header";
import MerchantList from "@/components/Home/merchantList";

export default function Merchants() {
  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center">
        <MerchantList />
      </div>
    </>
  );
}
