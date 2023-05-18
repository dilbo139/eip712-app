import type { AppProps } from 'next/app';
import { ThirdwebProvider } from "@thirdweb-dev/react";
import "@/styles/globals.css";

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ThirdwebProvider activeChain="goerli">
            <Component {...pageProps} />
        </ThirdwebProvider>
    );
}