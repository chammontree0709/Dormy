export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Room {
  id: string
  name: string
  invite_code: string
  created_by: string
  created_at: string
}

export interface RoomMember {
  room_id: string
  user_id: string
  display_name: string
  joined_at: string
}

export interface RoomItem {
  id: string
  room_id: string
  preset_id: string | null
  custom_name: string | null
  custom_url: string | null
  category: string
  is_checked: boolean
  checked_by_name: string | null
  checked_at: string | null
  claimed_by_name: string | null
  claimed_at: string | null
  added_by_name: string
  added_at: string
  notes: string | null
  sort_order: number
  quantity: number
}

export interface PresetItem {
  id: string
  name: string
  description: string
  category: string
  amazon_url: string
  image_emoji: string
  price_estimate: string
  priority: 'essential' | 'recommended' | 'nice-to-have'
  reviews: Review[]
  tags: string[]
}

export interface Review {
  author: string
  rating: number
  text: string
  date: string
}

export interface Category {
  id: string
  name: string
  icon: string
  description: string
}
