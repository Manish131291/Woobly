import { AuthLayout } from "../../../core-components/templates/auth-layout/AuthLayout.component";
import MoodLogin from "../screens/mood-login.screen";

const journeyId = "LGN";

export const LoginRoutes = {
  path: "/auth",
  name: "Login Routes",
  header: "Login Routes",
  component: AuthLayout,
  children: [
    {
      path: "login",
      name: "Login User",
      component: MoodLogin,
      extraParams: {
        journeyId,
        screenId: "HOME",
      },
    },
  ],
};
