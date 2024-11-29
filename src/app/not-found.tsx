import Link from "next/link";
import { Button } from "~/components/ui/button";
import { SUPPORT_URL } from "~/lib/appConfig";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="font-mono text-[100px] font-bold">404</h1>
      <p className="text-muted-foreground">
        The requested resource could not be found...
      </p>
      <p className="mb-4 text-muted-foreground">Please try again later.</p>
      <div className="flex items-center justify-center space-x-2">
        <Link href={"/"}>
          <Button>Go back</Button>
        </Link>
        <Link href={SUPPORT_URL}>
          <Button variant={"outline"}>Contact Support</Button>
        </Link>
      </div>
    </div>
  );
}
