import React, { useLayoutEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { loginUser } from "../../Redux/Slice/LoginSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Message } from "primereact/message";
import { FloatLabel } from "primereact/floatlabel";
import { Button } from "primereact/button";

export default function LoginPage() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const dispatch = useDispatch();
  const toast = useRef(null);
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.Auth);

  useLayoutEffect(() => {
    if (localStorage.getItem("Ttoken")) {
      navigate("/");
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const onSubmilt = () => {
    dispatch(loginUser({ email: "amit@gmail.com", pass: "12345" })).then((doc) => {
      if (loginUser.fulfilled.match(doc)) {
        navigate("/");
      }
    });
  };

  return (
    <>
      <div className="">
        {error && (
          <Message
            severity="error"
            text={`${error}`}
            className="absolute -top-20 left-0 w-full"
          />
        )}
        <form className="w-80 mx-w-96 flex flex-col items-center justify-center gap-3">
          <span className="p-float-label">
            <InputText
              id="username"
              value={"amit@gmail.com"}
              defaultValue={"amit@gmail.com"}
              autoComplete="email"
              disabled={true}
              type="email"
              className="w-80 mx-w-96 border-gray-300 border rounded-xl h-12 pl-3"
              onChange={(e) => setUser(e.target.value)}
            />
            <label htmlFor="username">Username</label>
          </span>
          <span className="p-float-label w-full">
            <FloatLabel>
              <Password
                inputId="password"
                value={"00000000"}
                disabled={true}
                defaultValue={"00000000"}
                autoComplete="new-password"
                onChange={(e) => setPass(e.target.value)}
                inputClassName="w-80 mx-w-96 h-12 pl-3"
                className="w-80 mx-w-96 border-gray-300 border rounded-xl overflow-hidden"
                toggleMask
                feedback={false}
              />
              <label htmlFor="password">Password</label>
            </FloatLabel>
          </span>
          <div className="w-full mx-w-96 ">
            <Button
              onClick={onSubmilt}
              type="button"
              // loading={loading}
              label="Login"
              // disabled={user && pass ? false : true}
              className="w-full py-3 bg-blue-600 text-white"
            />
          </div>
        </form>
      </div>
    </>
  );
}
