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
    <div>
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
