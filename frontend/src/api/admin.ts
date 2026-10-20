import api from './axios';
import type { HotelDto, RoomDto, BookingDto, HotelReportDto, InventoryDto, UpdateInventoryRequest } from '../types';

export const adminApi = {
  // ─── Hotel CRUD ──────────────────────────────────────────────────────────

  /**
   * GET /admin/hotels
   * Returns List<HotelDto> — only hotels owned by the logged-in manager
   */
  getAllHotels: async (): Promise<HotelDto[]> => {
    const res = await api.get<HotelDto[]>('/admin/hotels');
    return res.data;
  },

  /**
   * GET /admin/hotels/{hotelId}
   * Returns HotelDto
   */
  getHotel: async (hotelId: number): Promise<HotelDto> => {
    const res = await api.get<HotelDto>(`/admin/hotels/${hotelId}`);
    return res.data;
  },

  /**
   * POST /admin/hotels
   * Body: HotelDto
   * Returns HotelDto (status 201)
   */
  createHotel: async (data: HotelDto): Promise<HotelDto> => {
    const res = await api.post<HotelDto>('/admin/hotels', data);
    return res.data;
  },

  /**
   * PUT /admin/hotels/{hotelId}
   * Body: HotelDto
   * Returns updated HotelDto
   */
  updateHotel: async (hotelId: number, data: HotelDto): Promise<HotelDto> => {
    const res = await api.put<HotelDto>(`/admin/hotels/${hotelId}`, data);
    return res.data;
  },

  /**
   * DELETE /admin/hotels/{hotelId}
   * Returns 204 No Content
   */
  deleteHotel: async (hotelId: number): Promise<void> => {
    await api.delete(`/admin/hotels/${hotelId}`);
  },

  /**
   * PATCH /admin/hotels/{hotelId}/activate
   * Returns 204 No Content — sets hotel.active = true and creates inventory
   */
  activateHotel: async (hotelId: number): Promise<void> => {
    await api.patch(`/admin/hotels/${hotelId}/activate`);
  },

  // ─── Room CRUD ────────────────────────────────────────────────────────────

  /**
   * GET /admin/hotels/{hotelId}/rooms
   * Returns List<RoomDto>
   */
  getAllRooms: async (hotelId: number): Promise<RoomDto[]> => {
    const res = await api.get<RoomDto[]>(`/admin/hotels/${hotelId}/rooms`);
    return res.data;
  },

  /**
   * POST /admin/hotels/{hotelId}/rooms
   * Body: RoomDto { type, basePrice, totalCount, amenities, photos }
   * Returns RoomDto (status 201)
   */
  createRoom: async (hotelId: number, data: RoomDto): Promise<RoomDto> => {
    const res = await api.post<RoomDto>(`/admin/hotels/${hotelId}/rooms`, data);
    return res.data;
  },

  /**
   * PUT /admin/hotels/{hotelId}/rooms/{roomId}
   * Body: RoomDto
   * Returns updated RoomDto
   */
  updateRoom: async (hotelId: number, roomId: number, data: RoomDto): Promise<RoomDto> => {
    const res = await api.put<RoomDto>(`/admin/hotels/${hotelId}/rooms/${roomId}`, data);
    return res.data;
  },

  /**
   * DELETE /admin/hotels/{hotelId}/rooms/{roomId}
   * Returns 204 No Content
   */
  deleteRoom: async (hotelId: number, roomId: number): Promise<void> => {
    await api.delete(`/admin/hotels/${hotelId}/rooms/${roomId}`);
  },

  // ─── Bookings & Reports ───────────────────────────────────────────────────

  /**
   * GET /admin/hotels/{hotelId}/bookings
   * Returns List<BookingDto>
   */
  getHotelBookings: async (hotelId: number): Promise<BookingDto[]> => {
    const res = await api.get<BookingDto[]>(`/admin/hotels/${hotelId}/bookings`);
    return res.data;
  },

  /**
   * GET /admin/hotels/{hotelId}/reports
   * Optional query params: startDate, endDate (ISO date strings)
   * Returns HotelReportDto { totalBookings, totalRevenue, avgRevenue }
   */
  getHotelReport: async (hotelId: number, startDate?: string, endDate?: string): Promise<HotelReportDto> => {
    const params: Record<string, string> = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const res = await api.get<HotelReportDto>(`/admin/hotels/${hotelId}/reports`, { params });
    return res.data;
  },

  // ─── Inventory ────────────────────────────────────────────────────────────

  /**
   * GET /admin/inventory/rooms/{roomId}
   * Returns List<InventoryDto>
   */
  getRoomInventory: async (roomId: number): Promise<InventoryDto[]> => {
    const res = await api.get<InventoryDto[]>(`/admin/inventory/rooms/${roomId}`);
    return res.data;
  },

  /**
   * PATCH /admin/inventory/rooms/{roomId}
   * Body: UpdateInventoryRequestDto { startDate, endDate, closed, surgeFactor }
   * Returns 204 No Content
   */
  updateInventory: async (roomId: number, data: UpdateInventoryRequest): Promise<void> => {
    await api.patch(`/admin/inventory/rooms/${roomId}`, data);
  },
};
