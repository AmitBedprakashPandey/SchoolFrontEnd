import Compressor from "compressorjs";
import { Calendar } from "primereact/calendar";
import { Checkbox } from "primereact/checkbox";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { ConfirmPopup } from "primereact/confirmpopup";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AllClassBySchoolStatus } from "../Redux/Slice/ClassSlice";
import { createIcard, updateIcard } from "../Redux/Slice/IcardSlice";
import { AllSectionBySchoolStatus } from "../Redux/Slice/SectionSlice";
import {
  getPhotoNumberBySchoolId,
  updatePhotoNumber,
} from "../Redux/Slice/PhotoNumberSlice";
import No_Image from "./Assets/Image/NO_IMAGE.jpg";
import Loading from "./Loading";

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { BiCamera, BiMenu } from "react-icons/bi";
import ImageCropper from "./ImageCropper2";
import { PiCheck } from "react-icons/pi";
import moment from "moment/moment";
import SessionUpgrade from "./Admin/Components/SessionUpgrade";
// import { Image } from "primereact/image";

export default function ICardForm({ item, label, visbile, disble }) {
  const [formData, setFormData] = useState({
    address: "",
    father_name: "",
    name: "",
    mobile: "",
    image: "",
    class: "",
    dob: null,
    schoolid: localStorage.getItem("schoolid"),
    admission_id: "",
    section: "",
    status: false,
    print: false,
  });
  const { loading } = useSelector((state) => state.Icard);
  const [visbileModel, setVisbileModel] = useState(false);
  const [visbiles, setVisbiles] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [upgrade, setUpgrade] = useState(false);
  const [date, setDate] = useState();
  const [checked, setChecked] = useState(false);
  const [checkedPrint, setCheckedPrint] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [fatherImage, setFatherImage] = useState(null);
  const [motherImage, setMotherImage] = useState(null);
  const [guardianImage, setGuardianImage] = useState(null);
  const [aspectRatio, setAspectRatio] = useState();
  const currentYear = moment().year();
  const disptch = useDispatch();
  const { Classs } = useSelector((state) => state.Class);
  const { PhotoNumber, Numbers } = useSelector((state) => state.PhotoNumber);
  const { Sections } = useSelector((state) => state.Section);
  const formDataHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useLayoutEffect(() => {
    disptch(AllClassBySchoolStatus(localStorage.getItem("schoolid")));
    disptch(AllSectionBySchoolStatus(localStorage.getItem("schoolid")));
    disptch(getPhotoNumberBySchoolId(localStorage.getItem("schoolid")));
  }, [disptch]);

  useLayoutEffect(() => {
    if (label === "u" && item) {
      setFormData(item);
      setDate(new Date(item.dob));
      setChecked(item.status);
      setCheckedPrint(item.print);
      setSelectedClass(item.class);
      setSelectedSection(item.section);
      setImageData(item.image);
      setFatherImage(item.fatherimage);
      setMotherImage(item.motherimage);
      setGuardianImage(item.guardianimage);
    }
    if (label === "s") {
      setSelectedClass("");
      setSelectedSection("");
      setFormData(formData);
      setFormData({ ...formData, photonumber: Numbers });
    }
  }, [label, item]);

  useEffect(() => {
    setFormData({
      ...formData,
      image: imageData,
      dob: date,
      status: checked,
      print: checkedPrint,
      section: selectedSection,
      class: selectedClass,
      motherimage: motherImage,
      fatherimage: fatherImage,
      guardianimage: guardianImage,
    });
  }, [
    imageData,
    date,
    checkedPrint,
    checked,
    fatherImage,
    motherImage,
    selectedSection,
    selectedClass,
    guardianImage,
  ]);

  const motherImageHandler = async (e) => {
    try {
      const base64String = await handleImageUpload(e.target.files[0]);
      setMotherImage(base64String);
    } catch (error) {
      console.error("Error handling father image:", error);
    }
  };

  const gaurdianImageHandler = async (e) => {
    try {
      const base64String = await handleImageUpload(e.target.files[0]);
      setGuardianImage(base64String);
    } catch (error) {
      console.error("Error handling father image:", error);
    }
  };

  const fatherImageHandler = async (e) => {
    try {
      const base64String = await handleImageUpload(e.target.files[0]);
      setFatherImage(base64String);
    } catch (error) {
      console.error("Error handling father image:", error);
    }
  };

  const handleImageUpload = (event) => {
    return new Promise((resolve, reject) => {
      const file = event; // Accessing the file from event

      try {
        new Compressor(file, {
          quality: 0.45,
          maxWidth: 500,
          resize: false,
          success: async (result) => {
            const base64String = await blobUrlToBase64(result);
            resolve(base64String);
            // You may set the base64 URL to state or perform other actions here
          },
          error(error) {
            console.error("Error compressing image:", error);
            reject(error);
          },
        });
      } catch (error) {
        console.error("Error compressing image:", error);
        reject(error);
      }
    });
  };

  async function blobUrlToBase64(blob) {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.onerror = (error) => {
          reject(error);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  const toast = useRef(null);

  const showErrorToast = (error) => {
    toast.current.show({
      severity: "info",
      summary: "Error Message",
      detail: error,
      life: 3000,
    });
  };

  const onSave = () => {
    disptch(
      createIcard({
        ...formData,
        schoolid: localStorage.getItem("schoolid"),
        number: Numbers,
      })
    ).then((doc) => {
      if (doc.payload?.response?.status !== 302) {
        visbile();
      }
      if (doc.payload.response?.data.error) {
        showErrorToast(doc.payload.response?.data.error);
      }
      disptch(updatePhotoNumber(PhotoNumber));
    });
  };

  const onUpdate = () => {
    disptch(
      updateIcard({ ...formData, school: localStorage.getItem("schoolid") })
    ).then(() => {
      visbile();
    });
  };

  const confirm1 = () => {
    confirmDialog({
      message: "Are you sure you want to save ?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      acceptClassName: "ml-3 bg-cyan-500 px-4 py-3 text-white",
      rejectClassName: "px-4 py-3",
      accept: onSave,
    });
  };
  const confirm2 = () => {
    confirmDialog({
      message: "Are you sure you want to update ?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      acceptClassName: "ml-3 bg-cyan-500 px-4 py-3 text-white",
      rejectClassName: "px-4 py-3",
      accept: onUpdate,
    });
  };

  const [image, setImage] = useState("");

  const handleOnChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = function () {
        setImage(reader.result);

        setVisbileModel(true);
      };
    }
  };

  // Callback function when cropping is done
  const onCropDone = async (imgCroppedArea) => {
    try {
      // Create a canvas element to crop the image
      setAspectRatio(imgCroppedArea);
      const canvasEle = document.createElement("canvas");
      canvasEle.width = imgCroppedArea.width;
      canvasEle.height = imgCroppedArea.height;

      const context = canvasEle.getContext("2d");

      // Load the selected image
      const imageObj1 = new Image();
      imageObj1.src = image;

      // Ensure the image loads fully before proceeding
      imageObj1.onload = async function () {
        try {
          // Draw the cropped portion of the image onto the canvas
          context.drawImage(
            imageObj1,
            imgCroppedArea.x,
            imgCroppedArea.y,
            imgCroppedArea.width,
            imgCroppedArea.height,
            0,
            0,
            imgCroppedArea.width,
            imgCroppedArea.height
          );

          // Convert the canvas content to a data URL (JPEG format)
          const dataURL = canvasEle.toDataURL("image/jpeg");

          // Convert dataURL to Blob
          const blob = await fetch(dataURL).then((res) => res.blob());

          // Compress the image using Compressor.js
          new Compressor(blob, {
            quality: 0.4,
            maxWidth: 500,
            success(result) {
              const reader = new FileReader();
              reader.readAsDataURL(result);
              reader.onloadend = () => {
                setImageData(reader.result);
                setVisbileModel(false); // Close the modal
              };
            },
            error(err) {
              console.error("Compression Error:", err.message);
            },
          });
        } catch (drawError) {
          console.error("Error drawing image on canvas:", drawError);
        }
      };

      imageObj1.onerror = (loadError) => {
        console.error("Image loading error:", loadError);
      };
    } catch (cropError) {
      console.error("Error in onCropDone function:", cropError);
    }
  };

  return (
    <>
      {/* <ConfirmDialog /> */}
      {/* <ConfirmPopup /> */}
      <Toast ref={toast} />
      {/* {loading && <Loading />} */}
      <Dialog
        visible={visbiles}
        header="Enter Parents Details"
        onHide={() => setVisbiles(false)}
        draggable={false}
      >
        <form className="text-xs">
          <div>
            <label htmlFor="fathername" className="capitalize font-medium">
              Upload father Photo
            </label>
            <span className="flex gap-3 items-center">
              {fatherImage && <img src={fatherImage} width={50} height={50} />}
              <input
                type="file"
                id="fathername"
                accept="image/*"
                name="fatherimage"
                onChange={fatherImageHandler}
                className="w-full h-8"
              />
            </span>
          </div>

          <span className="p-float-label mt-8">
            <InputText
              id="mothername"
              name="mothername"
              value={formData?.mothername}
              onChange={formDataHandler}
              className="border border-gray-300 w-full h-8 pl-3"
            />
            <label htmlFor="mothername">Enter Mother Name</label>
          </span>

          <div className="mt-3">
            <label htmlFor="motherimage">Upload Mother Photo </label>
            <span className="flex items-center gap-3">
              {motherImage && <img src={motherImage} width={50} />}
              <input
                type="file"
                id="motherimage"
                name="motherimage"
                accept="image/*"
                onChange={motherImageHandler}
                className="h-8 w-full"
              />
            </span>
          </div>

          <span className="p-float-label mt-8">
            <InputText
              id="guardianname"
              name="guardianname"
              value={formData?.guardianname}
              onChange={formDataHandler}
              className="border border-gray-300 w-full h-8 pl-3"
            />
            <label htmlFor="mothername">Enter Guardian Name</label>
          </span>

          <div className="mt-3">
            <label htmlFor="motherimage">Upload Guardian Photo </label>
            <span className="flex items-center gap-3">
              {guardianImage && <img src={guardianImage} width={50} />}
              <input
                mode="basic"
                type="file"
                id="motherimage"
                name="motherimage"
                accept="image/*"
                onChange={gaurdianImageHandler}
                className="h-8 w-full"
              />
            </span>
          </div>

          <span className="p-float-label mt-8">
            <InputText
              id="trasnport"
              name="transport"
              value={formData?.transport}
              onChange={formDataHandler}
              className="border border-gray-300 w-full h-8 pl-3"
            />
            <label htmlFor="trasnport">Enter Trasnport Mode</label>
          </span>
          <span className="p-float-label mt-8">
            <InputTextarea
              id="remark"
              name="remark"
              value={formData?.remark}
              onChange={formDataHandler}
              rows={5}
              className="border border-gray-300 pl-2 w-full"
              cols={30}
            />
            <label htmlFor="remark">Remark</label>
          </span>
        </form>
        <div className="flex justify-center w-full mt-5">
          <Button
            onClick={() => setVisbiles(false)}
            className="bg-blue-600 px-5 py-2 text-white"
            label="Done"
          />
        </div>
      </Dialog>
      <Dialog
        visible={upgrade}
        header="Student Session Upgrade"
        onHide={() => setUpgrade(false)}
        draggable={false}
      >
        <SessionUpgrade item={item} close={()=>{setUpgrade(setUpgrade(false)); visbile()}}/>
      </Dialog>
      <Dialog
        className="w-[95vw] md:w-[450px] h-[95vh] mx-2"
        header={"Adjust Image"}
        visible={visbileModel}
        onHide={() => {
          setVisbileModel(false);
          setImage("");
        }}
        draggable={false}
      >
        <ImageCropper image={image} onCropDone={onCropDone} />
      </Dialog>

      <div className="bg-white">
        <form className="flex flex-col items-center text-xs">
          <div className="flex justify-between w-full">
            <div className="relative my-3">
              <div className="w-20 h-20 border-2 border-black rounded-full overflow-hidden">
                <img
                  className="bg-center w-full h-full"
                  src={imageData || No_Image}
                  alt="student"
                />
              </div>
              <input
                type="file"
                hidden
                accept="image/png,image/jpeg,image/jpg"
                id="inpfile"
                onChange={handleOnChange}
              />
              <label
                htmlFor="inpfile"
                className=" border-gray-500 border-2 rounded-full w-6 h-6 flex justify-center items-center font-bold absolute bottom-0 right-0 bg-blue-500"
              >
                <BiCamera color="#fff" size={25} />
              </label>
            </div>
            <div className="flex flex-col gap-3">
              <Button
                type="button"
                onClick={() => setVisbiles(true)}
                // label={<BiMenu />}
                label="Add More"
                className="w- h-8 p-2 text-xs hover:bg-blue-600 hover:text-white duration-200 border border-blue-600"
              />
              <Button
                type="button"
                onClick={() => setUpgrade(true)}
                // label={<BiMenu />}
                label="Upgrade"
                className="w- h-8 p-2 text-xs hover:bg-blue-600 hover:text-white duration-200 border border-blue-600"
              />
            </div>
          </div>
          <div className="w-full  flex items-center my-1">
            <label
              htmlFor="number-input"
              className="font-semibold w-28 text-start text-nowrap text-xs"
            >
              Series no : {label === "u" ? formData?.photonumber : Numbers}
            </label>
          </div>
          <div className="w-full  flex items-center my-1">
            <label
              htmlFor="number-input"
              className="font-semibold w-28 text-start"
            >
              Adm. No.:
            </label>
            <InputText
              id="number-input"
              name="admission_id"
              value={formData.admission_id}
              onChange={formDataHandler}
              placeholder="Enter Admission Number"
              inputClassName="pl-2"
              useGrouping={false}
              className="pl-2 border-gray-300 border mx-3 w-full rounded-md h-8"
            />
          </div>
          <div className="w-full  flex items-center my-1">
            <label className="font-semibold w-28 text-start">Roll No.:</label>
            <InputText
              type="tel"
              name="rollno"
              value={formData.rollno}
              onChange={formDataHandler}
              useGrouping={false}
              placeholder="Enter Roll Number"
              inputClassName="pl-2"
              className="pl-2 border-gray-300 border h-8 mx-3 w-full rounded-md"
            />
          </div>
          <div className="w-full flex items-center my-1">
            <label className="font-semibold w-28 text-start">
              Name:<strong className="text-red-500">*</strong>
            </label>
            <InputText
              type="text"
              placeholder="Enter student name"
              name="name"
              disabled={disble}
              required
              value={formData.name}
              onChange={formDataHandler}
              className="border-gray-300 border mx-3 py-2 px-2 h-8 w-full rounded-md"
            />
          </div>
          <div className="w-full flex items-center my-1">
            <label className="font-semibold w-28 text-start">
              Class:<strong className="text-red-500">*</strong>
            </label>
            <Dropdown
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.value)}
              options={Classs}
              optionLabel="class"
              disabled={disble}
              optionValue="class"
              placeholder="Select Class"
              panelClassName="text-xs"
              className="placeholder:text-xs capitalize border-gray-300 border text-xs mx-3 h-8 w-full rounded-md"
            />
          </div>
          <div className="w-full flex items-center my-1">
            <label className="font-semibold w-28 text-start">
              Section:<strong className="text-red-500">*</strong>
            </label>
            <Dropdown
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.value)}
              options={Sections}
              optionLabel="section"
              disabled={disble}
              optionValue="section"
              placeholder="Select Section"
              className=" capitalize border-gray-300 border mx-3 h-8 w-full rounded-md"
            />
          </div>
          <div className="w-full flex items-center my-1">
            <label className="font-semibold w-28 text-start">
              Academic Year :<strong className="text-red-500">*</strong>
            </label>
            <select
              name="year"
              disabled={formData?.year ? true : false}
              value={formData?.year}
              onChange={formDataHandler}
              className="pl-2 border-gray-300 border mx-3 w-full rounded-md h-8"
            >
              <option selected disabled>
                Select Academic Year
              </option>
              <option>
                {currentYear - 1}- {currentYear}
              </option>
              <option>
                {currentYear}- {currentYear + 1}
              </option>
              <option>
                {currentYear + 1}- {currentYear + 2}
              </option>
            </select>
          </div>

          <div className="w-full flex items-center my-1">
            <label className="font-semibold w-24 mr-2 text-start">
              DOB:<strong className="text-red-500">*</strong>
            </label>{" "}
            <Calendar
              value={date}
              onChange={(e) => setDate(e.value)}
              dateFormat="dd/mm/yy"
              showIcon
              disabled={disble}
              placeholder="Enter date of birth"
              inputClassName="pl-3 text-xs placeholder:text-xs"
              className="border-gray-300 border mx-3 h-8 w-full rounded-md"
            />
          </div>
          <div className="w-full flex items-center my-1">
            <label className="font-semibold w-28 text-start">F. Name:</label>
            <InputText
              type="text"
              required
              name="father_name"
              value={formData.father_name}
              onChange={formDataHandler}
              disabled={disble}
              placeholder="Enter Father Name"
              className="border-gray-300 border mx-3 py-2 px-2 h-8 w-full rounded-md"
            />
          </div>
          <div className="w-full flex items-center my-1">
            <label className="font-semibold text-start">
              Contact:<strong className="text-red-500">*</strong>
            </label>{" "}
            <InputNumber
              type="tel"
              name="mobile"
              value={formData.mobile}
              onValueChange={formDataHandler}
              disabled={disble}
              placeholder="Enter Contact Number"
              useGrouping={false}
              className="w-full"
              inputClassName="ml-6 mr-3 pl-2 text-xs border-gray-300 placeholder:text-xs border h-8 w-full rounded-md"
            />
          </div>

          <div className="w-full flex items-center my-1">
            <label className="font-semibold w-28 text-start">Address:</label>{" "}
            <InputText
              type="text"
              name="address"
              required
              disabled={disble}
              value={formData.address}
              onChange={formDataHandler}
              placeholder="Enter Address"
              className="border-gray-300 border mx-3 py-2 px-2 h-8 w-full rounded-md"
            />
          </div>
          <div className="flex gap-3 my-2">
            <div className="flex items-center  gap-2">
              <Checkbox
                onChange={(e) => setChecked(e.checked)}
                checked={checked}
                className="border-gray-400 border rounded-md"
              ></Checkbox>
              <label htmlFor="checkstatus" className="font-bold">
                Active
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                onChange={(e) => setCheckedPrint(e.checked)}
                checked={checkedPrint}
                className="border-gray-400 border rounded-md"
              ></Checkbox>
              <label htmlFor="checkstatus" className="font-bold">
                Printed
              </label>
            </div>
          </div>
        </form>
        <div className="flex justify-center">
          {label === "s" ? (
            <Button
              label="save"
              icon={<PiCheck size={20} />}
              disabled={
                imageData && selectedClass && selectedSection ? false : true
              }
              // formData.name &&
              // formData.mobile
              //   ? false
              //   : true
              // date &&
              loading={loading}
              onClick={confirm1}
              className="text-xs gap-2 px-5 py-2 bg-green-600 hover:bg-green-700 text-white my-2 disabled:bg-green-800"
            ></Button>
          ) : (
            <Button
              label="update"
              icon="pi pi-check"
              onClick={confirm2}
              disabled={loading}
              loading={loading}
              className="text-xs gap-2 px-5 py-2 bg-green-600 hover:bg-green-700 text-white my-2 disabled:bg-green-800"
            ></Button>
          )}
        </div>
      </div>
    </>
  );
}
