import api from './axios';
import type { BookingDto, BookingRequest, BookingStatusResponse } from '../types';

export const bookingsApi = {
  /**
   * POST /bookings/init
   * Body: BookingRequest { hotelId, roomId, checkInDate, checkOutDate, roomsCount }
   * Returns BookingDto — booking is in RESERVED state (10-min expiry)
   */
  initBooking: async (data: BookingRequest): Promise<BookingDto> => {
    const res = await api.post<BookingDto>('/bookings/init', data);
    return res.data;
  },

  /**
   * POST /bookings/{bookingId}/addGuests
   * Body: List<Long> (guest IDs)
   * Returns BookingDto in GUESTS_ADDED state
   */
  addGuests: async (bookingId: number, guestIds: number[]): Promise<BookingDto> => {
    const res = await api.post<BookingDto>(`/bookings/${bookingId}/addGuests`, guestIds);
    return res.data;
  },

  /**
   * POST /bookings/{bookingId}/payments
   * Returns { sessionUrl: string } — Stripe checkout URL
   */
  initiatePayment: async (bookingId: number): Promise<{ sessionUrl: string }> => {
    const res = await api.post<{ sessionUrl: string }>(`/bookings/${bookingId}/payments`);
    return res.data;
  },

  /**
   * GET /bookings/{bookingId}/status
   * Returns BookingStatusResponse { bookingStatus }
   */
  getStatus: async (bookingId: number): Promise<BookingStatusResponse> => {
    const res = await api.get<BookingStatusResponse>(`/bookings/${bookingId}/status`);
    return res.data;
  },

  /**
   * POST /bookings/{bookingId}/cancel
   * Cancels the booking and initiates a Stripe refund (if confirmed)
   */
  cancelBooking: async (bookingId: number): Promise<void> => {
    await api.post(`/bookings/${bookingId}/cancel`);
  },
};
