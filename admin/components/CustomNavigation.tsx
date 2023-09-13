import {
  NavigationContainer,
  NavItem,
  ListNavItems,
} from "@keystone-6/core/admin-ui/components";
import type { NavigationProps } from "@keystone-6/core/admin-ui/components";

export const CustomNavigation = ({
  authenticatedItem,
  lists,
}: NavigationProps) => {
  return (
    <NavigationContainer authenticatedItem={authenticatedItem}>
      <NavItem href="/">Dashboard</NavItem>
      <ListNavItems lists={lists} />
      <NavItem href="/upload-custom-images">Upload Custom's Images</NavItem>
    </NavigationContainer>
  );
};
