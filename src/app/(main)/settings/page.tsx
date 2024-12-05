import { ThemeModeToggle } from "~/components/themes/theme-mode-toggle";
import { currentUser } from "@clerk/nextjs/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default async function Page() {
  const user = await currentUser();

  return (
    <div className="px-2 md:px-0">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>App settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="flex items-center space-x-2">
            <p className="font-semibold text-muted-foreground">User ID: </p>
            <p className="overflow-x-scroll md:overflow-x-clip">{user?.id}</p>
          </div>
          <div className="flex items-center space-x-2">
            <p className="font-semibold text-muted-foreground">Theme: </p>
            <ThemeModeToggle />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
