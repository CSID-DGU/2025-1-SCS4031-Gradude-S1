import axiosInstance from '@/api/axios';
import {
  ApiResponse,
  HospitalBoundsDto,
  HospitalMarkerDto,
  HospitalSummaryDto,
  HospitalDetailDto,
} from '@/types/hospital';

export const fetchHospitalMarkers = async (
  bounds: HospitalBoundsDto,
): Promise<HospitalMarkerDto[]> => {
  const {data} = await axiosInstance.get<ApiResponse<HospitalMarkerDto[]>>(
    '/api/hospital',
    {params: bounds},
  );
  return data.result;
};

export const fetchNearestHospitals = async (
  latitude: number,
  longitude: number,
): Promise<HospitalSummaryDto[]> => {
  const {data} = await axiosInstance.get<ApiResponse<HospitalSummaryDto[]>>(
    '/api/hospital/nearest',
    {params: {latitude, longitude}},
  );
  return data.result;
};

export const fetchHospitalSearch = async (
  latitude: number,
  longitude: number,
  keyword: string,
  page = 0,
  size = 6,
): Promise<HospitalSummaryDto[]> => {
  const {data} = await axiosInstance.get<
    ApiResponse<{
      content: HospitalSummaryDto[];
    }>
  >('/api/hospital/search', {
    params: {latitude, longitude, keyword, page, size},
  });
  if (!data.result || !Array.isArray(data.result.content)) {
    throw new Error('잘못된 서버 응답 형식입니다.');
  }
  return data.result.content;
};

export const fetchHospitalMarker = async (
  hospitalId: number | string,
  latitude: number,
  longitude: number,
): Promise<HospitalDetailDto> => {
  const {data} = await axiosInstance.get<ApiResponse<HospitalDetailDto>>(
    `/api/hospital/${hospitalId}/marker`,
    {params: {latitude, longitude}},
  );
  return data.result;
};

export const fetchHospitalDetail = async (
  hospitalId: number | string,
  latitude: number,
  longitude: number,
): Promise<HospitalDetailDto> => {
  const {data} = await axiosInstance.get<ApiResponse<HospitalDetailDto>>(
    `/api/hospital/${hospitalId}/detail`,
    {params: {latitude, longitude}},
  );
  return data.result;
};
