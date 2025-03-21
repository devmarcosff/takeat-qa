"use client"
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { formatPrice } from "takeat-design-system-ui-kit";
import { AddProductsContainer, AddProductsQuantity, ButtonAddProducts, QuantityAddProducts, SelectAddProducts, TextAddProductsQuantity } from "./addProducts.style";
import { ICart, IProducts } from "./addProducts.types";

export default function AddProductsComponents({ product, cart, params, observation, disabled }: IProducts) {
  const [quantityProduct, setQuantityProduct] = useState(1)
  const [valueProduct, setValueProduct] = useState(product?.price || 0)
  const [complements, setComplements] = useState({})
  const { push } = useRouter();

  const handleAddToBag = () => {
    const takeatBag = `@deliveryTakeat:${params}TakeatBag`;
    const storedCart = localStorage.getItem(takeatBag);
    const existingCart = storedCart ? JSON.parse(storedCart) : { products: [] };

    const payloadProduct = {
      name: product?.name,
      categoryId: product?.id,
      oldPrice: product?.price,
      price: valueProduct,
      qtd: quantityProduct,
      observation,
      complements,
    };

    let updatedCard;

    const existingProduct = existingCart.products.find(
      (item: ICart) =>
        Number(item.categoryId) === payloadProduct.categoryId &&
        JSON.stringify(item.complements) === JSON.stringify(payloadProduct.complements) &&
        item.observation === payloadProduct.observation
    );

    if (existingProduct) {
      updatedCard = existingCart.products.map((item: ICart) =>
        Number(item.categoryId) === payloadProduct.categoryId &&
          JSON.stringify(item.complements) === JSON.stringify(payloadProduct.complements) &&
          item.observation === payloadProduct.observation
          ? { ...item, qtd: item.qtd + payloadProduct.qtd }
          : item
      );
    } else {
      updatedCard = [...existingCart.products, payloadProduct];
    }

    localStorage.setItem(takeatBag, JSON.stringify({ products: updatedCard }));
    push(`/${params}`);
  };

  useEffect(() => {
    const cartItems = Object.values(cart).filter(({ qtd }) => qtd > 0).map(({ name, limit, qtd, price, categoryId, complementId }) => ({
      name,
      limit,
      qtd,
      price,
      categoryId,
      complementId,
    }));

    setComplements(cartItems)

    const totalPrice = cartItems.map(({ qtd, price }) => qtd * price)
      .reduce((acc, curr) => acc + curr, Number(product?.price));

    setValueProduct(totalPrice)
  }, [cart, product?.price])

  return (
    <AddProductsContainer>
      <SelectAddProducts>
        <ButtonAddProducts disabled={quantityProduct === 1} onClick={() => setQuantityProduct(quantityProduct - 1)}>-</ButtonAddProducts>
        <QuantityAddProducts>
          <AnimatePresence mode="popLayout">
            <motion.span
              key={quantityProduct}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.3, ease: "backInOut" }}
              style={{
                position: 'absolute',
                fontSize: '16px'
              }}
            >
              {quantityProduct}
            </motion.span>
          </AnimatePresence>
        </QuantityAddProducts>
        <ButtonAddProducts onClick={() => setQuantityProduct(quantityProduct + 1)}>+</ButtonAddProducts>
      </SelectAddProducts>

      <AddProductsQuantity disabled={disabled}>
        <TextAddProductsQuantity disabled={disabled} onClick={() => handleAddToBag()}>
          <span>Adicionar </span>

          <AnimatePresence mode="popLayout">
            <motion.span
              key={valueProduct * quantityProduct}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              transition={{ duration: .3, ease: "easeInOut" }}
            >
              {formatPrice(valueProduct * quantityProduct)}
            </motion.span>
          </AnimatePresence>
        </TextAddProductsQuantity>
      </AddProductsQuantity>
    </AddProductsContainer>
  )
}