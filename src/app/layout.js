import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { SessionProvider } from "next-auth/react";

export const metadata = {
  title: "HSJS - Meetings",
  description: "Plan your meeting",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
