// ─── Auth ──────────────────────────────────────────────────────────────────

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginResponseDto {
  accessToken: string;
}

// ─── User / Profile ────────────────────────────────────────────────────────

export interface UserDto {
  id?: number;
  email?: string;
  name?: string;
  gender?: string;
  dateOfBirth?: string;
}

/** PATCH /users/profile */
export interface ProfileUpdateRequest {
  name?: string;
  dateOfBirth?: string;
  gender?: string;
}

export interface GuestDto {
  id?: number;
  name: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth: string;
}

// ─── Hotel ─────────────────────────────────────────────────────────────────

export interface ContactInfoDto {
  address?: string;
  phoneNumber?: string;
  email?: string;
  location?: string;
}

export interface HotelDto {
  id?: number;
  name: string;
  city: string;
  photos?: string[];
  amenities?: string[];
  active?: boolean;
  contactInfo?: ContactInfoDto;
}

/** Returned by GET /hotels/search */
export interface HotelPriceResponseDto {
  id: number;
  name: string;
  city: string;
  photos?: string[];
  amenities?: string[];
  price: number;
}

/** Body for GET /hotels/search */
export interface HotelSearchRequest {
  city: string;
  startDate: string;
  endDate: string;
  roomsCount: number;
  page: number;
  size: number;
}

/** Body for GET /hotels/{hotelId}/info */
export interface HotelInfoRequestDto {
  startDate: string;
  endDate: string;
  roomsCount: number;
}

/** Returned by GET /hotels/{hotelId}/info */
export interface HotelInfoDto {
  hotel: HotelDto;
  rooms: RoomPriceResponseDto[];
}

// ─── Room ──────────────────────────────────────────────────────────────────

/** Used for admin CRUD */
export interface RoomDto {
  id?: number;
  type: string;
  basePrice: number;
  photos?: string[];
  amenities?: string[];
  totalCount?: number;
  capacity?: number;
}

/** Returned inside HotelInfoDto — includes the dynamic price for the selected dates */
export interface RoomPriceResponseDto {
  id: number;
  type: string;
  price: number;
  basePrice?: number;
  photos?: string[];
  amenities?: string[];
  totalCount?: number;
  capacity?: number;
}

// ─── Booking ───────────────────────────────────────────────────────────────

/** POST /bookings/init body */
export interface BookingRequest {
  hotelId: number;
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  roomsCount: number;
}

export type BookingStatus =
  | 'RESERVED'
  | 'GUESTS_ADDED'
  | 'PAYMENTS_PENDING'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'CHECKED_IN'
  | 'CHECKED_OUT'
  | 'PENDING';

export interface BookingDto {
  id: number;
  checkInDate: string;
  checkOutDate: string;
  roomsCount: number;
  amount?: number;
  bookingStatus: string;
  guests?: GuestDto[];
  paymentSessionId?: string;
}

/** GET /bookings/{bookingId}/status response */
export interface BookingStatusResponse {
  bookingStatus: string;
}

/** POST /bookings/{bookingId}/payments response */
export interface BookingPaymentInitResponse {
  sessionUrl: string;
}

// ─── Inventory ─────────────────────────────────────────────────────────────

export interface InventoryDto {
  id?: number;
  date: string;
  closed: boolean;
  totalCount: number;
  bookedCount: number;
  reservedCount: number;
  surgeFactor?: number;
  price?: number;
}

/** PATCH /admin/inventory/rooms/{roomId} body */
export interface UpdateInventoryRequest {
  startDate: string;
  endDate: string;
  closed?: boolean;
  surgeFactor?: number;
}

// ─── Reports ──────────────────────────────────────────────────────────────

export interface HotelReportDto {
  totalBookings?: number;
  totalRevenue?: number;
  avgRevenue?: number;
  totalRooms?: number;
}

// ─── Pagination ────────────────────────────────────────────────────────────

export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;  // current page
  size: number;
}
