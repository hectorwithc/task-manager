import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { TRPCReactProvider } from "~/trpc/react";
import { APP_LOGO_NAME } from "~/lib/appConfig";
import { Toaster } from "~/components/ui/sonner";

export const metadata: Metadata = {
  title: `${APP_LOGO_NAME}`,
  description: "An online task manager.",
  icons: [{ rel: "icon", url: "/favicon.svg" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: [dark],
      }}
    >
      <html lang="en" className={`${GeistSans.variable} dark`}>
        <body>
          <TRPCReactProvider>
            {children}
            <Toaster />
          </TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
