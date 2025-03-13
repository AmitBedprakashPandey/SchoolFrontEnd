import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useLayoutEffect, useState } from "react";
import { AllClass } from "../../../Redux/Slice/ClassSlice";
import { AllSection } from "../../../Redux/Slice/SectionSlice";
import {
  fetchAllIcards,
  updateSessionStudentsMany,
} from "../../../Redux/Slice/IcardSlice";
import { Checkbox } from "primereact/checkbox";
import { confirmDialog } from "primereact/confirmdialog";
import moment from "moment";
function SessionUpgrade(params) {
  const dispatch = useDispatch();
  const [selectClass, setSelectClass] = useState();
  const [selectSection, setSelectSection] = useState();
  const [selectNewClass, setSelectNewClass] = useState();
  const [selectNewSection, setSelectNewSection] = useState();
  const [selectNewYear, setSelectNewYear] = useState();
  const { ICards } = useSelector((state) => state.Icard);
  const { Sections } = useSelector((state) => state.Section);
  const { Classs } = useSelector((state) => state.Class);
  const [filterStudents, setFilterStudents] = useState();
  const [selectedStudents, setSelectedStudents] = useState([]);

  useLayoutEffect(() => {
    dispatch(AllClass(localStorage.getItem("schoolid")));
    dispatch(AllSection(localStorage.getItem("schoolid")));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAllIcards(localStorage.getItem("schoolid")));
  }, [dispatch]);

  useEffect(() => {
    setFilterStudents(
      ICards.filter(
        (item) => item.class === selectClass && item.section === selectSection
      )
    );
  }, [selectClass, selectSection, ICards]);

  useEffect(() => {}, [selectNewClass, selectNewSection]);

  const selectFilterBody = (rowData) => {
    const isSelected = selectedStudents.some(
      (product) => product._id === rowData._id
    );
    return (
      <Checkbox
        checked={isSelected}
        onChange={(e) => {
          const checked = e.checked;
          const updatedSelectedProducts = [...selectedStudents];

          if (checked) {
            const index = updatedSelectedProducts.findIndex(
              (product) => product._id === rowData._id
            );
            if (index !== -1) {
              updatedSelectedProducts.splice(index, 1);
            }
          }
          console.log(updatedSelectedProducts);

          setSelectedStudents(updatedSelectedProducts);
        }}
      />
    );
  };

  const Year = [
    { year: moment().year() - 1 + "-" + moment().year() },
    { year: moment().year() + "-" + (moment().year() + 1) },
  ];

  const confirm1 = () => {
    confirmDialog({
      message: "Are you sure you want to promte ?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      acceptClassName: "ml-3 bg-cyan-500 px-4 py-3 text-white",
      rejectClassName: "px-4 py-3",
      accept: onsubmit,
    });
  };

  const onsubmit = () => {
    dispatch(
      updateSessionStudentsMany({
        selectedStudents,
        newData: {
          newClass: selectNewClass,
          newSection: selectSection,
          newYear: selectNewYear,
        },
      })
    ).then(() => {
      dispatch(fetchAllIcards(localStorage.getItem("schoolid")));
      setSelectNewClass();
      setSelectClass();
      setSelectNewSection();
      setSelectSection();
      setSelectNewYear();
    });
  };

  return (
    <>
      <div className="p-2">
        <header className="font-medium">Student Promotion</header>
      </div>
      <div className="w-full flex items-center">
        <div className="p-2">
          <label>From</label>
          <div className="w-full flex gap-3">
            <Dropdown
              placeholder="Select Class"
              className="w-56 border-2"
              options={Classs}
              optionLabel="class"
              optionValue="class"
              value={selectClass}
              onChange={(e) => setSelectClass(e.value)}
            />
            <Dropdown
              placeholder="Select Section"
              className="w-56 border-2"
              options={Sections}
              optionLabel="section"
              optionValue="section"
              value={selectSection}
              onChange={(e) => setSelectSection(e.value)}
            />
          </div>
        </div>
        <div className="p-2">
          <label>To</label>
          <div className="w-full flex gap-3">
            <select
              disabled={selectClass && selectSection ? false : true}
              className="w-56 border-2 rounded-md"
              value={selectNewClass}
              onChange={(e) => setSelectNewClass(e.target.value)}
            >
              <option selected disabled>
                Select Class
              </option>
              {Classs.map((item, index) => (
                <option
                  key={index}
                  disabled={item.class === selectClass ? true : false}
                  value={item.class}
                >
                  {item.class}
                </option>
              ))}
            </select>
            <Dropdown
              disabled={selectClass && selectSection ? false : true}
              className="w-56 border-2"
              placeholder="Select Section"
              value={selectNewSection}
              options={Sections}
              optionLabel="section"
              optionValue="section"
              onChange={(e) => setSelectNewSection(e.target.value)}
            />

            <Dropdown
              disabled={selectClass && selectSection ? false : true}
              placeholder="Select Acdemic Year"
              className="w-56 border-2"
              value={selectNewYear}
              options={Year}
              optionLabel="year"
              optionValue="year"
              onChange={(e) => setSelectNewYear(e.value)}
            />
          </div>
        </div>
        <div className="pt-5">
          <Button
            disabled={
              selectClass &&
              selectSection &&
              selectNewClass &&
              selectNewSection &&
              selectNewYear &&
              selectedStudents.length
                ? false
                : true
            }
            label={`Promote selected Students (${selectedStudents.length})`}
            className="uppercase bg-blue-500 text-white py-2 px-2"
            onClick={confirm1}
          />
        </div>
      </div>

      <div>
        <DataTable
          size="small"
          dataKey="_id"
          value={filterStudents}
          selection={selectedStudents}
          selectionMode="checkbox"
          onSelectionChange={(e) => setSelectedStudents(e.value)}
        >
          <Column
            header=""
            className="w-16"
            selectionMode="multiple"
            showFilterMenu={false}
            body={selectFilterBody}
          />
          <Column header="Name" field="name" />
          <Column header="Roll No." field="rollno" />
          <Column header="Class" field="class" />
          <Column header="Section" field="section" />
        </DataTable>
      </div>
    </>
  );
}

export default SessionUpgrade;
