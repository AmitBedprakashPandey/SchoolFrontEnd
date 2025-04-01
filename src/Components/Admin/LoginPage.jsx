import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../Redux/Slice/AdminLoginSlice";
import { useEffect, useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getByUserAllSchool } from "../../Redux/Slice/SchoolSlice";
import { FloatLabel } from "primereact/floatlabel";
import "./Style.css";
import { Message } from "primereact/message";
export default function LoginPage(params) {
  const [formData, setFormData] = useState({ email: "", pass: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.SchoolAdmin
  );
  const formHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (!localStorage.getItem("Admintoken")) {
      return navigate("/login");
    }
  }, {});
  const onLogin = () => {
    dispatch(loginUser(formData)).then((doc) => {
      if (localStorage.getItem("schoolid")) {
        dispatch(getByUserAllSchool(localStorage.getItem("schoolid")));
        navigate("/admin");
      }
    });
  };
  return (
    <div className="flex justify-center items-center">
      <div className="grid grid-cols-1 place-content-center w-full">
        <div className="">
          {error && (
            <Message
              severity="error"
              text={`${error}`}
              className="absolute -top-20 left-0 w-full"
            />
          )}
        </div>
        <span className="w-full mt-5">
          <FloatLabel>
            <InputText
              autoFocus={true}
              id="username"
              name="email"
              value={formData?.email}
              onChange={formHandler}
              className="w-80 mx-w-96 h-12 p-2 border-gray-300 border"
            />
            <label htmlFor="username">Username </label>
          </FloatLabel>
        </span>
        <span className="w-full mt-5">
          <FloatLabel>
            <Password
              inputId="password"
              name="pass"
              value={formData?.pass}
              onChange={formHandler}
              inputClassName="w-80 mx-w-96 h-12 pl-3"
              className="w-80 mx-w-96 rounded-md border-gray-300 border"
              feedback={false}
              toggleMask
            />
            <label htmlFor="password">Password</label>
          </FloatLabel>
        </span>
        <Button
          label="Login"
          disabled={formData.email && formData.pass ? false : true}
          loading={loading}
          unstyled={true}
          onClick={onLogin}
          className="flex justify-center gap-3 items-center bg-blue-500 hover:bg-blue-600 duration-300 text-white py-3 mt-7 disabled:bg-blue-300 rounded-lg"
        />
      </div>
    </div>
  );
}


