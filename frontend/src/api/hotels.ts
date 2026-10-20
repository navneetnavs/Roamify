import api from './axios';
import type { HotelPriceResponseDto, HotelInfoDto, HotelSearchRequest, HotelInfoRequestDto } from '../types';
import type { Page } from '../types';

export const hotelsApi = {
  /**
   * GET /hotels/search
   * Backend uses @RequestBody on a GET — axios must send data as request body
   * Returns Page<HotelPriceResponseDto>
   */
  search: async (params: {
    city?: string;
    startDate: string;
    endDate: string;
    roomsCount: number;
    page?: number;
    size?: number;
  }): Promise<Page<HotelPriceResponseDto>> => {
    const query: HotelSearchRequest = {
      city: params.city || '',
      startDate: params.startDate,
      endDate: params.endDate,
      roomsCount: params.roomsCount,
      page: params.page ?? 0,
      size: params.size ?? 9,
    };

    const res = await api.get<Page<HotelPriceResponseDto>>('/hotels/search', {
      params: query,
    });
    return res.data;
  },

  /**
   * GET /hotels/{hotelId}/info
   * Returns HotelInfoDto { hotel, rooms }
   */
  getInfo: async (hotelId: number, params: {
    startDate: string;
    endDate: string;
    roomsCount: number;
  }): Promise<HotelInfoDto> => {
    const query: HotelInfoRequestDto = {
      startDate: params.startDate,
      endDate: params.endDate,
      roomsCount: params.roomsCount,
    };

    const res = await api.get<HotelInfoDto>(`/hotels/${hotelId}/info`, {
      params: query,
    });
    return res.data;
  },
};
