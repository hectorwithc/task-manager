import Navbar from "../_components/Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full justify-center">
      <div className="w-full max-w-3xl">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
