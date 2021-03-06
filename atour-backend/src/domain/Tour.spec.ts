import * as TourDomain from './Tour';
import { Tour, TripType, Trip } from './types';

describe('Tour', () => {
  test('create Tour', () => {
    const tour = TourDomain.publishTour(() => 'tourId')(
      'Changmai',
      1,
      5,
      3500,
      'trip to Changmai',
      'guideid'
    );
    const expectedTour: Tour = {
      tourId: 'tourId',
      tourName: 'Changmai',
      minimumSize: 1,
      maximumSize: 5,
      price: 3500,
      detail: 'trip to Changmai',
      reviews: [],
      trips: [],
      guideId: 'guideid',
      imageUrl: null
    };
    expect(tour).toEqual(expectedTour);
  });
  test('create Tour with image', () => {
    const tour = TourDomain.publishTour(() => 'tourId')(
      'Changmai',
      1,
      5,
      3500,
      'trip to Changmai',
      'guideid',
      'www.google.com'
    );
    const expectedTour: Tour = {
      tourId: 'tourId',
      tourName: 'Changmai',
      minimumSize: 1,
      maximumSize: 5,
      price: 3500,
      detail: 'trip to Changmai',
      reviews: [],
      trips: [],
      guideId: 'guideid',
      imageUrl: 'www.google.com'
    };
    expect(tour).toEqual(expectedTour);
  });

  test('edit Tour', () => {
    const editedTour = TourDomain.editTour()(
      {
        tourId: 'tourId',
        tourName: 'Changmai',
        minimumSize: 1,
        maximumSize: 5,
        price: 3500,
        detail: 'trip to Changmai',
        reviews: [],
        trips: [],
        guideId: 'guideid',
        imageUrl: null
      },
      {
        tourName: 'Changmai trip',
        price: 5000,
        imageUrl: 'www.google.com'
      }
    );
    const expectedTour: Tour = {
      tourId: 'tourId',
      tourName: 'Changmai trip',
      minimumSize: 1,
      maximumSize: 5,
      price: 5000,
      detail: 'trip to Changmai',
      reviews: [],
      trips: [],
      guideId: 'guideid',
      imageUrl: 'www.google.com'
    };
    expect(editedTour).toEqual(expectedTour);
  });

  test('add Trip', () => {
    const tour: Tour = {
      tourId: 'tourId',
      tourName: 'Changmai',
      minimumSize: 1,
      maximumSize: 5,
      price: 3500,
      detail: 'trip to Changmai',
      trips: [],
      reviews: [],
      guideId: 'guideid',
      imageUrl: null
    };
    const resultTrip = TourDomain.addTrip(() => 'newidkrub')(
      tour,
      new Date('2018-11-04')
    );

    const expectedTrip: Trip = {
      _type: TripType.UnbookedTrip,
      tripId: 'newidkrub',
      tripDate: new Date('2018-11-04'),
      tourId: 'tourId',
      tourName: 'Changmai'
    }

    expect(resultTrip).toEqual(expectedTrip)
    // const expectedTour: Tour = {
    //   tourId: 'tourId',
    //   tourName: 'Changmai',
    //   minimumSize: 1,
    //   maximumSize: 5,
    //   price: 3500,
    //   detail: 'trip to Changmai',
    //   trips: [
    //     {
    //       _type: TripType.UnbookedTrip,
    //       tripId: 'newidkrub',
    //       tripDate: new Date('2018-11-04'),
    //       tourId: 'tourId',
    //       tourName: 'Changmai'
    //     }
    //   ],
    //   reviews: [],
    //   guideId: 'guideid',
    //   imageUrl: null
    // };
    // expect(tourWithTrip).toEqual(expectedTour);
  });
  test('delete Trip', () => {
    const tour: Tour = {
      tourId: 'tourId',
      tourName: 'Changmai',
      minimumSize: 1,
      maximumSize: 5,
      price: 3500,
      detail: 'trip to Changmai',
      trips: [
        {
          _type: TripType.UnbookedTrip,
          tripId: 'tripId',
          tripDate: new Date('2018-11-04'),
          tourId: 'tourId',
          tourName: 'tourName'
        }
      ],
      reviews: [],
      guideId: 'guideid',
      imageUrl: null
    };
    const resultTour = TourDomain.deleteTrip()(tour, 'tripId');
    const expectedTour: Tour = {
      tourId: 'tourId',
      tourName: 'Changmai',
      minimumSize: 1,
      maximumSize: 5,
      price: 3500,
      detail: 'trip to Changmai',
      trips: [],
      reviews: [],
      guideId: 'guideid',
      imageUrl: null
    };
    expect(resultTour).toEqual(expectedTour);
  });
});
