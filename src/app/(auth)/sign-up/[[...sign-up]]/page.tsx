import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function Page() {
  return (
    <main className="flex h-screen flex-col items-center justify-center p-12">
      <SignUp />
      <Link href={"/"} className="mt-2">
        <Button variant={"link"} className="text-muted-foreground">
          Go back?
        </Button>
      </Link>
    </main>
  );
}
