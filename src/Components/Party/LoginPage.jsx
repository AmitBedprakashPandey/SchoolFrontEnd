import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { FloatLabel } from "primereact/floatlabel";
import { Ripple } from "primereact/ripple";
import { loginParty, logout } from "../../Redux/Slice/PartySlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Message } from "primereact/message";
import { Toast } from "primereact/toast";
import { Messages } from "primereact/messages";
import { Button } from "primereact/button";

export default function LoginPage() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const dispatch = useDispatch();
  const toast = useRef(null);
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.PartyAuth);

  useLayoutEffect(() => {
    if (localStorage.getItem("partyToken")) {
      navigate("/thirdparty");
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const onSubmilt = () => {
    dispatch(loginParty({ email: user, pass: pass })).then((doc) => {
      if (doc.payload?.status === true) {
        navigate("/thirdparty");
      }
    });
  };
  return (
    <div className="flex justify-center items-center">
      <div className="grid grid-cols-1 place-content-center  w-96">
        <div className="">
          {error && (
            <Messages
              severity="error"
              text={`${error}`}
              className="absolute -top-20 left-0 w-full"
            />
          )}
        </div>
        <span className="w-full mt-7">
          <FloatLabel>
            <InputText
              autoFocus={true}
              id="username"
              name="email"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="w-full h-12 p-2 border-gray-300 border"
            />
            <label htmlFor="username">Username </label>
          </FloatLabel>
        </span>
        <span className="p-float-label w-full mt-7">
          <FloatLabel>
            <Password
              inputId="password"
              name="pass"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              inputClassName="w-full h-12 pl-3"
              className="w-full rounded-md border-gray-300 border"
              feedback={false}
              toggleMask
            />
            <label htmlFor="password">Password</label>
          </FloatLabel>
        </span>
        <div className="w-full grid place-content-center mt-5">

        <Button
          onClick={onSubmilt}
          label="Login"
          type="button"
          disabled={user && pass ? false : true}
          className="bg-blue-600 text-white w-48 py-3"
          />
          </div>
      </div>
    </div>
  );
}
