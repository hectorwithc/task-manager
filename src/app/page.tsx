import { Button } from "~/components/ui/button";
import { APP_NAME } from "~/lib/appConfig";

export default function Page() {
  return (
    <main>
      <h1>{APP_NAME}</h1>
      <Button>Hello World</Button>
    </main>
  );
}
