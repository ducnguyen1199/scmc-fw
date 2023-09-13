import { CustomNavigation } from "./components/CustomNavigation";

function CustomLogo() {
  return <h3>SCMC</h3>;
}

export const components = {
  Logo: CustomLogo,
  Navigation: CustomNavigation,
};
