"use client"
import { IconTakeatFilled } from "takeat-design-system-ui-kit";


export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center gap-5 h-screen w-full">
      <IconTakeatFilled className="fill-takeat-primary-default text-5xl" />
      <h2 className="text-3xl text-takeat-primary-default uppercase font-extrabold">Pedido Takeat</h2>
    </div>
  );
}
