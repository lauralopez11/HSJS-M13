import "@/styles/globals.css";
// import 'bootstrap/dist/css/bootstrap.min.css';
import { Providers } from "./providers";

export const metadata = {
  title: "HSJS - Meetings",
  description: "Plan your meeting",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
