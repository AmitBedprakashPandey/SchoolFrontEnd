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
    dispatch(loginUser({ email: user, pass: pass })).then((doc) => {
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
        <form className="w-full grid place-content-center">
          <span className="p-float-label mt-5">
            <InputText
              id="username"
              value={user}
              autoComplete="email"
              type="email"
              className="w-96 border-gray-300 border rounded-xl h-16 pl-3"
              onChange={(e) => setUser(e.target.value)}
            />
            <label htmlFor="username">Username</label>
          </span>
          <span className="p-float-label w-full mt-5">
            <FloatLabel>
              <Password
                inputId="password"
                value={pass}
                autoComplete="new-password"
                onChange={(e) => setPass(e.target.value)}
                inputClassName="w-full h-16 pl-3"
                className="w-96 border-gray-300 border rounded-xl overflow-hidden"
                toggleMask
                feedback={false}
              />
              <label htmlFor="password">Password</label>
            </FloatLabel>
          </span>
          <div className="w-96 grid place-content-center">
            <Button
              onClick={onSubmilt}
              type="button"
              // loading={loading}
              label="Login"
              disabled={user && pass ? false : true}
              className="bg-blue-600 text-white w-48 py-3"
            />
          </div>
        </form>
      </div>
    </>
  );
}
