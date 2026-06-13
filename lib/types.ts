export type Tier = 'Silver' | 'Gold' | 'Platinum'
export type LeadStatus = 'New' | 'Contacted' | 'Converted' | 'Lost'
export type StockStatus = 'in_stock' | 'low' | 'out_of_stock'

export interface Category { id: string; name: string; slug: string; image?: string; sortOrder: number }
export interface Brand { id: string; name: string; slug: string; logo?: string; description?: string }
export interface PackVariant { size: string; price?: number; image?: string }
export interface Product {
  id: string; name: string; slug: string; brandId: string; categoryId: string
  description: string; variants: PackVariant[]; images: string[]
  modelGlb?: string; stockStatus: StockStatus; isFeatured: boolean
}
export interface CustomerProfile {
  id: string; businessName: string; contactName: string; phone: string; email: string
  tier: Tier; pointsBalance: number; referralCode: string; registeredAt: string
}
export interface OrderItem { productId: string; name: string; size: string; qty: number; unitValue: number }
export interface Order { id: string; customerId: string; items: OrderItem[]; totalValue: number; status: string; createdAt: string }
export interface LoyaltyEntry { id: string; customerId: string; pointsDelta: number; reason: string; createdAt: string }
export interface Lead { id: string; source: string; status: LeadStatus; name: string; phone: string; businessName?: string; notes?: string; createdAt: string }
export interface Enquiry { id: string; name: string; phone: string; business?: string; products: string; quantity?: string; location?: string; message?: string; handled: boolean; createdAt: string }
export interface Faq { id: string; question: string; answer: string }
