
import { Outlet } from "react-router-dom";

function Home(params) {
  return (
    <>
      <div className="">
        <Outlet />
      </div>
    </>
  );
}

export default Home;
