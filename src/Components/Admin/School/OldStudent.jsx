import moment from "moment";
import "../Style.css";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AllClass } from "../../../Redux/Slice/ClassSlice";
import { fetchAllIcards, updateManyIcards} from "../../../Redux/Slice/IcardSlice";
import { AllSection } from "../../../Redux/Slice/SectionSlice";
import BulkUpload from "../../BulkExcelUploadForm";
import ICardForm from "../../ICardForm";
import { InputSwitch } from "primereact/inputswitch";
import { Checkbox } from "primereact/checkbox";
import { Toast } from "primereact/toast";
export default function OldStudent() {
  const dispatch = useDispatch();
  const toast = useRef(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedPrinted, setSelectedPrinted] = useState([]);
  const [filterStudent, setFilterStudent] = useState([]);
  const [selectTeacher, setSelectTeacher] = useState();
  const [allSelect, setAllSelect] = useState(false);
  const [printAllSelect, setPrintAllSelect] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [imageFilterChecked, setImageFilterChecked] = useState(false);
  const [label, setLable] = useState();
    const currentYear = moment().year();
  const { ICards, loading, message, error } = useSelector(
    (state) => state.Icard
  );
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (!localStorage.getItem("Admintoken")) {
      return navigate("/adminlogin");
    }
  }, [navigate]);
  
  useLayoutEffect(()=>{
    dispatch(AllClass(localStorage.getItem("schoolid")));
    dispatch(AllSection(localStorage.getItem("schoolid")));
    dispatch(fetchAllIcards(localStorage.getItem("schoolid")));
  },[dispatch])


  useEffect(() => {
    setFilterStudent(
      ICards?.filter(
            (item) =>
              (item.status === true &&
                item.print === false &&
                item.image != null) ||
              ""
          )
    )   
  }, [ICards]);

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    class: { value: null, matchMode: FilterMatchMode.EQUALS },
    section: { value: null, matchMode: FilterMatchMode.EQUALS },
    photonumber:{ value: null, matchMode: FilterMatchMode.STARTS_WITH },
    rollno:{ value: null, matchMode: FilterMatchMode.STARTS_WITH },
    year:{ value: null, matchMode: FilterMatchMode.STARTS_WITH },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    admission_id: { value: null, matchMode: FilterMatchMode.CONTAINS },
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

  const handlePrint = () => {
    navigate("/print", { state: { student: selectedProducts } });
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-between">
        <h1>Old Students

        </h1>
        <span className="border border-slate-300 rounded-lg flex items-center relative">
          <i className="pi pi-search absolute right-3" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            className="md:py-1 lg:py-2 px-2"
            placeholder="Keyword Search"
          />
        </span>
<div>
  <label>Session : </label>
  <select>
    <option selected disabled >Select Session</option>
    <option selected={currentYear === currentYear ? true : false} >{currentYear -1}- {currentYear}</option>
            <option selected={currentYear === currentYear ? true : false} >{currentYear}- {currentYear+1}</option>
            <option>{currentYear+1}- {currentYear+2}</option>
  </select>
</div>
        {/* <Button
          label="Bulk student upload "
          onClick={() => setVisible2(true)}
          className="bg-blue-600 hover:bg-blue-700 duration-200 text-white px-5"
        /> */}
        {/* <Button
          label={`Print ICard's (${selectedProducts.length})`}
          onClick={handlePrint}
          // disabled
          disabled={selectedProducts.length >= 1 ? false : true}
          className="bg-blue-600 hover:bg-blue-700 duration-200 text-white px-5"
        /> */}

        {/* <Button
          onClick={() => {
            setLable("s");
            setVisible(true);
          }}
          label="Create Student"
          className="bg-blue-600 hover:bg-blue-700 duration-200 text-white px-5"
        /> */}
      </div>
    );
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <Tag
        value={rowData.status === true ? "Active" : "De-active"}
        severity={getSeverity(rowData.status || false)}
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
        className="p-column-filter"
        showClear
        style={{ minWidth: "12rem" }}
      />
    );
  };

  const representativesItemTemplate = (option) => {
    return (
      <div className="flex w-10 h-10 align-items-center gap-2 border">
        <img alt={"student image"} src={option.image} />
      </div>
    );
  };

  const dOBTemplate = (option) => {
    return <span>{moment(option.dob).format("DD/MM/YYYY")}</span>;
  };

  const header = renderHeader();
  const footer = (
    <div className="text-xs">
      Total Student : {filterStudent ? filterStudent.length : 0}
    </div>
  );

  const updatetemplete = (event) => {
    return (
      <div className="py-1.5">
        <button
          onClick={() => {
            setSelectTeacher(event);
            setVisible(true);
            setLable("u");
          }}
          className="bg-blue-600 hover:bg-blue-700 duration-200 text-white p-1 rounded-full"
        >
          <BiEdit size={20} />
        </button>
      </div>
    );
  };

  useEffect(() => {
    if (imageFilterChecked === true) {
      setFilterStudent(
        ICards.filter(
          (doc) =>
            (doc.status === true && doc.print === false && doc.image == null) ||
            ""
        )
      );
    }
    if (imageFilterChecked === false) {
      setFilterStudent(
        ICards.filter(
          (doc) =>
            (doc.status === true && doc.print === false && doc.image != null) ||
            ""
        )
      );
    }
  }, [imageFilterChecked, ICards]);

  const imageFilterHeader = () => {
    return (
      <InputSwitch
        checked={imageFilterChecked}
        onChange={(e) => setImageFilterChecked(e.value)}
      />
    );
  };

  const prindedSubmit = () => {
    dispatch(updateManyIcards(selectedPrinted)).then(() => {
      dispatch(fetchAllIcards(localStorage.getItem("schoolid")));
      setSelectedPrinted([]);
    });
  };

  useEffect(() => {
    if (printAllSelect) {
      const data = filterStudent.filter(
        (doc) => doc.status === true && doc.print === false && doc.image != null
      );
      setSelectedPrinted(data.map((doc) => ({ ...doc, print: true })));
    } else {
      setSelectedPrinted([]);
    }
  }, [printAllSelect]);

  const printFilterHeader = () => {
    return (
      <div className="flex items-center gap-2">
        <Button
          label={`Move to Printed (${selectedPrinted.length})`}
          className="bg-blue-600  w-24 p-2 text-white hover:bg-blue-700 duration-200"
          onClick={prindedSubmit}
        />
        <Checkbox
          checked={printAllSelect}
          onChange={(e) => setPrintAllSelect(e.checked)}
        />
      </div>
    );
  };

  const printFilterBody = (rowData) => {
    const isSelected = selectedPrinted.some(
      (product) => product._id === rowData._id
    );
    return (
      <div className="flex items-center gap-2">
        <Checkbox
          checked={isSelected}
          onChange={(e) => {
            const checked = e.checked;
            const updatedSelectedProducts = [...selectedPrinted];

            if (checked) {
              if (rowData.image !== null || "") {
                updatedSelectedProducts.push({ ...rowData, print: true });
              } else {
                showInfo("Image Not Uploaded !!!");
              }
            } else {
              const index = updatedSelectedProducts.findIndex(
                (product) => product._id === rowData._id
              );
              if (index !== -1) {
                updatedSelectedProducts.splice(index, 1);
              }
            }

            setSelectedPrinted(updatedSelectedProducts);
          }}
        />
        <i
          className={`pi ${
            rowData.print
              ? "true-icon pi-check-circle text-green-500"
              : "false-icon pi-times-circle text-red-500"
          }`}
        />
      </div>
    );
  };

  useEffect(() => {
    if (allSelect) {
      setSelectedProducts(
        filterStudent.filter(
          (doc) =>
            doc.status === true && doc.print === false && doc.image != null
        )
      );
    } else {
      setSelectedProducts([]);
    }
  }, [filterStudent, allSelect]);

  const selectFilterHeader = () => {
    return (
      <Checkbox checked={allSelect} onChange={(e) => setAllSelect(e.checked)} />
    );
  };

  const selectFilterBody = (rowData) => {
    const isSelected = selectedProducts.some(
      (product) => product._id === rowData._id
    );
    return (
      <Checkbox
        checked={isSelected}
        onChange={(e) => {
          const checked = e.checked;
          const updatedSelectedProducts = [...selectedProducts];

          if (checked) {
            if (rowData.image !== null || "") {
              updatedSelectedProducts.push(rowData);
            } else {
              showInfo("Image Not Uploaded !!!");
            }
          } else {
            const index = updatedSelectedProducts.findIndex(
              (product) => product._id === rowData._id
            );
            if (index !== -1) {
              updatedSelectedProducts.splice(index, 1);
            }
          }

          setSelectedProducts(updatedSelectedProducts);
        }}
      />
    );
  };

  const showInfo = (message) => {
    toast.current.show({ severity: "info", detail: message, life: 3000 });
  };

  const showSuccess = (message) => {
    toast.current.show({
      severity: "success",
      detail: message,
      life: 3000,
    });
  };

  useEffect(() => {
    if (message) {
      showSuccess(message);
    }
    if (error) {
      showInfo(error);
    }
  }, [message, error]);

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        header={label === "s" ? "Create Student" : "Update Student"}
        visible={visible}
        onHide={() => setVisible(false)}
        style={{ width: "25vw" }}
        draggable={false}
      >
        <ICardForm
          item={selectTeacher}
          visbile={() => setVisible(false)}
          label={label}
        />
      </Dialog>
      <Dialog
        header="Student's Bulk Upload via Excel"
        visible={visible2}
        onHide={() => setVisible2(false)}
        style={{ width: "50vh" }}
        draggable={false}
      >
        <BulkUpload visbile={() => setVisible2(false)} />
      </Dialog>
      <div className="card">
        <DataTable
          value={filterStudent}
          footer={footer}
          size="small"
          scrollable
          scrollHeight="80vh"
          // loading={loading}
          dataKey="_id"
          filters={filters}
          filterDisplay="row"
          globalFilterFields={["name", "class", "section","photonumber","year"]}
          className="h-full  relative px-3"
          stripedRows
          header={header}
          emptyMessage="No customers found."
          metaKeySelection={false}
          selectionMode="checkbox"
          selection={selectedProducts}
          onSelectionChange={(e) => setSelectedProducts(e.value)}
        >
          {/* <Column
            // filter
            selectionMode="multiple"
            showFilterMenu={false}
            body={selectFilterBody}
            // filterElement={selectFilterHeader}
            headerStyle={{ minWidth: "2rem" }}
          ></Column> */}
          {/* <Column
            header={"Action"}
            body={updatetemplete}
            headerStyle={{ minWidth: "2rem" }}
            headerClassName="text-xs"
            bodyClassName=""
            className="text-xs flex items-center"
          ></Column> */}
             <Column
                      field="photonumber"
                      header="Serial No."
                      filter
                      showFilterMenu={false}
                      filterPlaceholder="Search"
                      style={{ minWidth: "5rem", maxWidth: "4rem" }}
                      bodyClassName="h-full text-center"
                      filterHeaderClassName="p-0"
                      headerClassName="text-xs p-0 pl-0"
                      className="text-xs"
                    />
          <Column
            field="admission_id"
            header="Admi. No."
            filter
            showFilterMenu={false}
            filterPlaceholder="Search"
            style={{ minWidth: "5rem", maxWidth: "4rem" }}
            bodyClassName="h-full text-center"
            filterHeaderClassName="p-0"
            headerClassName="text-xs p-0 pl-0"
            className="text-xs"
          />
          <Column
            field="image"
            header="Image"
            filter
            showFilterMenu={false}
            body={representativesItemTemplate}
            filterElement={imageFilterHeader}
            bodyClassName="px-0 "
            filterHeaderClassName="p-0 pl-2 "
            headerClassName="text-xs text-center pl-3"
            className="text-xs"
          />
          <Column
            field="name"
            header="Name"
            filter
            showFilterMenu={false}
            filterPlaceholder="Search by name"
            style={{ minWidth: "8rem", maxWidth: "12rem" }}
            filterHeaderClassName="p-0"
            headerClassName="text-xs pl-0"
            className="text-xs p-0 px-0"
          />
          <Column
            field="father_name"
            header="Father Name"
            style={{ minWidth: "10rem", maxWidth:"14rem", padding: 0 }}
            filterHeaderClassName="p-0"
            headerClassName="text-xs p-0 pl-0"
            className="text-xs p-0 px-0"
          />
          <Column
            field="oldclass"
            header="Class"
            filter
            showFilterMenu={false}
            filterPlaceholder="class"
            style={{ minWidth: "6rem", maxWidth:"8rem", padding: 0 }}
            headerClassName="text-xs p-0"
            filterHeaderClassName="p-0"
            className="text-xs"
          />
          <Column
            field="oldsection"
            header="Section"
            filter
            showFilterMenu={false}
            filterPlaceholder="section"
            style={{ minWidth: "6rem", maxWidth:"6rem" }}
            headerClassName="text-xs p-0"
            filterHeaderClassName="p-0"
            className="text-xs p-0"
          />
          <Column
            field="dob"
            header="DOB"
            style={{ minWidth: "4rem" }}
            body={dOBTemplate}
            headerClassName="text-xs p-0"
            bodyClassName={"p-0"}
            className="text-xs"
          />
          <Column
            field="address"
            header="Address"
            style={{ minWidth: "8rem" }}
            headerClassName="text-xs p-0"
            bodyClassName={"p-0"}
            className="text-xs"
          />
          <Column
            field="mobile"
            header="Mobile"
            style={{ minWidth: "5rem" }}
            headerClassName="text-xs p-0"
            bodyClassName={"p-0"}
            className="text-xs"
          />
          <Column
            field="oldyear"
            header="Old Year"
            style={{ minWidth: "5rem" }}
            headerClassName="text-xs p-0"
            bodyClassName={"p-0"}
            className="text-xs"
          />
          {/* <Column
            field="status"
            header="Status"
            showFilterMenu={false}
            filterMenuStyle={{ width: "0rem" }}
            style={{ minWidth: "2rem" }}
            body={statusBodyTemplate}
            filterElement={statusRowFilterTemplate}
            headerClassName="text-xs p-0"
            bodyClassName={"p-0"}
            className="text-xs"
          /> */}
          {/* <Column
            field="print"
            header="Printed"
            showFilterMenu={false}
            filterMenuStyle={{ width: "10rem" }}
            style={{ minWidth: "2rem" }}
            filter
            body={printFilterBody}
            filterElement={printFilterHeader}
            bodyClassName="pl-16 p-0"
            filterHeaderClassName="p-0 pl-6"
            headerClassName="text-xs p-0 pl-12"
            className="text-xs"
          /> */}
        </DataTable>
      </div>
    </>
  );
}
