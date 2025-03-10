import { useEffect, useState } from "react";
import Loading from "../../Loading";

export default function FeeHistory(params) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);
  
  return (
    <>
      {loading && <Loading />}
      Fee Histoory
    </>
  );
}
