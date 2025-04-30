import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import Image from "next/image";

interface DiscountAlertModalProps {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  type: 'coupon' | 'cashback';
  value: string;
}

export default function DiscountAlertModal({ openModal, setOpenModal, type, value }: DiscountAlertModalProps) {
  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogContent className="max-w-[400px] rounded-xl bg-takeat-neutral-lightest !p-0 overflow-hidden">
        <DialogHeader className="bg-takeat-neutral-white w-full h-14 shadow sticky top-0">
          <DialogTitle className="text-lg font-semibold text-left p-4 flex items-center gap-2">
            <Image src={'/assets/success.svg'} alt="Cupom ou cashback aplicado" width={24} height={24} />
            {type === 'coupon' ? 'Cupom aplicado!' : 'Cashback resgatado!'}
          </DialogTitle>
          <button
            onClick={() => setOpenModal(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>
        <div className="px-4 pb-4">
          <p className="text-center text-takeat-neutral-darker">
            {type === 'coupon'
              ? `O cupom ${value} foi aplicado com sucesso e será visível ao finalizar o pedido.`
              : `O cashback de ${value} foi resgatado com sucesso e será visível ao finalizar o pedido.`}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
} 