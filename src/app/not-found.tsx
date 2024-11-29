import Link from "next/link";
import { Button } from "~/components/ui/button";
import { SUPPORT_URL } from "~/lib/appConfig";

export default function NotFound() {
  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <h1 className="font-bold font-mono text-[100px]">404</h1>
      <p className="text-muted-foreground">The requested resource could not be found...</p>
      <p className="text-muted-foreground mb-4">Please try again later.</p>
      <div className="flex items-center justify-center space-x-2">
        <Link href={"/"}>
          <Button size={"sm"}>Go back</Button>
        </Link>
        <Link href={SUPPORT_URL}>
            <Button size={"sm"} variant={"outline"}>Contact Support</Button>
        </Link>
      </div>
    </div>
  );
}
