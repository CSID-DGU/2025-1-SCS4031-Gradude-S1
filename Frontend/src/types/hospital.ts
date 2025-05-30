export interface HospitalBoundsDto {
  neLatitude: number;
  neLongitude: number;
  swLatitude: number;
  swLongitude: number;
}

export interface HospitalMarkerDto {
  hospitalId: number;
  latitude: number;
  longitude: number;
  strokeCenter: boolean;
}

export interface HospitalSummaryDto extends HospitalMarkerDto {
  name: string;
  distance: number;
}

export interface OpeningHourDto {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

export interface HospitalDetailDto extends HospitalSummaryDto {
  address: string;
  phoneNumber: string;
  openingHour: OpeningHourDto;
  open: boolean;
}

export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}
