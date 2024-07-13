import React, { FC } from 'react';
import { LocationType } from '../lib/type';

interface LocationSheetItemViewProps {
  location: LocationType;
}

const LocationSheetItemView: FC<LocationSheetItemViewProps> = ({location}) => {
  return <div>LocationSheetItemView</div>;
};

export default LocationSheetItemView;
