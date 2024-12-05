"use client";

import AppLogo from "~/components/custom/AppLogo";
import { Button } from "~/components/ui/button";

export default function NavbarButtons() {
  return (
    <>
      <div
        className="cursor-pointer"
        onClick={() => {
          window.location.href = "/";
        }}
      >
        <AppLogo />
      </div>
      <Button
        onClick={() => {
          window.location.href = "/";
        }}
        size={"sm"}
        variant={"link"}
      >
        Todos
      </Button>
    </>
  );
}
