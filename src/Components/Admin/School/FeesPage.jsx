import { Button } from "primereact/button";
import { PiMoneyDuotone } from "react-icons/pi";

import { TabView, TabPanel } from 'primereact/tabview';

import AdditionFees from "../Components/AdditionalFees";
import ClasswiseFees from "../Components/ClasswiseFees";

function FeesPage(params) {
    return(
        <>
        <div className=" flex-1 p-1.5 bg-blue-500">
            <div>
                <h1 className="text-white font-bold">Student Fees</h1>
            </div>
        </div>


        <div className="flex-1 p-1.5">
           <TabView>
            <TabPanel header="Classwise" headerClassName="text-xs">
<ClasswiseFees/>
            </TabPanel>
            <TabPanel header="Additional" headerClassName="text-xs">
<AdditionFees/>
            </TabPanel>
           </TabView>
        </div>







        
        </>
    )
}


export default FeesPage;