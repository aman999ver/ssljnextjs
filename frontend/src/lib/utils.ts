import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculatePrice(product: any, rates: any, taxes: any) {
  if (!product || !rates) return product?.price || 0;
  
  if (product.priceMode === 'static') {
    return product.price || 0;
  }

  if (!product.weight || !product.metalType) return product.price || 0;
  
  const gold24k = rates.offset?.final_gold_rate || 0;
  const gold22k = Math.round(gold24k * 0.92);
  const silver = rates.offset?.final_silver_rate || 0;
  
  let metalRate = 0;
  let applicableTax = 0;

  if (product.metalType === '24K') { metalRate = gold24k; applicableTax = taxes?.goldTax || 0; }
  else if (product.metalType === '22K') { metalRate = gold22k; applicableTax = taxes?.goldTax || 0; }
  else if (product.metalType === 'Silver') { metalRate = silver; applicableTax = taxes?.silverTax || 0; }

  if (metalRate > 0) {
    let totalGrams = product.weight;
    if (product.lossType === 'grams') {
      totalGrams += (product.lossValue || 0);
    } else if (product.lossType === 'percentage') {
      totalGrams += (product.weight * ((product.lossValue || 0) / 100));
    }
    
    const tolas = totalGrams / 11.664;
    const metalCost = tolas * metalRate;
    const subtotal = metalCost + (product.makingCharge || 0);
    const finalRate = subtotal + (subtotal * (applicableTax / 100));
    
    return Math.round(finalRate);
  }
  return product.price || 0;
}
