import * as React from "react";
import "../styles/mood-login.style.scss";
import { IG_Input } from "../../../core-components/atoms/input/IG_Input.component";

const MoodLogin: React.FC = () => {
  return (
    <>
      <form className="login-form" onSubmit={(e) => e.preventDefault()}>
        <>
          <div>
            <IG_Input
              id="USER-NAME"
              type="email"
              classes="mb-4"
              label={`usernamePlaceholder`}
              placeholder={"enterUsername"}
              value={""}
              required={true}
            />
          </div>
          <div>
            <IG_Input
              id="PSWD"
              classes="mb-4"
              type={"password"}
              label={"password"}
              placeholder={"enterPassword"}
              value={""}
              autoComplete="off"
            />
          </div>
          <div></div>
          <div className="forgot__action">
            <span className="cursor-pointer underline">{`forgotPassword`}</span>
          </div>
        </>
      </form>
    </>
  );
};

export default MoodLogin;
