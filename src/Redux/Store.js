import { configureStore } from "@reduxjs/toolkit";
import ICard from "./Slice/IcardSlice";
import LoginSlice from "./Slice/LoginSlice";
import SchoolSlice from "./Slice/SchoolSlice";
import ClassSlice from "./Slice/ClassSlice";
import SectionSlice from "./Slice/SectionSlice";
import TeacherSlice from "./Slice/TeacherSlice";
import TemplateSlice from "./Slice/TemplateSlice";
import PartySlice from "./Slice/PartySlice";
import AdminLoginSlice from "./Slice/AdminLoginSlice";
import AdmitCardTemplate from "./Slice/AdmitCardTemplate";
import PhotoNumberSlice from "./Slice/PhotoNumberSlice";
import AttendanceSlice from "./Slice/AttendanceSlice";
export const Store = configureStore({
  reducer: {
    SchoolAdmin: AdminLoginSlice,
    Icard: ICard,
    Auth: LoginSlice,
    School: SchoolSlice,
    Class: ClassSlice,
    Section: SectionSlice,
    Teacher: TeacherSlice,
    TeacherAuth: TeacherSlice,
    Template: TemplateSlice,
    PartyAuth: PartySlice,
    AdmitCardTemplate : AdmitCardTemplate,
    PhotoNumber:PhotoNumberSlice,
    Attendance:AttendanceSlice
  },
});
