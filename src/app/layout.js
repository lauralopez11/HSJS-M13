import "@/styles/globals.css";
import { Providers } from "./providers";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export const metadata = {
  title: "HSJS - Meetings",
  description: "Plan your meeting",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased text-foreground bg-background ">
        <Providers>
        <div className="absolute top-4 right-4 z-10">
            <ThemeSwitcher />
          </div>
          {children}
        </Providers>
      </body>
    </html>
  );
}
