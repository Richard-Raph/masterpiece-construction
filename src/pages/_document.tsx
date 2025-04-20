import { COLORS } from "@/libs/colors";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <style>{`
          :root {
            --color-dark: ${COLORS.dark};
            --color-gray: ${COLORS.gray};
            --color-light: ${COLORS.light};
            --color-muted: ${COLORS.muted};
            --color-primary: ${COLORS.primary};
          }
        `}</style>
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
