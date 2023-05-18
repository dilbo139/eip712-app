import Image from 'next/image'
import { Signer, ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import { useSDK, useSigner } from "@thirdweb-dev/react";
import { useNetworkMismatch } from "@thirdweb-dev/react";
import { useSwitchChain } from "@thirdweb-dev/react";
import { Goerli } from "@thirdweb-dev/chains";


export default function Home() {
  const address = useAddress();
  const sdk = useSDK();
  const signer = useSigner();
  const isMismatched = useNetworkMismatch();
  const switchChain = useSwitchChain();

  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);


  // The domain object as defined by the EIP712 standard.
  const domain = {
    name: "MyEIP721Domain",
    version: "1",
    chainId: 5,
    verifyingContract: "0x1111111111111111111111111111111111111111"
  }

  // The structure and data types as defined by the EIP712 standard.
  const types = {
    Mail: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "content", type: "string" }
    ]
  }

  // The data to be signed.
  const mailMessage = {
    from:
      address
    ,
    to:
      "0xfA99DB89Db49e0F5D74deAA3475467398B4FceFD"
    ,
    content: "Hello, Bob!"
  }

  // Returns an object with the payload and the associated signature:
  async function signMessage() {
    if (sdk) {
      const { payload, signature } = await sdk.wallet.signTypedData(domain, types, mailMessage);
      console.log('signature: ', signature);
      return { payload, signature };
    }
  }

  // OR using ethers.js:
  // async function signMessage() {
  //   if (provider) {
  //     const signer = provider.getSigner();
  //     const signature = await signer._signTypedData(domain, types, mailMessage);
  //     console.log('signature: ', signature);
  //     return signature;
  //   }
  // }

  useEffect(() => {
    if (address && typeof window !== 'undefined') {
      // @ts-ignore
      const metamaskProvider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(metamaskProvider);
    }
  }, [address])


  return (

    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-center font-mono text-sm flex flex-col gap-6">
        {isMismatched && <button onClick={() => switchChain(Goerli.chainId)} className="bg-gradient-to-r from-purple-100 to-blue-100 color-white p-3 rounded-md shadow-md shadow-black hover:shadow-sm">Switch to Goerli</button>}
        <ConnectWallet className="bg-gradient-to-r from-purple-100 to-blue-100 color-white p-3 rounded-md shadow-md shadow-black hover:shadow-sm" />
        {address && <button onClick={signMessage} className="bg-gradient-to-r from-purple-100 to-blue-100 color-white p-3 rounded-md shadow-md shadow-black hover:shadow-sm">Sign</button>}
      </div>
    </main>
  )
}
