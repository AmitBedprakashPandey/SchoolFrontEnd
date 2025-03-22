import { PanelMenu } from "primereact/panelmenu";
import { useEffect, useLayoutEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { getByUserAllSchool } from "../../Redux/Slice/SchoolSlice";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "primereact/button";
import { getAllTeacherBySchool } from "../../Redux/Slice/TeacherSlice";
import { fetchAllIcards } from "../../Redux/Slice/IcardSlice";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import {
  PiInfoDuotone,
  PiStudentDuotone,
  PiChalkboardTeacherDuotone,
  PiShuffleDuotone,
  PiIdentificationBadgeDuotone,
  PiXDuotone,
  PiCardsDuotone,
  PiMoneyDuotone,
} from "react-icons/pi";
import { verifyExpire } from "../../Redux/Slice/ExpireSlice";
export default function AdminHome(params) {
  const navigate = useNavigate();
  // const [activeIndex, setActiveIndex] = useState(null);
  const dispatch = useDispatch();
  const param = useLocation();
  const { School } = useSelector((state) => state.School);
  const pathname = param.pathname.substring(
    param.pathname.lastIndexOf("/") + 1
  );

  // useEffect(() => {
  //   // Disable scroll
  //   document.body.style.overflow = "hidden";

  //   // Re-enable scroll on cleanup
  //   return () => {
  //     document.body.style.overflow = "unset";
  //   };
  // }, []);

  const menuItems = [
    {
      key: "0",
      label: "Teacher's",
      // icon: "pi pi-users",
      url: "teacher",
      icon: <PiChalkboardTeacherDuotone size={20} />,
    },
    {
      key: "2",
      label: "Students",
      // icon: "pi pi-users",
      url: "student",
      icon: <PiStudentDuotone size={20} />,
    },
    {
      key: "3",
      label: "Class",
      // icon: "pi pi-users",
      url: "class",
      icon: <PiShuffleDuotone size={20} />,
    },
    {
      key: "4",
      label: "Section",
      // icon: "pi pi-users",
      url: "section",
      icon: <PiShuffleDuotone size={20} />,
    },
    {
      key: "5",
      label: "ICard Printed",
      // icon: "pi pi-users",
      url: "printed",
      disabled: localStorage.getItem("expiredStatus") === true ? true : false,
      icon: <PiIdentificationBadgeDuotone size={20} />,
    },{
      key: "5",
      label: "De-Active",
      // icon: "pi pi-users",
      url: "deactivewithoutimage",
      icon: <PiXDuotone size={20} />,
    },{
      key: "6",
      label: "Admit Card",
      // icon: "pi pi-users",
      url: "admitcard",
      icon: <PiCardsDuotone size={20} />,
    },{
      key: "7",
      label: "Session Upgrade",
      // icon: "pi pi-users",
      url: "sessionupgrade",
      icon: <PiCardsDuotone size={20} />,
    },
    {
      key: "8",
      label: "Old Students",
      // icon: "pi pi-users",
      url: "oldstudent",
      icon: <PiStudentDuotone size={20} />,
    },
    // ,{
    //   key: "7",
    //   label: "Set Fees",
    //   // icon: "pi pi-users",
    //   url: "setfees",
    //   icon: <PiMoneyDuotone size={20} />,
    // },{
    //   key: "8",
    //   label: "Fees Payment",
    //   // icon: "pi pi-users",
    //   url: "feespayment",
    //   icon: <PiMoneyDuotone size={20} />,
    // },
    // {
    //   key: "8",
    //   label: "Session Upgrade",
    //   // icon: "pi pi-users",
    //   url: "sessionupgrade",
    //   icon: <PiMoneyDuotone size={20} />,
    // },
  ];

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
  }, [navigate, dispatch]);

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
      acceptClassName: "bg-blue-600 text-white px-5 py-2.5 ml-5",
      rejectClassName: "border-2 border-blue-600 px-5 py-2",
      defaultFocus: "accept",
      accept,
    });
  };
  return (
    <>
      <ConfirmDialog />

      <div className="flex w-screen h-screen bg-slate-300 z-40">
        <div className="relative bg-white w-64 z-40">
          <div className="w-full grid">
          <h1 className="bg-blue-600 py-2 pl-5 text-white font-bold uppercase text-xs">
              {School?.name}
            </h1>
            {menuItems.map((item, index) => (
              <Link
                to={item.url}
                key={index}
                className={`${
                  pathname === item.url
                    ? "bg-blue-600 text-white"
                    : "bg-white hover:bg-blue-200"
                } duration-300 text-xs py-2 px-4 flex items-center gap-3`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>
          <small className="text-[6pt] absolute bottom-0 py-5 flex justify-center w-full">
            Amit Pandey © Copyright 2024 v0.1
          </small>
        </div>
        <div className="w-full overflow-hidden z-40">
          <div className="bg-blue-600 flex justify-end px-10 py-1.5
           sticky top-0 z-40">
            <div className="flex gap-3 items-center">
              <div className="flex  text-xs text-white italic gap-1">
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
          <div className="m-1 bg-white h-full">
          <Outlet />

          </div>
        </div>
      </div>
    </>
  );
}
