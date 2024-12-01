import { ThemeModeToggle } from "~/components/themes/theme-mode-toggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default function Page() {
  return (
    <div className="px-2 md:px-0">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>App settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <p>Theme: </p>
            <ThemeModeToggle />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
