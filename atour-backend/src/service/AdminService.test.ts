import * as AdminService from './AdminService';
import {
  Guide,
  GuideType,
  ApprovalStatus,
  Customer,
  Tour,
  PaidTrip,
  TripType,
  ApprovedTrip,
  RefundedTrip,
  RefundRequestedTrip,
  RejectedPaidTrip
} from '../domain/types';
import { GetGuideDb, SaveGuideDb } from '../repository/Guide';
import { GetCustomerDb, UpdateCustomerDb } from '../repository/Customer';
import {
  GetTourDb,
  GetTripDb,
  UpdateTourDb,
  UpdateTripDb,
  GetRefundTripDb
} from '../repository/Tour';

describe('AdminService', () => {
  test('ApproveGuideService', async () => {
    const unapprovedGuide: Guide = {
      _type: GuideType.UnApprovedGuide,
      guideId: 'guideId',
      userName: 'guideusername',
      password: 'password',
      bankAccountNumber: '2134592',
      bankName: 'SCB',
      email: 'email@gmail.com',
      personalId: '1928483849283',
      profile: {
        firstName: 'first',
        lastName: 'last',
        birthDate: new Date(1234),
        phoneNumber: '0983746888',
        gender: 'Male',
        profileImageUrl: null
      },
      approvalStatus: ApprovalStatus.NotApprove
    };
    const approvedGuide: Guide = {
      _type: GuideType.ApprovedGuide,
      guideId: 'guideId',
      userName: 'guideusername',
      password: 'password',
      bankAccountNumber: '2134592',
      bankName: 'SCB',
      email: 'email@gmail.com',
      personalId: '1928483849283',
      profile: {
        firstName: 'first',
        lastName: 'last',
        birthDate: new Date(1234),
        phoneNumber: '0983746888',
        gender: 'Male',
        profileImageUrl: null
      },
      approvalStatus: ApprovalStatus.Approved,
      availableDate: [],
      dealtTrips: [],
    };
    const fakeGetGuide: GetGuideDb = async guideId => {
      expect(guideId).toEqual('guideId');
      return unapprovedGuide;
    };
    const fakeSaveGuide: SaveGuideDb = async savedGuide => {
      expect(savedGuide).toEqual(approvedGuide);
    };
    const approvedResult = await AdminService.approveGuideService(
      fakeGetGuide,
      fakeSaveGuide
    )('guideId');
    expect(approvedResult).toEqual(approvedGuide);
  });

  test('RejectGuideService', async () => {
    const unapprovedGuide: Guide = {
      _type: GuideType.UnApprovedGuide,
      guideId: 'guideId',
      userName: 'guideusername',
      password: 'password',
      bankAccountNumber: '2134592',
      bankName: 'SCB',
      email: 'email@gmail.com',
      personalId: '1928483849283',
      profile: {
        firstName: 'first',
        lastName: 'last',
        birthDate: new Date(1234),
        phoneNumber: '0983746888',
        gender: 'Male',
        profileImageUrl: null
      },
      approvalStatus: ApprovalStatus.NotApprove
    };
    const rejectedGuide: Guide = {
      _type: GuideType.RejectedGuide,
      guideId: 'guideId',
      userName: 'guideusername',
      password: 'password',
      bankAccountNumber: '2134592',
      bankName: 'SCB',
      email: 'email@gmail.com',
      personalId: '1928483849283',
      profile: {
        firstName: 'first',
        lastName: 'last',
        birthDate: new Date(1234),
        phoneNumber: '0983746888',
        gender: 'Male',
        profileImageUrl: null
      },
      approvalStatus: ApprovalStatus.NotApprove
    };
    const fakeGetGuide: GetGuideDb = async guideId => {
      expect(guideId).toEqual('guideId');
      return unapprovedGuide;
    };
    const fakeSaveGuide: SaveGuideDb = async savedGuide => {
      expect(savedGuide).toEqual(rejectedGuide);
    };
    const approvedResult = await AdminService.rejectGuideService(
      fakeGetGuide,
      fakeSaveGuide
    )('guideId');
    expect(approvedResult).toEqual(rejectedGuide);
  });

  test('MarkBadGuideService', async () => {
    const shittyGuide: Guide = {
      _type: GuideType.ApprovedGuide,
      guideId: 'guideId',
      userName: 'guideusername',
      password: 'password',
      bankAccountNumber: '2134592',
      bankName: 'SCB',
      email: 'email@gmail.com',
      personalId: '1928483849283',
      profile: {
        firstName: 'first',
        lastName: 'last',
        birthDate: new Date(1234),
        phoneNumber: '0983746888',
        gender: 'Male',
        profileImageUrl: null
      },
      approvalStatus: ApprovalStatus.Approved,
      availableDate: [],
      dealtTrips: [],
    };
    const markedGuide: Guide = {
      _type: GuideType.BadGuide,
      guideId: 'guideId',
      userName: 'guideusername',
      password: 'password',
      bankAccountNumber: '2134592',
      bankName: 'SCB',
      email: 'email@gmail.com',
      personalId: '1928483849283',
      profile: {
        firstName: 'first',
        lastName: 'last',
        birthDate: new Date(1234),
        phoneNumber: '0983746888',
        gender: 'Male',
        profileImageUrl: null
      },
      approvalStatus: ApprovalStatus.Approved,
      availableDate: [],
      dealtTrips: [],
    };
    const fakeGetGuide: GetGuideDb = async guideId => {
      expect(guideId).toEqual('guideId');
      return shittyGuide;
    };
    const fakeSaveGuide: SaveGuideDb = async savedGuide => {
      expect(savedGuide).toEqual(markedGuide);
    };
    const markResult = await AdminService.markBadGuideService(
      fakeGetGuide,
      fakeSaveGuide
    )('guideId');
    expect(markResult).toEqual(markedGuide);
  });

  test('ApprovePaymentService', async () => {
    const customer: Customer = {
      customerId: 'customerid',
      userName: 'customerUser',
      password: 'password',
      email: 'customer@test.com',
      personalId: '1234567890123',
      profile: {
        firstName: 'Customername',
        lastName: 'Clastname',
        birthDate: new Date('1997-05-07'),
        phoneNumber: '0811111111',
        gender: 'Female',
        profileImageUrl: null
      },
      tripHistory: []
    };
    const tour: Tour = {
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
    const paidTrip: PaidTrip = {
      _type: TripType.PaidTrip,
      tripId: 'tripId',
      tripDate: new Date('2018-11-11'),
      bookInfo: {
        bookDate: new Date('2018-11-05'),
        customerId: 'customerId',
        size: 5,
        price: 5000
      },
      paidDate: new Date('2018-11-05'),
      slipImages: [{ url: 'www.adm.co.th' }],
      tourId: 'tourId',
      tourName: 'tourName'
    };
    const approvedTrip: ApprovedTrip = {
      _type: TripType.ApprovedTrip,
      tripId: 'tripId',
      tripDate: new Date('2018-11-11'),
      bookInfo: {
        bookDate: new Date('2018-11-05'),
        customerId: 'customerId',
        size: 5,
        price: 5000
      },
      paidDate: new Date('2018-11-05'),
      slipImages: [{ url: 'www.adm.co.th' }],
      approveDate: new Date('2018-11-11'),
      tourId: 'tourId',
      tourName: 'tourName'
    };

    const fakeGetCustomer: GetCustomerDb = async customerId => {
      return customer;
    };
    const fakeGetTour: GetTourDb = async tourId => {
      return tour;
    };
    const fakeGetTrip: GetTripDb = async tripId => {
      return paidTrip;
    };

    const fakeUpdateTour: UpdateTourDb = async tour => console.log(tour);
    const fakeUpdateTrip: UpdateTripDb = async trip => console.log(trip);
    const fakeUpdateCustomer: UpdateCustomerDb = async customer =>
      console.log(customer);

    const resultedTrip = await AdminService.approvePaymentService(
      fakeGetCustomer,
      fakeGetTour,
      fakeGetTrip,
      fakeUpdateTour,
      fakeUpdateTrip,
      fakeUpdateCustomer,
      () => new Date('2018-11-11')
    )('tourId', 'tripId', 'customerId');
    expect(resultedTrip).toEqual(approvedTrip);
  });

  test('RejectPaymentService', async () => {
    const customer: Customer = {
      customerId: 'customerid',
      userName: 'customerUser',
      password: 'password',
      email: 'customer@test.com',
      personalId: '1234567890123',
      profile: {
        firstName: 'Customername',
        lastName: 'Clastname',
        birthDate: new Date('1997-05-07'),
        phoneNumber: '0811111111',
        gender: 'Female',
        profileImageUrl: null
      },
      tripHistory: []
    };
    const tour: Tour = {
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
    const paidTrip: PaidTrip = {
      _type: TripType.PaidTrip,
      tripId: 'tripId',
      tripDate: new Date('2018-11-11'),
      bookInfo: {
        bookDate: new Date('2018-11-05'),
        customerId: 'customerId',
        size: 5,
        price: 5000
      },
      paidDate: new Date('2018-11-05'),
      slipImages: [{ url: 'www.adm.co.th' }],
      tourId: 'tourId',
      tourName: 'tourName'
    };
    const rejectedTrip: RejectedPaidTrip = {
      _type: TripType.RejectedPaidTrip,
      tripId: 'tripId',
      tripDate: new Date('2018-11-11'),
      bookInfo: {
        bookDate: new Date('2018-11-05'),
        customerId: 'customerId',
        size: 5,
        price: 5000
      },
      paidDate: new Date('2018-11-05'),
      slipImages: [{ url: 'www.adm.co.th' }],
      tourId: 'tourId',
      tourName: 'tourName'
    };

    const fakeGetCustomer: GetCustomerDb = async customerId => {
      return customer;
    };
    const fakeGetTour: GetTourDb = async tourId => {
      return tour;
    };
    const fakeGetTrip: GetTripDb = async tripId => {
      return paidTrip;
    };

    const fakeUpdateTour: UpdateTourDb = async tour => console.log(tour);
    const fakeUpdateTrip: UpdateTripDb = async trip => console.log(trip);
    const fakeUpdateCustomer: UpdateCustomerDb = async customer =>
      console.log(customer);

    const resultedTrip = await AdminService.rejectPaymentService(
      fakeGetCustomer,
      fakeGetTour,
      fakeGetTrip,
      fakeUpdateTour,
      fakeUpdateTrip,
      fakeUpdateCustomer
    )('tourId', 'tripId', 'customerId');
    expect(resultedTrip).toEqual(rejectedTrip);
  });

  test('ApproveRefundService', async () => {
    const customer: Customer = {
      customerId: 'customerid',
      userName: 'customerUser',
      password: 'password',
      email: 'customer@test.com',
      personalId: '1234567890123',
      profile: {
        firstName: 'Customername',
        lastName: 'Clastname',
        birthDate: new Date('1997-05-07'),
        phoneNumber: '0811111111',
        gender: 'Female',
        profileImageUrl: null
      },
      tripHistory: []
    };
    const tour: Tour = {
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
    const requestedTrip: RefundRequestedTrip = {
      _type: TripType.RefundRequestedTrip,
      tripId: 'tripId',
      tripDate: new Date('2018-11-11'),
      bookInfo: {
        bookDate: new Date('2018-11-05'),
        customerId: 'customerId',
        size: 5,
        price: 5000
      },
      paidDate: new Date('2018-11-05'),
      slipImages: [{ url: 'www.adm.co.th' }],
      approveDate: new Date('2018-11-11'),
      refundRequestDate: new Date('2018-12-01'),
      tourId: 'tourId',
      tourName: 'tourName'
    };
    const refundedTrip: RefundedTrip = {
      _type: TripType.RefundedTrip,
      tripId: 'tripId',
      tripDate: new Date('2018-11-11'),
      bookInfo: {
        bookDate: new Date('2018-11-05'),
        customerId: 'customerId',
        size: 5,
        price: 5000
      },
      paidDate: new Date('2018-11-05'),
      slipImages: [{ url: 'www.adm.co.th' }],
      approveDate: new Date('2018-11-11'),
      refundRequestDate: new Date('2018-12-01'),
      refundDate: new Date('2018-12-12'),
      tourId: 'tourId',
      tourName: 'tourName'
    };

    const fakeGetCustomer: GetCustomerDb = async customerId => {
      return customer;
    };
    const fakeGetTour: GetTourDb = async tourId => {
      return tour;
    };
    const fakeGetTrip: GetTripDb = async tripId => {
      return requestedTrip;
    };

    const fakeUpdateTour: UpdateTourDb = async tour => console.log(tour);
    const fakeUpdateTrip: UpdateTripDb = async trip => console.log(trip);
    const fakeUpdateCustomer: UpdateCustomerDb = async customer =>
      console.log(customer);

    const resultedTrip = await AdminService.approveRefundService(
      fakeGetCustomer,
      fakeGetTour,
      fakeGetTrip,
      fakeUpdateTour,
      fakeUpdateTrip,
      fakeUpdateCustomer,
      () => new Date('2018-12-12')
    )('tourId', 'tripId', 'customerId');
    expect(resultedTrip).toEqual(refundedTrip);
  });

  test('RejectRefundService', async () => {
    const customer: Customer = {
      customerId: 'customerid',
      userName: 'customerUser',
      password: 'password',
      email: 'customer@test.com',
      personalId: '1234567890123',
      profile: {
        firstName: 'Customername',
        lastName: 'Clastname',
        birthDate: new Date('1997-05-07'),
        phoneNumber: '0811111111',
        gender: 'Female',
        profileImageUrl: null
      },
      tripHistory: []
    };
    const tour: Tour = {
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
    const requestedTrip: RefundRequestedTrip = {
      _type: TripType.RefundRequestedTrip,
      tripId: 'tripId',
      tripDate: new Date('2018-11-11'),
      bookInfo: {
        bookDate: new Date('2018-11-05'),
        customerId: 'customerId',
        size: 5,
        price: 5000
      },
      paidDate: new Date('2018-11-05'),
      slipImages: [{ url: 'www.adm.co.th' }],
      approveDate: new Date('2018-11-11'),
      refundRequestDate: new Date('2018-12-01'),
      tourId: 'tourId',
      tourName: 'tourName'
    };
    const rejectedRefundTrip: ApprovedTrip = {
      _type: TripType.ApprovedTrip,
      tripId: 'tripId',
      tripDate: new Date('2018-11-11'),
      bookInfo: {
        bookDate: new Date('2018-11-05'),
        customerId: 'customerId',
        size: 5,
        price: 5000
      },
      paidDate: new Date('2018-11-05'),
      slipImages: [{ url: 'www.adm.co.th' }],
      approveDate: new Date('2018-11-11'),
      tourId: 'tourId',
      tourName: 'tourName'
    };

    const fakeGetCustomer: GetCustomerDb = async customerId => {
      return customer;
    };
    const fakeGetTour: GetTourDb = async tourId => {
      return tour;
    };
    const fakeGetTrip: GetTripDb = async tripId => {
      return requestedTrip;
    };

    const fakeUpdateTour: UpdateTourDb = async tour => console.log(tour);
    const fakeUpdateTrip: UpdateTripDb = async trip => console.log(trip);
    const fakeUpdateCustomer: UpdateCustomerDb = async customer =>
      console.log(customer);

    const resultedTrip = await AdminService.rejectRefundService(
      fakeGetCustomer,
      fakeGetTour,
      fakeGetTrip,
      fakeUpdateTour,
      fakeUpdateTrip,
      fakeUpdateCustomer
    )('tourId', 'tripId', 'customerId');
    expect(resultedTrip).toEqual(rejectedRefundTrip);
  });

  test('GetRefundRequest', async () => {
    const requestedTrips: RefundRequestedTrip[] = [
      {
        _type: TripType.RefundRequestedTrip,
        tripId: 'tripId',
        tripDate: new Date('2018-11-11'),
        bookInfo: {
          bookDate: new Date('2018-11-05'),
          customerId: 'customerId',
          size: 5,
          price: 5000
        },
        paidDate: new Date('2018-11-05'),
        slipImages: [{ url: 'www.adm.co.th' }],
        approveDate: new Date('2018-11-11'),
        refundRequestDate: new Date('2018-12-01'),
        tourId: 'tourId',
        tourName: 'tourName'
      },
      {
        _type: TripType.RefundRequestedTrip,
        tripId: 'tripId2',
        tripDate: new Date('2018-11-11'),
        bookInfo: {
          bookDate: new Date('2018-11-05'),
          customerId: 'customerId',
          size: 5,
          price: 5000
        },
        paidDate: new Date('2018-11-05'),
        slipImages: [{ url: 'www.adm.co.th' }],
        approveDate: new Date('2018-11-11'),
        refundRequestDate: new Date('2018-12-01'),
        tourId: 'tourId',
        tourName: 'tourName'
      }
    ]
    const fakeGetRefundTripDb: GetRefundTripDb = async () => {
      return requestedTrips;
    };
    const resultedTrips = await AdminService.getRefundRequests(fakeGetRefundTripDb)();
    expect(resultedTrips).toEqual(requestedTrips);
  })

  test('GetRefundRequest', async () => {
    const pendingPaymentTrips: PaidTrip[] = [
      {
        _type: TripType.PaidTrip,
        tripId: 'tripId',
        tripDate: new Date('2018-11-11'),
        bookInfo: {
          bookDate: new Date('2018-11-05'),
          customerId: 'customerId',
          size: 5,
          price: 5000
        },
        paidDate: new Date('2018-11-05'),
        slipImages: [{ url: 'www.adm.co.th' }],
        tourId: 'tourId',
        tourName: 'tourName'
      },
      {
        _type: TripType.PaidTrip,
        tripId: 'tripId2',
        tripDate: new Date('2018-11-11'),
        bookInfo: {
          bookDate: new Date('2018-11-05'),
          customerId: 'customerId',
          size: 5,
          price: 5000
        },
        paidDate: new Date('2018-11-05'),
        slipImages: [{ url: 'www.adm.co.th' }],
        tourId: 'tourId2',
        tourName: 'tourName2'
      }
    ]
    const fakeGetRefundTripDb: GetRefundTripDb = async () => {
      return pendingPaymentTrips;
    };
    const resultedTrips = await AdminService.getPendingPayments(fakeGetRefundTripDb)();
    expect(resultedTrips).toEqual(pendingPaymentTrips);
  })
});
