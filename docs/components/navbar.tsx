import NextLink from "next/link";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/navbar";
import { link as linkStyles } from "@heroui/theme";
import clsx from "clsx";

import { Logo } from "@/components/icons";

const navItems = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/comprehensive-demo",
    label: "Comprehensive",
  },
  {
    href: "/advanced-demo",
    label: "Advanced",
  },
  {
    href: "/interactive-demo",
    label: "Interactive",
  },
  {
    href: "/real-world-demo",
    label: "Real World",
  },
  {
    href: "/zod-demo",
    label: "Zod Demo",
  },
  {
    href: "/new-fields-demo",
    label: "New Fields",
  },
  {
    href: "/config-demo",
    label: "Config",
  },
  {
    href: "/configurable-form-demo",
    label: "Configurable",
  },
];

export const Navbar = () => {
  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Logo />
            <p className="font-bold text-inherit">Hero Hook Form</p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium",
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {navItems.map((item, index) => (
            <NavbarMenuItem key={`${item.label}-${index}`}>
              <NextLink
                className={clsx(linkStyles({ color: "foreground" }), "text-lg")}
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
