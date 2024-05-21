import { PanelMenu } from "primereact/panelmenu";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getByUserAllSchool } from "../../Redux/Slice/SchoolSlice";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "primereact/button";
import { getAllTeacherBySchool } from "../../Redux/Slice/TeacherSlice";
import { fetchAllIcards } from "../../Redux/Slice/IcardSlice";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { classNames } from "primereact/utils";
export default function AdminHome(params) {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(null);
  const dispatch = useDispatch();

  const menuItems = [
    {
      key: "0",
      label: "Teacher's",
      // icon: "pi pi-users",
      url: "/admin/teacher",
    },
    {
      key: "2",
      label: "Students",
      // icon: "pi pi-users",
      url: "/admin/student",
    },
    {
      key: "3",
      label: "Class",
      // icon: "pi pi-users",
      url: "/admin/class",
    },
    {
      key: "4",
      label: "Section",
      // icon: "pi pi-users",
      url: "/admin/section",
    },
    {
      key: "5",
      label: "ICard Printed",
      // icon: "pi pi-users",
      url: "/admin/printed",
    },
    {
      key: "5",
      label: "De-Active",
      // icon: "pi pi-users",
      url: "/admin/deactivewithoutimage",
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
      {" "}
      <ConfirmDialog />
      <div className="bg-cyan-500 flex justify-between px-10 py-5 sticky top-0 z-50">
        <h1 className="text-white font-bold capitalize">
          {localStorage.getItem("schoolName")}
        </h1>
        <div className="flex gap-3 items-center">
          <div className="flex text-white italic gap-1">
            <small>Hello,</small>
            <small>{localStorage.getItem("email")}</small>
          </div>
          <Button
            label="Logout"
            className="capitalize text-xs bg-cyan-500 text-white px-2 py-0.5"
            onClick={confirm1}
          />
        </div>
      </div>
      <div className="flex bg-white z-50 relative">
        <div className="shadow-md relative  min-w-[15rem] h-[90vh]">
          <PanelMenu model={enhancedItems}></PanelMenu>
        </div>
        <div className="w-[87vw] h-[90vh] bg-gray-100 p-2 m-2 rounded-md">
          <Outlet />
        </div>
      </div>
    </>
  );
}
