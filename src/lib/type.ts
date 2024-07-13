export interface LocationType {
  id: string;
  name: string;
  normalizedName: string;
  category: string;
  detailCid: {
    c0: string;
    c1: string | null;
    c2: string | null;
    c3: string | null;
    __typename: string;
  };
  categoryCodeList: string[];
  dbType: string;
  distance: string;
  roadAddress: string;
  address: string;
  fullAddress: string;
  commonAddress: string;
  bookingUrl: string | null;
  phone: string | null;
  virtualPhone: string | null;
  businessHours: string;
  daysOff: string | null;
  imageUrl: string;
  imageCount: number;
  x: string;
  y: string;
  poiInfo: string | null;
  subwayId: string | null;
  isPublicGas: boolean | null;
  isDelivery: boolean;
  isTableOrder: boolean | null;
  isPreOrder: boolean | null;
  isTakeOut: boolean | null;
  isCvsDelivery: boolean;
  hasBooking: boolean;
  naverBookingCategory: string | null;
  bookingDisplayName: string;
  bookingBusinessId: string | null;
  bookingVisitId: string;
  bookingPickupId: string;
  baemin: {
    businessHours: {
      deliveryTime: {
        start: string;
        end: string;
        __typename: string;
      }[];
      closeDate: {
        start: string;
        end: string;
        __typename: string;
      };
      temporaryCloseDate: {
        start: string;
        end: string;
        __typename: string;
      } | null;
      __typename: string;
    };
    __typename: string;
  } | null;
  yogiyo: string | null;
  isPollingStation: boolean;
  hasNPay: boolean;
  talktalkUrl: string | null;
  visitorReviewCount: string;
  visitorReviewScore: string;
  blogCafeReviewCount: string;
  bookingReviewCount: string;
  streetPanorama: {
    id: string;
    pan: string;
    tilt: string;
    lat: string;
    lon: string;
    __typename: string;
  } | null;
  naverBookingHubId: string | null;
  bookingHubUrl: string | null;
  bookingHubButtonName: string | null;
  newOpening: string | null;
  newBusinessHours: {
    status: string;
    description: string;
    dayOff: string | null;
    dayOffDescription: string | null;
    __typename: string;
  };
  coupon: string | null;
  mid: string | null;
  __typename: string;

  // name: string;
  // category: string;
  // roadAddress: string;
  // fullAddress: string;
  // phone: string;
  // imageUrl: string;
  // x: string;
  // y: string;
  // deliveryTime: {
  //   start: string;
  //   end: string;
  // }[];
}
