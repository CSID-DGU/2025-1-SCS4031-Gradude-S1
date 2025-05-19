interface OpeningHours {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

interface Hospital {
  id: string;
  name: string;
  address: string;
  phoneNumber: string;
  distance: number;
  longitude: number;
  latitude: number;
  openingHours: OpeningHours;
  isOpen: boolean;
  isCenter: boolean; // 이거 대형인지 아닌지
}

export type {Hospital, OpeningHours};
