import "./globals.css"

import Provider from "./provider";

export const metadata = {
  title: "LCW Destek Sistemi",
  description: "Müşteri destek ve chat sistemi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr" className="h-full">
      <Provider>
        <body className="min-h-full antialiased">{children}</body>
      </Provider>
    </html>
  );
}
