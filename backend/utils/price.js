const Setting = require('../models/Setting');

async function getLiveRates() {
  try {
    const apiUrl = process.env.RATES_API_URL || "https://swarna-mobile.onrender.com/api/rates/regional?town=Biratnagar";
    // dynamic import node-fetch if Node < 18, but render should be 18+
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Rates API failed");
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch live rates for checkout:", error);
    return null;
  }
}

async function getTaxes() {
  try {
    const settings = await Setting.find({ key: { $in: ['goldTax', 'silverTax'] } }).lean();
    return {
      goldTax: settings.find(s => s.key === 'goldTax')?.value || 0,
      silverTax: settings.find(s => s.key === 'silverTax')?.value || 0,
    };
  } catch (error) {
    return { goldTax: 0, silverTax: 0 };
  }
}

function calculatePrice(product, rates, taxes) {
  if (!product || !rates) return product?.price || 0;
  
  if (product.priceMode === 'static') {
    return product.price || 0;
  }

  if (!product.weight || !product.metalType) return product.price || 0;

  // Find the exact metal rate
  const rateItem = rates.find(r => r.metal_type.toLowerCase() === product.metalType.toLowerCase());
  if (!rateItem) return product.price || 0;

  let baseRate = rateItem.rate;

  // Convert weight string to number if needed
  let weightNum = typeof product.weight === 'string' ? parseFloat(product.weight) : product.weight;
  
  // Convert standard rate (per 10g or Tola) to rate per unit (Gram)
  // Assuming standard rate is per Tola (11.66 grams)
  let unitRate = baseRate / 11.66;
  
  let basePrice = weightNum * unitRate;

  // Add loss value based on type
  if (product.lossValue && product.lossType) {
    let lossNum = typeof product.lossValue === 'string' ? parseFloat(product.lossValue) : product.lossValue;
    if (product.lossType === 'percentage') {
      basePrice += basePrice * (lossNum / 100);
    } else if (product.lossType === 'fixed') {
      basePrice += lossNum * unitRate; 
    }
  }

  // Add making charge
  if (product.makingCharge) {
    let chargeNum = typeof product.makingCharge === 'string' ? parseFloat(product.makingCharge) : product.makingCharge;
    // Assuming making charge is per Tola (adjust if it's per gram in DB)
    let totalMakingCharge = chargeNum * (weightNum / 11.66);
    basePrice += totalMakingCharge;
  }

  // Add specific tax
  const taxRate = product.metalType.toLowerCase() === 'gold' ? taxes.goldTax : taxes.silverTax;
  if (taxRate) {
    basePrice += basePrice * (taxRate / 100);
  }

  return Math.round(basePrice);
}

module.exports = { getLiveRates, getTaxes, calculatePrice };
