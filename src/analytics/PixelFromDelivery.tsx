"use client";
import { useDelivery } from "@/context/DeliveryContext";
import FacebookPixel from "./pixel";

export default function PixelFromDelivery() {
    const { getRestaurants } = useDelivery();
    const pixel_id = getRestaurants?.pixel_id || "";
    const pixel_id2 = getRestaurants?.pixel_id2 || "";

    if (!pixel_id && !pixel_id2) return null;

    return <FacebookPixel pixel_id={pixel_id} pixel_id2={pixel_id2} />;
}