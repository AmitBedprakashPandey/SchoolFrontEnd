import React, { useState } from "react";
import {
  PiCalendarBlank,
  PiCheckCircle,
  PiXCircle,
  PiStar,
  PiCaretLeftBold,
  PiCaretRightBold,
  PiAirplane,
  PiClock,
} from "react-icons/pi";

const employees = [
  { id: 1, name: "Jacob Ryan", avatar: "https://example.com/avatar1.jpg" },
  { id: 2, name: "Angelica Ramos", avatar: "https://example.com/avatar2.jpg" },
  { id: 3, name: "Jens Brincker", avatar: "https://example.com/avatar3.jpg" },
  { id: 4, name: "Mark Hay", avatar: "https://example.com/avatar4.jpg" },
  { id: 5, name: "Cara Stevens", avatar: "https://example.com/avatar5.jpg" },
  { id: 6, name: "John Doe", avatar: "https://example.com/avatar6.jpg" },
  { id: 7, name: "Ashton Cox", avatar: "https://example.com/avatar7.jpg" },
  { id: 8, name: "Angelica Ramos", avatar: "https://example.com/avatar8.jpg" },
  { id: 9, name: "Airi Satou", avatar: "https://example.com/avatar9.jpg" },
];

const daysInMonth = (month, year) => new Date(year, month, 0).getDate();

const AttendanceSheet = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1); // Start with current month
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [attendance, setAttendance] = useState({}); // Stores attendance data

  const handleDateChange = (type, event) => {
    const dateValue = event.target.value;
    if (type === "start") {
      setStartDate(dateValue);
    } else {
      setEndDate(dateValue);
    }
  };

  // Attendance options
  const attendanceOptions = {
    notMarked: {
      icon: <PiCalendarBlank size={40} className="text-gray-400" />,
      label: "Not Marked",
    },
    present: { icon: <PiCheckCircle size={40} className="text-green-500" />, label: "P" },
    absent: { icon: <PiXCircle size={40} className="text-red-500" />, label: "A" },
    halfDay: { icon: <PiStar size={40} className="text-yellow-500" />, label: "H" },
    leave: { icon: <PiAirplane size={40} className="text-blue-500" />, label: "L" },
  };

  const getMonthName = (monthNumber) => {
    const date = new Date();
    date.setMonth(monthNumber - 1); // monthNumber is 1-indexed, setMonth is 0-indexed
    return date.toLocaleString("default", { month: "long" });
  };

  // Generate an array of days for the selected month
  const days = Array.from(
    { length: daysInMonth(currentMonth, currentYear) },
    (_, i) => i + 1
  );

  // Function to handle navigating to the previous month
  const goToPreviousMonth = () => {
    setCurrentMonth((prevMonth) => {
      const newMonth = prevMonth === 1 ? 12 : prevMonth - 1;
      if (newMonth === 12) {
        setCurrentYear((prevYear) => prevYear - 1);
      }
      return newMonth;
    });
  };

  // Function to handle navigating to the next month
  const goToNextMonth = () => {
    setCurrentMonth((prevMonth) => {
      const newMonth = prevMonth === 12 ? 1 : prevMonth + 1;
      if (newMonth === 1) {
        setCurrentYear((prevYear) => prevYear + 1);
      }
      return newMonth;
    });
  };

  // Handle attendance click to update
  const handleAttendanceClick = (employeeId, day) => {
    const key = `${employeeId}-${day}-${currentMonth}-${currentYear}`;
    const currentStatus = attendance[key];

    const statusOrder = ["present", "absent", "halfDay", "leave","notMarked"];

    const nextStatus =
      statusOrder[
        (statusOrder.indexOf(currentStatus) + 1) % statusOrder.length
      ];

      console.log(employeeId,key,nextStatus);
      
    setAttendance({
      ...attendance,
        [key]: nextStatus,
    });
  };

  return (
    <div className="m-2 bg-white">
      <h1 className="text-xs font-bold mb-4 p-3 pb-0 flex gap-3">
        Attendance Sheet
        <p className="text-red-500">
          ( {getMonthName(currentMonth)} - {currentYear} )
        </p>
      </h1>

      {/* Date Range Selection */}
      <div className="flex items-center gap-3 p-3 pt-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Select Department"
              className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={startDate}
              onChange={(e) => handleDateChange("start", e)}
            />
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Select Designation"
              className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={endDate}
              onChange={(e) => handleDateChange("end", e)}
            />
          </div>
          <button
            className="flex items-center gap-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={goToPreviousMonth}
          >
            <PiCaretLeftBold />
            Prev Month
          </button>
          <button
            className="flex items-center gap-3  bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={goToNextMonth}
          >
            Next Month
            <PiCaretRightBold />
          </button>
        </div>
        <div></div>
      </div>

      {/* Attendance Table */}
      <table className="w-full   border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="w-5 py-2 px-2 border text-xs border-gray-300 text-left">
              Employee
            </th>
            {days.map((day) => (
              <th
                key={day}
                className="w-5 border text-xs border-gray-300 text-center"
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td className="border border-gray-300">
                <div className="flex items-center py-2 px-2">
                  <img
                    src={employee.avatar}
                    alt={employee.name}
                    className="w-5 h-5 rounded-full mr-2"
                  />
                  <p className="w-28 text-xs">{employee.name}</p>
                </div>
              </td>
              {days.map((day) => {
                const key = `${employee.id}-${day}-${currentMonth}-${currentYear}`;
                const status = attendance[key];
                return (
                  <td
                    key={day}
                    className="border border-gray-300 px-0 py-0 text-center cursor-pointer hover:bg-gray-100"
                    onClick={() => handleAttendanceClick(employee.id, day)}
                  >
                    {status ? (
                      attendanceOptions[status].icon
                    ) : (
                      <PiCalendarBlank size={40} className="text-gray-400" />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceSheet;
