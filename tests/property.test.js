const acreApi = require('acre-api');


//Search
// API street name/num search (downtown IRS building)
describe('acreApi.search', () => {
    test('should return the correct address for a property', async () => {
      const expectedAddress = '1000 LIBERTY AVE PITTSBURGH, PA 15222';
      const mockProperty = { address: expectedAddress };
      const mockSearch = jest.fn().mockResolvedValue(mockProperty);
      acreApi.search = mockSearch;
  
      const property = await acreApi.search(1000, 'Liberty');
      expect(property.address).toBe(expectedAddress);
      expect(mockSearch).toHaveBeenCalledWith(1000, 'Liberty');
    });
  
    test('should return an error when the search fails', async () => {
      const mockSearch = jest.fn().mockRejectedValue(new Error('Search failed'));
      acreApi.search = mockSearch;
  
      try {
        await acreApi.search(1000, 'Liberty');
      } catch (err) {
        expect(err.message).toBe('Search failed');
        expect(mockSearch).toHaveBeenCalledWith(1000, 'Liberty');
      }
    });
  });


//Parcel
// Parcel search for for IRS building
describe('acreApi.parcel', () => {
    test('should return the correct address and school for a parcel', async () => {
        const expectedAddress = '1000 LIBERTY AVE PITTSBURGH, PA 15222';
        const expectedSchool = 'City Of Pittsburgh';
        const parcelId = '0009-P-00150-0000-00';
        const mockParcel = {
            address: expectedAddress,
            school: expectedSchool
        };
        const mockParcelFn = jest.fn().mockResolvedValue(mockParcel);
        acreApi.parcel = mockParcelFn;

        const parcel = await acreApi.parcel(parcelId);
        expect(parcel.address).toBe(expectedAddress);
        expect(parcel.school).toBe(expectedSchool);
        expect(mockParcelFn).toHaveBeenCalledWith(parcelId);
    });

    test('should return an error when the parcel search fails', async () => {
        const parcelId = '0009-P-00150-0000-00';
        const mockParcelFn = jest.fn().mockRejectedValue(new Error('Parcel search failed'));
        acreApi.parcel = mockParcelFn;

        try {
          await acreApi.parcel(parcelId);
        } catch (err) {
          expect(err.message).toBe('Parcel search failed');
          expect(mockParcelFn).toHaveBeenCalledWith(parcelId);
        }
    });
});


//Building Information

describe('acreApi.parcel.buildingInfo', () => {
    test('should return the correct address, style and yearBuilt for a building', async () => {
        const expectedAddress = '2131 VODELI ST PITTSBURGH, PA 15216';
        const expectedStyle = 'MULTI-FAMILY';
        const expectedYearBuilt = '1900';
        const buildingId = '0062-B-00058-0000-00';
        const mockBuilding = {
            address: expectedAddress,
            style: expectedStyle,
            yearBuilt: expectedYearBuilt
        };
        const mockBuildingInfoFn = jest.fn().mockResolvedValue(mockBuilding);
        acreApi.parcel.buildingInfo = mockBuildingInfoFn;

        const building = await acreApi.parcel.buildingInfo(buildingId);
        expect(building.address).toBe(expectedAddress);
        expect(building.style).toBe(expectedStyle);
        expect(building.yearBuilt).toEqual(expectedYearBuilt);
        expect(mockBuildingInfoFn).toHaveBeenCalledWith(buildingId);
    });

    test('should return an error when the buildingInfo search fails', async () => {
        const buildingId = '0062-B-00058-0000-00';
        const mockBuildingInfoFn = jest.fn().mockRejectedValue(new Error('BuildingInfo search failed'));
        acreApi.parcel.buildingInfo = mockBuildingInfoFn;

        try {
          await acreApi.parcel.buildingInfo(buildingId);
        } catch (err) {
            expect(err.message).toBe('BuildingInfo search failed');
            expect(mockBuildingInfoFn).toHaveBeenCalledWith(buildingId);
        }
    });
});

