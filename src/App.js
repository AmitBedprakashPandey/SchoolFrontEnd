import "./App.css";
import "react-image-crop/dist/ReactCrop.css";
import { Route, Routes } from "react-router-dom";
// import LoginPage from "./Teacher/Componets/LoginPage";
import LoginPage from "./Components/LoginPageForALL";
import Home from "./Teacher/Home";
import TeacherMenuList from "./Teacher/Componets/MenuList";
import ICard from "./Teacher/Componets/ICard";
import PrintPage from "./Components/PrintPage";
import AdmitCardPrint from "./Components/AdmitCardPrint";
import BulkExcelUploadForm from "./Components/BulkExcelUploadForm";
import ImageCropper from "./Components/ImageCropper";
import Admin from "./Components/Admin/AdminHome";
import AdminLogin from "./Components/Admin/LoginPage";
import Class from "./Components/Admin/School/Class";
import Section from "./Components/Admin/School/Section";
import Students from "./Components/Admin/School/Students";
import Teacher from "./Components/Admin/School/Teacher";
import PartyHome from "./Components/Party/PartyHome";
import PartyLogin from "./Components/Party/LoginPage";
import PartyICard from "./Components/Party/ICard";
import ImageCropTest from "./Components/ImageCropTest";
import PrintedICards from "./Components/Admin/School/PrindedIcards";
import DeActiveWithoutImage from "./Components/Admin/School/DeActiveWithoutImage";
import AdmitCard from "./Components/Admin/School/AdmitCard";
import FeesPage from "./Components/Admin/School/FeesPage";
import FeePayment from "./Components/Admin/School/FeePayment";
import SessionUpgrade from "./Components/Admin/School/SessionUpgrade";
import OldStudent from "./Components/Admin/School/OldStudent";
import Attendance from "./Components/Admin/Attendance/AttendanceSheet";
function App() {
  
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Home />}>
          <Route index element={<TeacherMenuList />} />
          <Route index path="icard" element={<ICard />} />
        </Route>
        <Route path="/test" element={<ImageCropTest />} />
        <Route path="/crop" element={<ImageCropper />} />
        <Route path="/print" element={<PrintPage />} />
        <Route path="/admitcardprint" element={<AdmitCardPrint />} />
        <Route path="/bulk" element={<BulkExcelUploadForm />} />
        <Route path="/adminlogin" element={<AdminLogin />} />

        <Route path="/admin" element={<Admin />}>
          <Route path="class" element={<Class />} />
          <Route path="section" element={<Section />} />
          <Route path="teacher" element={<Teacher />} />
          <Route path="student" element={<Students />} />
          <Route path="oldstudent" element={<OldStudent />} />
          <Route path="admitcard" element={<AdmitCard />} />
          <Route path="sessionupgrade" element={<SessionUpgrade />} />
          <Route path="setfees" element={<FeesPage />} />
          <Route path="feespayment" element={<FeePayment />} />
          <Route path="printed" element={<PrintedICards />} />
          <Route
            path="deactivewithoutimage"
            element={<DeActiveWithoutImage />}
          />
          <Route path="attendence" element={<Attendance />} />
        </Route>

        <Route path="/thirdpartylogin" element={<PartyLogin />} />
        <Route path="/thirdparty/icard" element={<PartyICard />} />
        <Route path="/thirdparty" element={<PartyHome />}></Route>
      </Routes>
    </>
  );
}

export default App;
