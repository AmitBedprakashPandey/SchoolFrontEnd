import { PanelMenu } from "primereact/panelmenu";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { getByUserAllSchool } from "../../Redux/Slice/SchoolSlice";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "primereact/button";
import { getAllTeacherBySchool } from "../../Redux/Slice/TeacherSlice";
import { fetchAllIcards } from "../../Redux/Slice/IcardSlice";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { BiError } from "react-icons/bi";
import { verifyExpire } from "../../Redux/Slice/ExpireSlice";
export default function AdminHome(params) {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(null);
  const dispatch = useDispatch();
  const param = useLocation();
  const pathname = param.pathname.substring(
    param.pathname.lastIndexOf("/") + 1
  );

  useEffect(() => {
    // Disable scroll
    document.body.style.overflow = "hidden";

    // Re-enable scroll on cleanup
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const menuItems = [
    {
      key: "0",
      label: "Teacher's",
      // icon: "pi pi-users",
      url: "teacher",
    },
    {
      key: "2",
      label: "Students",
      // icon: "pi pi-users",
      url: "student",
    },
    {
      key: "3",
      label: "Class",
      // icon: "pi pi-users",
      url: "class",
    },
    {
      key: "4",
      label: "Section",
      // icon: "pi pi-users",
      url: "section",
    },
    {
      key: "5",
      label: "ICard Printed",
      // icon: "pi pi-users",
      url: "printed",
      disabled: localStorage.getItem("expiredStatus") === true ? true : false,
    },
    {
      key: "5",
      label: "De-Active",
      // icon: "pi pi-users",
      url: "deactivewithoutimage",
    },
  ];

  const handleSelect = (index) => {
    setActiveIndex(index);
  };

  const getItemClass = (index) => {
    return index === activeIndex ? "bg-cyan-500 text-white" : "";
  };

  const enhancedItems = menuItems.map((item, index) => ({
    ...item,

    className: getItemClass(index),
    command: () => handleSelect(index),
  }));

  useEffect(() => {
    if (!localStorage.getItem("Admintoken")) {
      return navigate("/adminlogin");
    }
    dispatch(verifyExpire());
  }, [navigate, dispatch]);

  useLayoutEffect(() => {
    dispatch(getByUserAllSchool(localStorage.getItem("schoolid"))).then(
      (doc) => {
        if (doc.payload?.response?.status === 403) {
          localStorage.removeItem("email");
          localStorage.removeItem("Admintoken");
          localStorage.removeItem("schoolid");
          localStorage.removeItem("schoolName");
          navigate("/adminlogin");
        }
      }
    );
    dispatch(getAllTeacherBySchool(localStorage.getItem("schoolid")));
    dispatch(fetchAllIcards(localStorage.getItem("schoolid")));
  }, [dispatch]);

  const accept = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("Admintoken");
    localStorage.removeItem("schoolid");
    localStorage.removeItem("schoolName");
    localStorage.removeItem("expiredStatus");
    localStorage.removeItem("expired");
    navigate("/adminlogin");
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

      <div className="bg-blue-600 flex justify-between px-10 py-5 sticky top-0 z-40">
        <h1 className="text-white font-bold capitalize text-lg">
          {localStorage.getItem("schoolName")}
        </h1>
        {localStorage.getItem("expiredStatus") === true && (
          <div className="flex justify-center font-bold -mt-5 w-80 rounded-es-lg rounded-ee-lg shadow-gray-500 shadow-md bg-white">
            <h1 className="py-2 px-3 text-red-500 flex items-center gap-1">
              <BiError />
              Expired Subscription
            </h1>
          </div>
        )}
        <div className="flex gap-3 items-center">
          {localStorage.getItem("expired") !== "" ? (
            <div className="text-white font-bold">
              {"Expired on: " +
                moment(localStorage.getItem("expired")).format(
                  "DD/MM/YYYY, h:mm:ss A"
                )}
            </div>
          ) : (
            ""
          )}
          <div className="flex text-lg font text-white italic gap-1">
            <small>Hello,</small>
            <small>{localStorage.getItem("email")}</small>
          </div>
          <Button
            label="Logout"
            className="capitalize text-xs font-bold bg-white hover:bg-black duration-200 hover:text-white px-2 py-0.5"
            onClick={confirm1}
          />
        </div>
      </div>
      <div className="flex bg-white z-40 relative">
        <div className="shadow-lg relative  min-w-[16rem] h-[93vh]  shadow-slate-500 z-40">
          <PanelMenu
            model={menuItems.map((item) => ({
              ...item,
              template: (item, options) => {
                return (
                  <Link
                    to={item.url}
                    className={`p-panelmenu-header border-slate-300 border-b ${
                      item.url === pathname
                        ? "bg-blue-600 hover:bg-blue-700 duration-300"
                        : "bg-white"
                    } ${options.className} `}
                  >
                    <span className={options.iconClassName}>{item.icon}</span>
                    <span
                      className={
                        item.url === pathname
                          ? "text-white duration-300"
                          : "text-black"
                      }
                    >
                      {item.label}
                    </span>
                  </Link>
                );
              },
            }))}
          ></PanelMenu>
          <small className="absolute bottom-0 py-5 flex justify-center w-full">
            Amit Pandey © Copyright 2024 v1
          </small>
        </div>
        <div className="w-[87vw] h-[93vh] bg-gray-100 p-2 ml-2 shadow-lg shadow-slate-500 overflow-hidden z-40">
          <Outlet />
        </div>
      </div>
    </>
  );
}
