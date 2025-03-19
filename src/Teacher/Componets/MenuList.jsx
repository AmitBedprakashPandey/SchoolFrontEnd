import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { Ripple } from "primereact/ripple";
import { useEffect } from "react";
import { BiIdCard, BiLogOut } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

export default function MenuList(params) {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.Auth);

  const menuList = [
    {
      url: "icard",
      icon: <BiIdCard size={40} />,
      label: "Students",
      status: false,
    },
  ];

  useEffect(() => {
    if (!localStorage.getItem("Ttoken")) {
      navigate("/login");
    }
  }, [navigate]);

  const accept = () => {
    localStorage.removeItem("loginData");
    localStorage.removeItem("Ttoken");
    navigate("/login");
  };

  const confirm1 = () => {
    confirmDialog({
      message: "Are you sure you want to Logout ?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "bg-cyan-500 text-white px-5 py-2 ml-5",
      rejectClassName: "border-2 border-cyan-500 px-5 py-2",
      defaultFocus: "accept",
      accept,
    });
  };

  return (
    <>
      <ConfirmDialog />
      <div className="bg-red-500 rounded-b-3xl p-5 fixed top-0 left-0 right-0 z-50 shadow-gray-400 shadow-md">
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <label className="flex flex-col ">
              <span className="italic text-white text-xs">
                {userData?.school}
              </span>
            </label>
          </div>
          <div className="flex items-center gap-8">
            <div className="flex flex-col">
              <small className="text-white italic">
                Welcome, {userData?.name} {userData?.lastname}
              </small>
              <small className="text-white flex gap-2">
                <p>Class : {userData?.class}</p>
                <p>Section : {userData?.section}</p>
                <p>Year : {userData?.sessionyear}</p>
              </small>
              <small className="text-white"></small>
            </div>
            <button onClick={confirm1} className="text-white p-ripple">
              <BiLogOut size={30} />
              <Ripple />
            </button>
          </div>
        </div>
      </div>
      <div className="overflow-scroll h-screen">
        <div className="mt-36 flex justify-center mb-10">
          <div className="grid grid-cols-3 gap-8 md:grid-cols-7 place-content-cente mx-5">
            {menuList.map((item, index) => (
              <Link
                to={item.url}
                className="w-24 h-24 p-ripple border bg-white shadow-gray-300 shadow-md rounded-2xl flex flex-col items-center justify-center"
              >
                <Ripple
                  pt={{
                    root: { style: { background: "rgba(0, 0, 0, 0.5)" } },
                  }}
                />
                {item.icon}

                <label className="font-semibold">{item.label}</label>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
