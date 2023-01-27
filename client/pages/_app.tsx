import "@/styles/globals.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { useState } from "react";
import NiceModal from '@ebay/nice-modal-react'
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { AppProps } from "next/app";
import ProductForm from "@/components/purchase-orders/ProductForm";
import { MODAL } from "@/types/modals";

NiceModal.register(MODAL.PRODUCT_FORM, ProductForm)

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <Hydrate state={pageProps.dehydratedState}>
        <NiceModal.Provider>
          <Component {...pageProps} />  
        </NiceModal.Provider>
      </Hydrate>    
    </QueryClientProvider>
  )
}
