export interface ContentBlock {
  id: string;
  type: 'titre' | 'texte' | 'image' | 'titre+texte' | 'titre+texte+image';
  titre?: string;
  texte?: string;
  imageUrl?: string;
}

export type ProductStatus = 'actif' | 'brouillon' | 'archivé';

export interface ProductVariant {
  id: string;
  option_name: string;
  option_values: string[];
}

export interface Product {
  id: string;
  slug: string;
  nom: string;
  prix: number;
  prix_comparaison?: number | null;
  cout_achat?: number | null;
  facturer_taxe?: boolean;
  stock: number;
  sku?: string | null;
  code_barre?: string | null;
  suivre_stock?: boolean;
  vendre_en_rupture?: boolean;
  produit_physique?: boolean;
  poids?: number | null;
  unite_poids?: 'kg' | 'g' | 'lb' | 'oz';
  description: string | null;
  images: string[];
  content_blocks: ContentBlock[];
  actif: boolean;
  statut?: ProductStatus;
  categorie?: string | null;
  type_produit?: string | null;
  fournisseur?: string | null;
  balises?: string[];
  variantes?: ProductVariant[];
  created_at: string;
}

export interface OrderField {
  id: string;
  label: string;
  type: 'text' | 'tel' | 'number' | 'select';
  required: boolean;
  options?: string[];
}

export interface StoreSettings {
  STORE_NAME: string;
  STORE_LOGO_URL: string;
  STORE_BANNER_URL: string;
  STORE_BANNER_TITLE: string;
  STORE_BANNER_SUBTITLE: string;
  WHATSAPP_NUMBER: string;
  STORE_PHONE: string;
  STORE_INSTAGRAM: string;
  STORE_FACEBOOK: string;
  STORE_TIKTOK: string;
  CURRENCY: string;
  ORDER_MODE: 'whatsapp_form' | 'whatsapp_direct';
  ORDER_FIELDS: OrderField[];
  ORDER_WHATSAPP_MSG: string;
  ORDER_SUCCESS_MSG: string;
  FOOTER_TEXT: string;
  THEME: string;
  STORE_COLOR: string;
}

export interface Order {
  id: string;
  product_id: string | null;
  product_nom: string;
  product_prix: number;
  quantite: number;
  montant: number;
  fields_data: Record<string, string>;
  statut: 'nouveau' | 'confirmé' | 'en_livraison' | 'livré' | 'retourné' | 'annulé';
  created_at: string;
}
