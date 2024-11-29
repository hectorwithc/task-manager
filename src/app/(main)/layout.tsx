import { auth } from "@clerk/nextjs/server";
import Navbar from "../_components/Navbar";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { APP_NAME } from "~/lib/appConfig";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="flex h-screen w-full justify-center">
      <div className="w-full max-w-3xl">
        <Navbar />
        {session.userId ? (
          <>{children}</>
        ) : (
          <div className="flex flex-col items-center">
            <h1 className="text-xl font-semibold">Welcome to {APP_NAME}</h1>
            <p className="text-muted-foreground">
              You need to be signed in to continue
            </p>
            <div className="mt-4 flex items-center justify-center space-x-1">
              <Link href={"/sign-up"}>
                <Button>Get started</Button>
              </Link>
              <Link href={"/sign-in"}>
                <Button variant={"outline"}>Sign In</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
