import {useQuery} from '@tanstack/react-query';
import {
  fetchHospitalMarkers,
  fetchNearestHospitals,
  fetchHospitalSearch,
  fetchHospitalMarker,
  fetchHospitalDetail,
} from '@/api/hospitals';
import {
  HospitalMarkerDto,
  HospitalSummaryDto,
  HospitalDetailDto,
} from '@/types/hospital';

export const useHospitalMarkers = (bounds?: {
  neLatitude: number;
  neLongitude: number;
  swLatitude: number;
  swLongitude: number;
}) =>
  useQuery<HospitalMarkerDto[]>({
    queryKey: [
      'hospitalMarkers',
      bounds?.neLatitude,
      bounds?.neLongitude,
      bounds?.swLatitude,
      bounds?.swLongitude,
    ],
    queryFn: () => fetchHospitalMarkers(bounds!),
    enabled: Boolean(bounds),
  });
// 근처 병원 리스트용 DTO
export const useNearestHospitals = (latitude?: number, longitude?: number) =>
  useQuery<HospitalSummaryDto[]>({
    queryKey: ['nearestHospitals', latitude, longitude],
    queryFn: () => fetchNearestHospitals(latitude!, longitude!),
    enabled: latitude !== undefined && longitude !== undefined,
  });

// 검색 병원 리스트용 DTO
export const useHospitalSearch = (
  latitude?: number,
  longitude?: number,
  keyword?: string,
) =>
  useQuery<HospitalSummaryDto[]>({
    queryKey: ['hospitalSearch', latitude, longitude, keyword],
    queryFn: () => fetchHospitalSearch(latitude!, longitude!, keyword!),
    enabled:
      latitude !== undefined &&
      longitude !== undefined &&
      Boolean(keyword) &&
      keyword!.length >= 2,
  });

// 특정 병원 마커 상세 DTO
export const useHospitalMarker = (
  hospitalId?: string,
  latitude?: number,
  longitude?: number,
) =>
  useQuery<HospitalDetailDto>({
    queryKey: ['hospitalMarker', hospitalId, latitude, longitude],
    queryFn: () => fetchHospitalMarker(hospitalId!, latitude!, longitude!),
    enabled:
      Boolean(hospitalId) && latitude !== undefined && longitude !== undefined,
  });

// 특정 병원 상세 페이지용 DTO
export const useHospitalDetail = (
  hospitalId?: string,
  latitude?: number,
  longitude?: number,
) =>
  useQuery<HospitalDetailDto>({
    queryKey: ['hospitalDetail', hospitalId, latitude, longitude],
    queryFn: () => fetchHospitalDetail(hospitalId!, latitude!, longitude!),
    enabled:
      Boolean(hospitalId) && latitude !== undefined && longitude !== undefined,
  });
