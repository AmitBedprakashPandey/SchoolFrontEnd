import "jspdf-autotable";
import moment from "moment";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { Paginator } from "primereact/paginator";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import ReactToPrint from "react-to-print";
import { AllTemplateBySchoolStatus } from "../Redux/Slice/TemplateSlice";
import "./print.css";

export default function PrintPage() {
  const data = useLocation();
  const [template, setTemplate] = useState("");
  const [template2, setTemplate2] = useState("");
  const [temp, setTemp] = useState();
  const [temp2, setTemp2] = useState();
  const dispatch = useDispatch();
  const refs = useRef([]);
  const refBulk = useRef();
  let cardsPerPage = temp2 && temp ? 5 : 10;

  useEffect(() => {
    dispatch(AllTemplateBySchoolStatus(localStorage.getItem("schoolid"))).then(
      (doc) => {
        setTemp(doc.payload[0]?.tempimage);
        setTemplate(doc.payload[0]?.temp);
        setTemp2(doc.payload[0]?.tempimage2 || undefined);
        setTemplate2(doc.payload[0]?.temp2);
      }
    );
  }, [dispatch, temp, temp2]);

  const renderTemplate = (data) => {
    let modifiedTemplate = template;
    modifiedTemplate = modifiedTemplate.replace("${PuchSheelIcard}", temp);
    modifiedTemplate = modifiedTemplate.replace("${NO_IMAGE}", data?.image);
    modifiedTemplate = modifiedTemplate.replace("${name}", data?.name);
    modifiedTemplate = modifiedTemplate.replace("${class}", data?.class);
    modifiedTemplate = modifiedTemplate.replace("${section}", data?.section);

    modifiedTemplate = modifiedTemplate.replace(
      "${mothername}",
      data?.mothername
    );
    modifiedTemplate = modifiedTemplate.replace(
      "${admission_id}",
      data?.admission_id
    );
    modifiedTemplate = modifiedTemplate.replace("${rollno}", data?.rollno);
    modifiedTemplate = modifiedTemplate.replace("${remark}", data?.remark);
    modifiedTemplate = modifiedTemplate.replace(
      "${transport}",
      data?.transport || "Self"
    );
    modifiedTemplate = modifiedTemplate.replace(
      "${father_name}",
      data?.father_name
    );
    modifiedTemplate = modifiedTemplate.replace(
      "${dob}",
      moment(data?.dob).format("DD/MM/YYYY")
    );
    modifiedTemplate = modifiedTemplate.replace("${mobile}", data?.mobile);
    modifiedTemplate = modifiedTemplate.replace("${address}", data?.address);
    return modifiedTemplate;
  };

  const renderTemplate2 = (data) => {
    let modifiedTemplate = template2 || "";
    modifiedTemplate = modifiedTemplate.replace("${PuchSheelIcard}", temp2);
    modifiedTemplate = modifiedTemplate.replace(
      "${fathername}",
      data?.father_name
    );
    modifiedTemplate = modifiedTemplate.replace(
      "${fatherimage}",
      data?.fatherimage
    );
    modifiedTemplate = modifiedTemplate.replace(
      "${mothername}",
      data?.mothername
    );
    modifiedTemplate = modifiedTemplate.replace(
      "${admission_id}",
      data?.admission_id
    );
    modifiedTemplate = modifiedTemplate.replace(
      "${motherimage}",
      data?.motherimage
    );
    modifiedTemplate = modifiedTemplate.replace(
      "${guardianname}",
      data?.guardianname
    );
    modifiedTemplate = modifiedTemplate.replace(
      "${guardianimage}",
      data?.guardianimage
    );

    modifiedTemplate = modifiedTemplate.replace(
      "${mothername}",
      data?.mothername
    );
    return modifiedTemplate;
  };

  const totalCards = data.state.student.length;
  const totalPages = Math.ceil(totalCards / cardsPerPage);

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [page, setPage] = useState(0);

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
    setPage(event.page);
    
  };

  const BulkPrint = () => {
    return (
      <div
        className="A4Page relative hidden  print:block"
        style={{ pageBreakAfter: "always" }}
        ref={refBulk}
      >
        <div className="relative grid gap-3 portrait:grid-cols-2 landscape:grid-cols-5 border-2 print:border-none border-black">
          {data.state.student.map((item, index) => (
            <div className="flex flex-col">
              <div
                key={index}
                className="my-2"
                dangerouslySetInnerHTML={{ __html: renderTemplate(item) }}
              />
              {temp2 && (
                <>
                  <Divider className="border my-3" />
                  <div
                    key={index}
                    className="my-2"
                    dangerouslySetInnerHTML={{ __html: renderTemplate2(item) }}
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  useEffect(() => {
    BulkPrint();
  }, [data]);
  const printHandler = () => {
    console.log(data);
  };
  return (
    <>
      {template == null && temp == null ? (
        <Dialog visible={true} maximized showHeader={false}>
          <div className="flex flex-col justify-center items-center h-full w-full">
            <span className="text-7xl">🫤</span>
            <h1 className="text-4xl">Student Icard Not available</h1>
            <small>
              Please contact your service provider to update icard templete
            </small>
          </div>
        </Dialog>
      ) : (
        ""
      )}
      <div className="flex items-center px-5">
        <ReactToPrint
          trigger={() => (
            <Button
              onClick={printHandler}
              className="py-2 px-10 text-xs bg-cyan-500 text-white"
            >
              Print
            </Button>
          )}
          content={() => refs.current[page]} // Assuming only one page is printed at a time
        />

        <div className="card">
          <Paginator
            first={first}
            rows={rows}
            totalRecords={totalCards}
            onPageChange={onPageChange}
          />
        </div>

        <ReactToPrint
          trigger={() => (
            <Button
              onClick={BulkPrint}
              className="py-2 px-10 text-xs bg-cyan-500 text-white"
            >
              Print
            </Button>
          )}
          content={() => refBulk.current} // Assuming only one page is printed at a time
        />
      </div>
      {<BulkPrint />}
      {Array.from({ length: totalPages }, (_, pageIndex) => (
        <React.Fragment key={pageIndex}>
          {/* <span className="page-number border border-black h-10 w-15 rounded-full">{pageIndex + 1}</span> */}
          <div
            className="A4Page  relative px-5 "
            style={{ pageBreakAfter: "always" }}
            ref={(el) => (refs.current[pageIndex] = el)}
          >
            <div className="relative grid gap-3 portrait:grid-cols-2 landscape:grid-cols-5 border-2 print:border-none border-black">
              {data.state.student
                .slice(pageIndex * cardsPerPage, (pageIndex + 1) * cardsPerPage)
                .map((item, index) => (
                  <div className="flex flex-col gap-4">
                    <div
                      key={index}
                      className="my-2"
                      dangerouslySetInnerHTML={{ __html: renderTemplate(item) }}
                    />
                    {temp2 && (
                      <>
                        <Divider className="border my-3" />
                        <div
                          key={index}
                          className="my-2"
                          dangerouslySetInnerHTML={{
                            __html: renderTemplate2(item),
                          }}
                        />
                      </>
                    )}
                  </div>
                ))}
            </div>
            {/* <span className="page-number">{pageIndex + 1}</span> */}
          </div>
          {pageIndex !== totalPages - 1 && <div className="page-break"></div>}
        </React.Fragment>
      ))}
    </>
  );
}
