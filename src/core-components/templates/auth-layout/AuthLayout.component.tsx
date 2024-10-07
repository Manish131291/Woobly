import * as React from "react";
import { Outlet } from "react-router";

import "./AuthLayout.style.scss";

export const AuthLayout = () => {
  return (
    <>
      <section className="auth-screen">
        <div className="auth-screen__container bg-white">
          <div className="auth-screen__carousel relative bg-purple-800 h-screen flex flex-col justify-between">
            <div className="h-[70px] w-[70px] mt-6 ml-6 au-logo hidden md:block">
              <img src={""} alt="au-logo" style={{ borderRadius: 5 }} />
            </div>
          </div>
          <div className="auth-screen__content h-screen overflow-scroll relative">
            <Outlet />
          </div>
        </div>
      </section>
    </>
  );
};
