"use client";
import ProductDrawer from "@/components/restaurants/product/products.drawer";
import { ProductDetails, ProductImage, ProductPrice } from "@/components/restaurants/product/products.style";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useDelivery } from "@/context/DeliveryContext";
import { Product } from "@/types/categories.types";
import { X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { formatPrice } from "takeat-design-system-ui-kit";

interface PromocaoModalProps {
  openModal: boolean;
  setOpenModal: (openModal: boolean) => void;
  params: string;
}

export default function PromocaoModal({ openModal, setOpenModal, params }: PromocaoModalProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { getCategories } = useDelivery();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filtra todos os produtos que têm promoção
  const productsWithPromotion = getCategories
    .flatMap(category => category.products)
    .filter(product => product.delivery_price_promotion);

  const viewProductInDrawer = (product: Product) => {
    const productSlug = encodeURIComponent(product.name);
    // Cria um novo objeto URLSearchParams com os parâmetros atuais
    const newSearchParams = new URLSearchParams(searchParams?.toString());
    // Adiciona o parâmetro do produto
    newSearchParams.set('produto', productSlug);
    // Atualiza a URL mantendo o pathname atual
    router.push(`${pathname}?${newSearchParams.toString()}`, { scroll: false });
    setSelectedProduct(product);
    setOpenDrawer(true);
  };

  // Limpa a URL quando o drawer é fechado
  const handleCloseDrawer = () => {
    // Remove apenas o parâmetro 'produto' mantendo os outros parâmetros
    const newSearchParams = new URLSearchParams(searchParams?.toString());
    newSearchParams.delete('produto');
    const newSearch = newSearchParams.toString();
    // Atualiza a URL mantendo o pathname atual
    router.push(`${pathname}${newSearch ? `?${newSearch}` : ''}`, { scroll: false });
    setOpenDrawer(false);
  };

  return (
    <>
      <Dialog open={openModal} onOpenChange={() => setOpenModal(!openModal)}>
        <DialogContent className="max-w-[600px] max-h-[90vh] overflow-y-auto rounded-xl bg-takeat-neutral-lightest !p-0">
          <DialogHeader className="bg-takeat-neutral-white w-full h-14 shadow sticky top-0">
            <DialogTitle className="text-lg font-semibold text-left p-4">
              Promoções
            </DialogTitle>
            <button onClick={() => setOpenModal(!openModal)} className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
            </button>
          </DialogHeader>
          <div className="space-y-4 px-4 mb-4">
            {productsWithPromotion.length > 0 ? (
              <div className="space-y-3">
                {productsWithPromotion.map((product, index) => (
                  <div
                    key={index}
                    onClick={() => viewProductInDrawer(product)}
                    className="flex bg-white rounded-2xl p-3 shadow cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <ProductDetails>
                      <h2 className="!text-takeat-neutral-darker">{product.name}</h2>
                      <p className="line-clamp-3">{product.description}</p>
                      <ProductPrice>
                        <b className="text-[#50A773] font-medium">{formatPrice(product.delivery_price_promotion || product.combo_delivery_price || product.delivery_price || product.price)}</b>
                        <span className="line-through text-gray-500">
                          {formatPrice(product.combo_delivery_price || product.delivery_price || product.price)}
                        </span>
                      </ProductPrice>
                    </ProductDetails>
                    <ProductImage
                      src={product.image?.url}
                      width={100}
                      height={100}
                      alt={product.name}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">
                Nenhuma promoção disponível no momento.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {selectedProduct && (
        <ProductDrawer
          openDrawer={openDrawer}
          setOpenDrawer={handleCloseDrawer}
          products={selectedProduct}
          params={params}
        />
      )}
    </>
  );
}
