import React, { useState, useEffect, useLayoutEffect } from "react";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";
import { getAllTeacherBySchool } from "../../../Redux/Slice/TeacherSlice";
import { useDispatch, useSelector } from "react-redux";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import TeacherFrom from "./TeacherForm";
import TeacherLoginUpdate from "./TeacherLoginUpdate";
import { AllClass, AllClassBySchoolStatus } from "../../../Redux/Slice/ClassSlice";
import { AllSectionBySchoolStatus } from "../../../Redux/Slice/SectionSlice";
import { useNavigate } from "react-router-dom";
import Loading from "../../Loading";
export default function Teacher({ school }) {
  const dispatch = useDispatch();

  const [selectTeacher, setSelectTeacher] = useState();
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [label, setLable] = useState();
  const { Teacher, loading } = useSelector((state) => state.Teacher);

  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (!localStorage.getItem("Admintoken")) {
      return navigate("/adminlogin");
    }
  }, [navigate]);

  useEffect(() => {
    dispatch(getAllTeacherBySchool(localStorage.getItem("schoolid")));
    dispatch(AllClass(localStorage.getItem("schoolid")));
    dispatch(AllSectionBySchoolStatus(localStorage.getItem("schoolid")));
  }, [dispatch]);

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    classs: { value: null, matchMode: FilterMatchMode.EQUALS },
    section: { value: null, matchMode: FilterMatchMode.EQUALS },
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
        <span className="border border-slate-300 rounded-lg relative">
          <i className="pi pi-search absolute my-2 px-2" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            className="w-full h-full md:text-xs md:pl-8"
            placeholder="Keyword Search"
          />
        </span>

        <Button
          onClick={() => {
            setLable("s");
            setVisible(true);
          }}
          label="Create Teacher"
          className="md:text-xs bg-blue-600 hover:bg-blue-700 duration-300 text-white py-2 px-4"
        />
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
        placeholder="Select"
        panelClassName="p-0"
        className="border "
        showClear
        style={{ minWidth: "4rem", maxWidth: "12rem" }}
      />
    );
  };

  const header = renderHeader();
  const footer = (<div className="text-xs capitalize">In total there are {Teacher ? Teacher.length : 0} Teacher's.</div>);

  return (
    <>
      <Dialog
        header="Create Teacher"
        visible={visible}
        onHide={() => setVisible(false)}
        style={{ width: "50vh" }}
      >
        <TeacherFrom
          data={selectTeacher}
          label={label}
          visibles={() => setVisible(false)}
        />
      </Dialog>
      <Dialog
        header="Teacher"
        maximized
        visible={visible2}
        onHide={() => setVisible2(false)}
      >
        <TeacherLoginUpdate data={selectTeacher} />
      </Dialog>
      {/* {loading && <Loading />} */}
      <div className="card">
        <DataTable
          size="small"
          value={Teacher}
          scrollable
          scrollHeight="80vh"
          footer={footer}
          dataKey="id"
          filters={filters}
          filterDisplay="row"
          globalFilterFields={["name", "lastnm"]}
          header={header}
          stripedRows
          className="mx-2"
          showGridlines
          emptyMessage="No customers found."
          selectionMode="single"
          onSelectionChange={(e) => {
            setSelectTeacher(e.value);
            setVisible2(true);
            setLable("u");
          }}
        >
          <Column
            field="name"
            header="Name"
            filter
            showFilterMenu={false}
            filterPlaceholder="Search"
            style={{ minWidth: "8rem", maxWidth: "12rem" }}
            headerClassName="text-xs md:text-[7pt]"
            className="text-xs md:text-[8pt]"
          />
          <Column
            field="lastnm"
            header={"Last Name"}
            filterHeaderClassName="p-0 m-0"
            style={{
              minWidth: "6rem",
              maxWidth: "12rem",
              margin: 0,
              padding: 0,
            }}
            headerClassName="text-xs md:text-[7pt]"
            className="text-xs md:text-[8pt]"
          />
          <Column
            field="classs"
            header="Class"
            filter
            filterPlaceholder="Search"
            filterHeaderClassName="p-0 m-0"
            style={{ minWidth: "6rem", maxWidth: "12rem" }}
            headerClassName="text-xs md:text-[7pt]"
            showFilterMenu={false}
            className="text-xs md:text-[8pt]"
          />
          <Column
            field="section"
            header="Section"
            filter
            filterPlaceholder="Search"
            filterHeaderClassName="p-0 m-0"
            style={{ minWidth: "6rem", maxWidth: "12rem" }}
            showFilterMenu={false}
            headerClassName="text-xs md:text-[7pt]"
            className="text-xs md:text-[8pt]"
          />
          <Column
            field="address"
            header="Address"
            filterHeaderClassName="p-0 m-0"
            headerClassName="text-xs md:text-[8pt] m-0 p-0"
            className="text-xs md:text-[8pt]"
            style={{ minWidth: "14rem" }}
          />
          <Column
            field="mobile"
            header="Mobile"
            style={{ minWidth: "14rem" }}
            headerClassName="text-xs md:text-[7pt]"
            className="text-xs md:text-[8pt]"
          />
          <Column
            field="status"
            header="Status"
            showFilterMenu={false}
            filterMenuStyle={{ width: "14rem" }}
            style={{ minWidth: "8rem", maxWidth: "12rem" }}
            filter
            body={statusBodyTemplate}
            filterElement={statusRowFilterTemplate}
            headerClassName="text-xs md:text-[7pt]"
            className="text-xs md:text-[8pt]"
          />
        </DataTable>
      </div>
    </>
  );
}
