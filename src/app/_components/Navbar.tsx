import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import AppLogo from "~/components/custom/AppLogo";
import { Button } from "~/components/ui/button";

export default function Navbar() {
  return (
    <div className="mb-8 flex items-center justify-between border-b-2 px-2 py-3">
      <div className="flex items-center justify-center">
        <Link href={"/"}>
          <AppLogo />
        </Link>
        <Link href={"/"}>
          <Button variant={"link"}>Todos</Button>
        </Link>
        <Link href={"/settings"}>
          <Button variant={"link"}>Settings</Button>
        </Link>
      </div>
      <UserButton />
    </div>
  );
}
