import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="flex h-screen items-center justify-center p-12">
      <SignUp />
    </main>
  );
}
