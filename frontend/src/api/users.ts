import api from './axios';
import type { UserDto, BookingDto, GuestDto, ProfileUpdateRequest } from '../types';

export const usersApi = {
  /**
   * GET /users/profile
   * Returns plain UserDto
   */
  getProfile: async (): Promise<UserDto> => {
    const res = await api.get<UserDto>('/users/profile');
    return res.data;
  },

  /**
   * PATCH /users/profile
   * Body: ProfileUpdateRequestDto { name, dateOfBirth, gender }
   * Returns 204 No Content
   */
  updateProfile: async (data: ProfileUpdateRequest): Promise<void> => {
    await api.patch('/users/profile', data);
  },

  /**
   * GET /users/myBookings
   * Returns List<BookingDto>
   */
  getMyBookings: async (): Promise<BookingDto[]> => {
    const res = await api.get<BookingDto[]>('/users/myBookings');
    return res.data;
  },

  /**
   * GET /users/guests
   * Returns List<GuestDto>
   */
  getGuests: async (): Promise<GuestDto[]> => {
    const res = await api.get<GuestDto[]>('/users/guests');
    return res.data;
  },

  /**
   * POST /users/guests
   * Body: GuestDto { name, gender, dateOfBirth }
   * Returns GuestDto with id set (status 201)
   */
  addGuest: async (data: GuestDto): Promise<GuestDto> => {
    const res = await api.post<GuestDto>('/users/guests', data);
    return res.data;
  },

  /**
   * PUT /users/guests/{guestId}
   * Body: GuestDto
   * Returns 204 No Content
   */
  updateGuest: async (guestId: number, data: GuestDto): Promise<void> => {
    await api.put(`/users/guests/${guestId}`, data);
  },

  /**
   * DELETE /users/guests/{guestId}
   * Returns 204 No Content
   */
  deleteGuest: async (guestId: number): Promise<void> => {
    await api.delete(`/users/guests/${guestId}`);
  },
};
