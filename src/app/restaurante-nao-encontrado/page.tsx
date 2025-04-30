"use client";
import InternalPages from "@/components/uiComponents/InternalPageHeader/internal_pages.header";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function RestauranteNaoEncontradoPage() {
  const not_found = "/assets/takeat_logo.svg"
  const { push } = useRouter()

  return (
    <InternalPages>
      <div className="text-center flex flex-col justify-center items-center w-full h-screen gap-4">
        <div>
          <Image width={150} height={150} src={`${not_found}`} alt="Restaurante não encontrado" />
        </div>

        <div>
          <h2 className="text-2xl font-semibold">Restaurante não encontrado</h2>
          <p>Desculpe, não conseguimos encontrar este restaurante.</p>
        </div>

        <div className="flex flex-col gap-3 w-full p-4">
          <button onClick={() => push("/")} className="bg-takeat-primary-default p-3 shadow-md rounded-lg text-white font-semibold">
            <span>Voltar para a página inicial</span>
          </button>
        </div>
      </div>
    </InternalPages>
  );
} 