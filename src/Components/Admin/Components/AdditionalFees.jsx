import { Button } from "primereact/button";
import { PiPencilLineDuotone, PiPlus, PiTrash } from "react-icons/pi";

import { Dialog } from "primereact/dialog";
import Loading from "../../../Components/Loading";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { memo, useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";

function AdditionFees(params) {
  const [model, setModel] = useState(false);
  const [buttonStatus, setButtonStatus] = useState(true);

    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    }, []);

  const ActionBody = (rowData) => {
    return (
      <div className="flex gap-2">
        <Button
          icon={<PiPencilLineDuotone />}
          className=" text-white px-1 py-0.5 bg-blue-500"
        />
        <Button icon={<PiTrash />} className=" text-white p-0.5 bg-red-500" />
      </div>
    );
  };
  return (
    <>
    {loading && <Loading />}
      <div>
        <Button
          icon={<PiPlus />}
          label="Create Fees"
          className="bg-blue-500 text-white px-3 py-1 gap-2"
          onClick={() => setModel(true)}
        />
      </div>
      <Dialog
        header={buttonStatus ? "Update Fees" : "Create Fees"}
        contentClassName="px-5 py-3"
        headerClassName="text-xs px-5 py-3"
        visible={model}
        onHide={() => setModel(false)}
        className="w-96"
        position="center"
      >
        <AdditionalFeeForm buttomFormStatus={buttonStatus} />
      </Dialog>
      <div>
        <DataTable size="small">
          <Column header="#" headerClassName="text-xs" />
          <Column header="Name" headerClassName="text-xs" />
          <Column header="Class" headerClassName="text-xs" />
          <Column header="Feetype" headerClassName="text-xs" />
          <Column header="Amount" headerClassName="text-xs" />
          <Column header="Actions" headerClassName="text-xs" body={ActionBody}/>
        </DataTable>
      </div>
      ClasswiseFees
    </>
  );
}

export default AdditionFees;

const AdditionalFeeForm = ({buttomFormStatus}) => {
  const feetype = [
    { name: "Monthly" },
    { name: "Quarterly" },
    { name: "Half Yearly" },
    { name: "Annually" },
  ];

  return (
    <div className="grid gap-3">
      <div className="grid">
        <label className="text-xs font-bold">Class</label>
        <Dropdown
          name="class"
          placeholder="Select class"
          className="border border-gray-400"
        />
      </div>
      <div className="grid">
        <label className="text-xs font-bold">Title</label>
        <InputText
          name="class"
          placeholder="Enter name"
          className="h-9 border border-gray-400 rounded-md px-3 text-xs"
        />
      </div>
      <div className="grid">
        <label className="text-xs font-bold">Fee Type</label>
        <Dropdown
          name="feetype"
          options={feetype}
          optionLabel="name"
          optionValue="name"
          placeholder="Select feetype"
          className="border border-gray-400"
        />
      </div>
      <div className="grid">
        <label className="text-xs font-bold">Amount</label>
        <InputNumber
            name="amount"
          useGrouping={true}
          placeholder="Enter amount"
          inputClassName="h-9 border border-gray-400 rounded-md px-3 text-xs"
          className="border-gray-400"
        />
      </div>
      
      <Button
        label={buttomFormStatus ? "Update" : "Save"}
        className={`${buttomFormStatus ? "bg-blue-500" :"bg-green-500"} py-1.5 disabled:cursor-not-allowed`}
        disabled
      />
    </div>
  );
};
