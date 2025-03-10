import { useEffect, useState } from "react";
import Loading from "../../Loading";

export default function Managment(params) {
    
      const [loading, setLoading] = useState(false);
    
      useEffect(() => {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
        }, 3000);
      }, []);

    return(<>
    {loading && <Loading />}
    Management
    </>)
}