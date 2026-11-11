export interface ContentBlock {
  id: string;
  type: 'titre' | 'texte' | 'image' | 'titre+texte' | 'titre+texte+image';
  titre?: string;
  texte?: string;
  imageUrl?: string;
}

export interface Product {
  id: string;
  slug: string;
  nom: string;
  prix: number;
  stock: number;
  cout_achat?: number;
  description: string | null;
  images: string[];
  content_blocks: ContentBlock[];
  actif: boolean;
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
