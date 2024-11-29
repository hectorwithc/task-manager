import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import AppLogo from "~/components/custom/AppLogo";
import { Button } from "~/components/ui/button";

export default async function Navbar() {
  const session = await auth();

  return (
    <div className="mb-8 flex items-center justify-between border-b-2 px-2 py-3">
      <div className="flex items-center justify-center">
        <Link href={"/"}>
          <AppLogo />
        </Link>
        <Link href={"/"}>
          <Button size={"sm"} variant={"link"}>Todos</Button>
        </Link>
        <Link href={"/settings"}>
          <Button size={"sm"} variant={"link"}>Settings</Button>
        </Link>
      </div>
      {session.userId ? (
        <UserButton />
      ) : (
        <div className="flex items-center justify-center space-x-1">
          {/*
          <Link href={"/sign-up"}>
            <Button size={"sm"}>Get started</Button>
          </Link>
          */}
          <Link href={"/sign-in"}>
            <Button size={"sm"} variant={"outline"}>
              Sign In
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
