import { UserButton } from "@clerk/nextjs";
import AppLogo from "~/components/custom/AppLogo";

export default function Navbar() {
  return (
    <div className="flex border-b-2 justify-between items-center py-3 px-2 mb-8">
        <AppLogo />
        <UserButton />
    </div>
  )
}
