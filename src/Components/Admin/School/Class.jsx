import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  AllClass,
  CreateClass,
  UpdateClass,
} from "../../../Redux/Slice/ClassSlice";
import {  PiPlus} from "react-icons/pi";
import { Checkbox } from "primereact/checkbox";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import { confirmDialog } from "primereact/confirmdialog";
export default function Class() {
  const dispatch = useDispatch();

  const [selectTeacher, setSelectTeacher] = useState();
  const [visible, setVisible] = useState(false);
  const [label, setLable] = useState();
  const { Classs, loading } = useSelector((state) => state.Class);
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(AllClass(localStorage.getItem("schoolid")));
    if (!localStorage.getItem("Admintoken")) {
      return navigate("/adminlogin");
    }
  }, [dispatch, navigate]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    class: { value: null, matchMode: FilterMatchMode.EQUALS },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const [statuses] = useState([true, false]);

  const getSeverity = (status) => {
    switch (status) {
      case false:
        return "danger";

      case true:
        return "success";
    }
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-between">
        <span className="border border-slate-400 lg:h-12 rounded-lg relative flex items-center">
          <i className="pi pi-search ml-2 absolute my-4" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            className="py-2 pl-8"
            placeholder="Keyword Search"
            
          />
        </span>
        {/* <Button
          onClick={() => {
            setLable("s");
            setVisible(true);
          }}
          icon={<PiPlus size={20}  />}
          label="Create"
          className="gap-3 bg-blue-600 hover:bg-blue-700 duration-300 text-white px-5 py-3"
        /> */}
      </div>
    );
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <Tag
        value={rowData.status === true ? "Active" : "De-active"}
        severity={getSeverity(rowData.status)}
      />
    );
  };

  const statusItemTemplate = (option) => {
    return (
      <Tag
        value={option === true ? "Active" : "De-Active"}
        severity={getSeverity(option)}
      />
    );
  };

  const statusRowFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options}
        options={statuses}
        onChange={(e) => options.filterApplyCallback(e.value)}
        itemTemplate={statusItemTemplate}
        placeholder="Select One"
        className="p-column-filter border"
        showClear
        style={{ minWidth: "12rem" }}
      />
    );
  };

  const header = renderHeader();
  const footer = `In total there are ${Classs ? Classs.length : 0} Class's.`;
  return (
    <>
      <Dialog
        header={label === "s" ? "Create Class" : "Update Class"}
        visible={visible}
        onHide={() => setVisible(false)}
        style={{ width: "50vh" }}
      >
        <ClassForm data={selectTeacher} label={label} />
      </Dialog>
      <div className="card">
        <DataTable
          value={Classs}
          paginator
          rows={10}
          footer={footer}
          size="small"
          // loading={loading}
          dataKey="id"
          filters={filters}
          showGridlines
          stripedRows
          filterDisplay="row"
          globalFilterFields={["class"]}
          header={header}
          emptyMessage="No class found."
          selectionMode="single"
          // onSelectionChange={(e) => {
          //   setSelectTeacher(e.value);
          //   setVisible(true);
          //   setLable("u");
          // }}
        >
          <Column
            field="class"
            filter
            showFilterMenu={false}
            header="Class"
            filterPlaceholder="Search Class"
            style={{ width: "12rem" }}
            headerClassName="text-xs"
            className="text-xs "
          />
          <Column
            field="status"
            header="Status"
            showFilterMenu={false}
            filterMenuStyle={{ width: "8rem" }}
            style={{ width: "12rem" }}
            filter
            body={statusBodyTemplate}
            filterElement={statusRowFilterTemplate}
            headerClassName="text-xs"
            className="text-xs"
          />
        </DataTable>
      </div>
    </>
  );
}

const ClassForm = ({ data, label }) => {
  const [formData, setFormData] = useState();
  const [checked, setChecked] = useState(false);
  const dispatch = useDispatch();
  const formDataHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const toast = useRef(null);

  const showSuccessToast = (message) => {
    toast.current.show({
      severity: "success",
      summary: "Success Message",
      detail: message,
      life: 2000,
    });
  };

  const showErrorToast = (error) => {
    toast.current.show({
      severity: "info",
      summary: "Error Message",
      detail: error,
      life: 2000,
    });
  };
  useEffect(() => {
    if (data && label === "u") {
      setFormData(data);
      setChecked(data.status);
    }
  }, [label, data]);

  const onSubmit = () => {
    dispatch(
      CreateClass({
        ...formData,
        status: checked,
        school: localStorage.getItem("schoolid"),
      })
    ).then((doc) => {
      if (doc.payload?.response?.status != 302) {
        showSuccessToast(doc.payload?.message);
      }
      if (doc.payload.response?.data.error) {
        showErrorToast(doc.payload.response?.data.error);
      }
    });
  };
  const onUpdate = () => {
    dispatch(UpdateClass({ ...formData, status: checked })).then((doc) =>
      showSuccessToast(doc.payload.message)
    );
  };

  const confirm1 = () => {
    confirmDialog({
      message: "Are you sure you want to save ?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      accept: onSubmit,
      acceptClassName: "bg-blue-600 hover:bg-blue-700 px-5 py-3 text-white",
      rejectClassName: "px-5 py-3 mx-3 ",
    });
  };

  const confirm2 = () => {
    confirmDialog({
      message: "Do you want to delete this update ?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      defaultFocus: "accept",
      accept: onUpdate,
      acceptClassName: "bg-blue-600 hover:bg-blue-700 px-5 py-3 text-white",
      rejectClassName: "px-5 py-3 mx-3 ",
    });
  };
  return (
    <div className="grid">
      <Toast ref={toast} />
      <span className="p-float-label mt-7">
        <InputText
          id="username"
          name="class"
          value={formData?.class}
          onChange={formDataHandler}
          className="border-gray-400 border h-12 w-full pl-3"
        />
        <label htmlFor="username">
          Enter Class <strong className="text-red-500">*</strong>
        </label>
      </span>
      <span className="flex justify-center items-center gap-3 mt-4">
        <Checkbox
          className="outline-gray-400 outline outline-1 rounded-md"
          name="status"
          checked={checked}
          onChange={(e) => setChecked(e.checked)}
        ></Checkbox>
        <h1>Active</h1>
      </span>
      <div className="mt-5">
        {label === "u" ? (
          <Button
            label="Update"
            onClick={confirm2}
            className="bg-blue-600 hover:bg-blue-700 duration-300 w-full py-3 text-white"
          />
        ) : (
          <Button
            label="Save"
            disabled={formData?.class ? false : true}
            onClick={confirm1}
            className="bg-green-600 hover:bg-green-700 duration-300 w-full py-3 text-white"
          />
        )}
      </div>
    </div>
  );
};
