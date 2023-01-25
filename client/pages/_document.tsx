import { Html, Head, Main, NextScript } from "next/document";
import Link from "next/link";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <div>
          <Link href="/">Home</Link>
          <Link href="/mantainer/products">Products</Link>
          <Link href="/purchase-orders">Ordenes de compra</Link>
        </div>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
