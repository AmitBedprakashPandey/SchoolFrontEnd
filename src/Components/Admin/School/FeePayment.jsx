import { InputText } from "primereact/inputtext";
import { TabPanel, TabView } from "primereact/tabview";
import FeeHistory from "../Components/FeeHistory";
import Managment from "../Components/Managment";

function FeePayment(params) {
  return (
    <>
      <div className="flex gap-3 p-2">
        <InputText
          placeholder="Search by name"
          className="border border-gray-500 py-1.5 px-2"
        />
        <InputText
          placeholder="Search by admission no."
          className="border border-gray-500 py-1.5 px-2"
        />
      </div>
      <div>
        <TabView>
          <TabPanel header="Fees History">
            <FeeHistory />
          </TabPanel>
          <TabPanel header="Managment">
            <Managment />
          </TabPanel>
        </TabView>
      </div>
    </>
  );
}

export default FeePayment;
