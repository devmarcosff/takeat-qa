import Analytics from "@/analytics/analytics";
import PixelFromDelivery from "@/analytics/PixelFromDelivery";
import ThemeProviderWrapper from "@/components/theme/ThemeProviderWrapper";
import { DeliveryProvider } from "@/context/DeliveryContext";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Delivery - Takeat App",
  description: "Faça seu pedido de comida online com a Takeat App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={`${poppins.className}`}>
        <ThemeProviderWrapper>
          <DeliveryProvider>
            <Analytics />
            <PixelFromDelivery />
            {children}
          </DeliveryProvider>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
