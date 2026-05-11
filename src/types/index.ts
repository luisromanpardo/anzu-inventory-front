// User & Auth Types
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  is_public: boolean;
  created_at: string;
  social?: {
    instagram?: string;
    twitter?: string;
    whatsapp?: string;
    discord?: string;
    konami_id?: string;
    facebook?: string;
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  terms_accepted: boolean;
}

// Card Types
export interface Card {
  id: string;
  name: string;
  type: string;
  archetype?: string;
  image_url: string;
  atk?: number;
  def?: number;
  level?: number;
  attribute?: string;
  description?: string;
  owner_count: number;
}

export interface CardSet {
  id: string;
  name: string;
  set_code: string;
  rarity: string;
  price?: number;
  image_url?: string;
}

export interface CardDetail extends Card {
  sets: CardSet[];
}

// Inventory Types
export type Condition = 'mint' | 'near_mint' | 'excellent' | 'good' | 'light_plaid' | 'plaid' | 'poor';
export type Language = 'english' | 'japanese' | 'spanish' | 'french' | 'german' | 'italian' | 'portuguese';
export type Edition = '1st_edition' | 'unlimited';

export interface InventoryItem {
  id: string;
  card_id: string;
  cantidad: number;
  condicion: Condition;
  idioma: Language;
  edicion?: Edition;
  notas?: string;
  card?: Card;
  created_at?: string;
  updated_at?: string;
}

export interface AddInventoryItem {
  card_id: number;
  cantidad: number;
  condicion: Condition;
  idioma: string;
  edicion?: string;
  notas?: string;
}

export interface UpdateInventoryItem {
  cantidad?: number;
  condicion?: Condition;
  idioma?: string;
  edicion?: string;
  notas?: string;
}

// Owner Types
export interface CardOwner {
  username: string;
  cantidad: number;
  condicion: string;
  idioma: string;
  instagram?: string;
  twitter?: string;
  discord?: string;
  whatsapp?: string;
}

export interface CardWithOwners {
  card: CardDetail;
  owners: CardOwner[];
}

// Public Profile Types
export interface PublicProfile {
  username: string;
  role: 'user' | 'admin';
  created_at: string;
  social: {
    instagram?: string;
    twitter?: string;
    whatsapp?: string;
    discord?: string;
    konami_id?: string;
  };
  card_count: number;
  inventory: InventoryItem[];
}

// Pagination Types
export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

// API Response Types
export interface ApiError {
  message: string;
  code?: string;
}

// Home Feed Types
export interface HomeCard {
  id: string;
  name: string;
  type: string;
  archetype?: string;
  image_url: string;
  owner_count: number;
}

// Admin Types
export interface SyncStatus {
  synced_at: string;
  cards_created: number;
  cards_updated: number;
  status: 'idle' | 'running' | 'completed' | 'failed';
  duration_ms?: number;
}

// Social Types
export interface FollowUser {
  id: string;
  username: string;
  role: 'user' | 'admin';
  is_public: boolean;
  created_at: string;
}

export interface FollowersResponse {
  data: FollowUser[];
  pagination: PaginationInfo;
}