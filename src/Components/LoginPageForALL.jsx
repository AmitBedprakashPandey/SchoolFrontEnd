    import React, { useEffect, useLayoutEffect, useState } from "react";
    import { Dropdown } from "primereact/dropdown";
    import { FloatLabel } from "primereact/floatlabel";
    import { InputText } from "primereact/inputtext";
    import { Button } from "primereact/button";
    import { Password } from "primereact/password";
    import { Message } from "primereact/message";
    import { useNavigate } from "react-router-dom";
    import { useDispatch, useSelector } from "react-redux";
    import { loginUser } from "../Redux/Slice/LoginSlice";
    import AdminLoginPage from "./Admin/LoginPage";
    import TeacherLoginPage from "../Teacher/Componets/LoginPage";
    import ThirdPartyLoginPage from "../Components/Party/LoginPage";
    function LoginPageForALL() {
    const [selectRole, setSelectRole] = useState();
    const [user, setUser] = useState("");
    const [password, setpassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [selectedComponent, setSelectedComponent] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const data = [{ name: "Admin" }, { name: "Teacher" }, { name: "Thirdparty" }];
    const { error: teacherError } = useSelector((state) => state.Auth);
    const { error: adminerror } = useSelector((state) => state.SchoolAdmin);

    const Role = (selectRole) => {
        switch (selectRole) {
        case "Admin":
            return <AdminLoginPage />;

        case "Teacher":
            return <TeacherLoginPage />;

        case "Thirdparty":
            return <ThirdPartyLoginPage />;
        }
    };

    useEffect(() => {
        if (localStorage.getItem("partyToken")) {
          navigate("/thirdparty");
        } else if (localStorage.getItem("Admintoken")) {
          navigate("/admin");
        } else if (localStorage.getItem("Ttoken")) {
          navigate("/teacher");
        }
      }, [navigate]);

    useEffect(() => {
        setSelectedComponent(Role(selectRole));
    }, [selectRole]);

    return (
        <div className="w-screen h-screen flex justify-center items-center">
        <div className="relative">
            <h1 className="capitalize text-lg md:text-4xl font-bold text-center">
            <span className="text-blue-500">Digital</span> branded school
            solutions
            </h1>
            <div className="grid place-content-center mt-5">
            <Dropdown
                options={data}
                optionValue="name"
                optionLabel="name"
                value={selectRole}
                placeholder="Select Role"
                onChange={(e) => setSelectRole(e.value)}
                className="w-96 py-2 border rounded-md"
                panelClassName="text-lg"
            />
            </div>

            <div>{selectedComponent}</div>
        </div>
        </div>
    );
    }

    export default LoginPageForALL;
