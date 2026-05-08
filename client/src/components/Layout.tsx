import type { ReactNode } from "react";
import reactLogo from '../assets/logo.png';

export type LayoutProps = {children: ReactNode}
export const Layout = ({children}: LayoutProps)=>{

  return (
    <main>
      <div>
        <div className="flex justify-center">
          <img src={reactLogo} width={200} />
        </div>
        <h1 className="text-4xl text-center text-y">Digitale Kaffeeliste</h1>
      </div>
    {children}
    </main>
  );
}
