import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Toaster from "@/components/Toaster";
import { AuthProvider } from "@/contexts/AuthContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
      <Toaster />
    </AuthProvider>
  );
}
