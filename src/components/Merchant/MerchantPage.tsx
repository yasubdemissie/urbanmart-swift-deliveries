import { useParams } from "react-router-dom";

export default function MerchantPage() {
  const { id } = useParams();

  return <div>MerchantPage {id}</div>;
}
