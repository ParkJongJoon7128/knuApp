export interface LocationType {
  address_name?: string;
  category_group_name?: string;
  phone_number?: string;
  place_name?: string;
  thumbnail_url?:string,
  latitude?: string;
  longitude?: string;
}

export interface UserType {
  address_name?: string;
  category_group_name?: string;
  phone_number?: string;
  place_name?: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  advantage?: string;
  disadvantage?: string;
}

export interface ReviewType {
  address_name?: string;
  category_group_name?: string;
  phone_number?: string;
  place_name?: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  advantage?: string;
  disadvantage?: string;
}