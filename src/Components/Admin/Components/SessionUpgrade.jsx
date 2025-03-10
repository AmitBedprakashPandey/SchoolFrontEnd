import moment from "moment";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { useDispatch, useSelector } from "react-redux";
import { SessionUpdate } from "../../../Redux/Slice/IcardSlice";
import { confirmDialog } from "primereact/confirmdialog";
import { useDeferredValue, useEffect, useState } from "react";
function SessionUpgrade({ item, close }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    newclass: "",
    newsection: "",
    newyear:""
  });
  const currentYear = moment().year();
  const { Sections } = useSelector((state) => state.Section);
  const { Classs } = useSelector((state) => state.Class);

  const formDataHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(()=>{
    console.log(formData);
    
  },[formData])
  const onUpdate = () => {
    dispatch(SessionUpdate({...item ,formData}));
  };

  const confirm1 = () => {
    confirmDialog({
      message: "Are you sure you want to Update ?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      acceptClassName: "ml-3 bg-blue-500 px-4 py-3 text-white",
      rejectClassName: "px-4 py-3",
      accept: onUpdate,
    });
  };
  return (
    <div className="border w-full h-full relative">
      {!item && (
        <div className="bg-slate-300/30 w-full h-full cursor-not-allowed z-50 absolute top-0 bottom-0"></div>
      )}

        <div className="">
          <label className="text-slate-400">Academic Year</label>
          <select name="newyear" onChange={formDataHandler} className="border-b-2  w-full h-12">
            <option selected disabled >
              Select Academic Year
            </option>
            <option>
              {currentYear}- {currentYear + 1}
            </option>
            <option>
              {currentYear + 1}- {currentYear + 2}
            </option>
          </select>
        </div>

        <div className="w-full flex flex-col my-1">
          <label className="text-slate-400 text-start">
            Class:
            {/* <strong className="text-red-500">*</strong> */}
          </label>
          <select name="newclass" onChange={formDataHandler} className="border-b-2  w-full h-12">
            <option selected disabled>
              Select Class
            </option>
            {Classs.map((item, index) => (
              <option value={item?.class}>{item?.class}</option>
            ))}
          </select>
        </div>

        <div className="w-full flex flex-col my-1">
          <label className="text-slate-400 text-start">
            Section:
            {/* <strong className="text-red-500">*</strong> */}
          </label>
          <select name="newsection" onChange={formDataHandler} className="border-b-2  w-full h-12">
            <option selected disabled>
              Select Section
            </option>
            {Sections.map((item, index) => (
              <option value={item?.section}>{item?.section}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-center mt-5">
          <Button
            label="Update"
            onClick={confirm1}
            disabled={formData.newclass && formData.newsection && formData.newyear ? false : true }
            loading={false}
            className="bg-blue-500 px-16 py-2 text-white capitalize gap-3"
          />
        </div>

        <div className="flex flex-col mt-5 text-xs text-slate-400">
          <label>
            Previce Academic Year : <strong>{item?.oldyear}</strong>
          </label>
          <label>
            Previce Class : <strong>{item?.oldclass}</strong>
          </label>
          <label>
            Previce Session : <strong>{item?.oldsection}</strong>
          </label>
        </div>
   
    </div>
  );
}

export default SessionUpgrade;
