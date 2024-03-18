import React from "react";
import {
  Input,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  Switch,
} from "@nextui-org/react";

import { MoonIcon, SunIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { getTheme, toggleTheme } from "~/lib/theme-switcher";

import { useHydrated } from "remix-utils/use-hydrated";
import DebouncedSearch from "./debounced-search";

export const ThemeSwitcher = () => {
  const theme = getTheme();

  const isHydrated = useHydrated();

  if (!isHydrated) return <></>;

  return (
    <Switch
      classNames={{
        wrapper: "px-0 mr-0",
      }}
      defaultSelected={theme === "light"}
      onChange={() => toggleTheme()}
      aria-label="Toggle theme"
      size="lg"
      thumbIcon={({ isSelected, className }) =>
        isSelected ? (
          <SunIcon className={className} />
        ) : (
          <MoonIcon className={className} />
        )
      }
    />
  );
};

export default function Header() {
  return (
    <Navbar
      classNames={{
        wrapper: "w-full max-w-[895px] lg:p-0",
      }}
      shouldHideOnScroll
    >
      <NavbarBrand>
        <Link href="/" color="foreground">
          <p className="font-bold">TMDB</p>
        </Link>
      </NavbarBrand>
      <NavbarContent className="flex-1" justify="center">
        <DebouncedSearch />
      </NavbarContent>
      <NavbarContent className="hidden md:flex" justify="end">
        <ThemeSwitcher />
      </NavbarContent>
    </Navbar>
  );
}
