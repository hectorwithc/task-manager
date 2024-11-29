import { CircleCheck } from "lucide-react";
import { APP_LOGO_NAME } from "~/lib/appConfig";

export default function AppLogo() {
  return (
    <>
      <div className="flex items-center justify-center space-x-1 rounded-sm bg-primary px-2 py-1">
        <CircleCheck color="#000000" />
        <span className="font-bold text-primary-foreground">
          {APP_LOGO_NAME}
        </span>
      </div>
    </>
  );
}
