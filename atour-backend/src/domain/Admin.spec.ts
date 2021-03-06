import * as Admin from './Admin';
import {
  Guide,
  GuideType,
  ApprovalStatus,
  PaidTrip,
  TripType,
  ApprovedTrip,
  RefundRequestedTrip,
  RefundedTrip,
  RejectedPaidTrip
} from './types';

describe('Admin', () => {
  test('ApproveGuide', async () => {
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
      dealtTrips: []
    };
    const resultGuide = Admin.approveGuide()(unapprovedGuide);
    expect(resultGuide).toEqual(approvedGuide);
  });
  test('RejectGuide', async () => {
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
    const resultGuide = Admin.rejectGuide()(unapprovedGuide);
    expect(resultGuide).toEqual(rejectedGuide);
  });

  test('MarkBadGuide', async () => {
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
      dealtTrips: []
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
      dealtTrips: []
    };
    const resultGuide = Admin.markBadGuide()(shittyGuide);
    expect(resultGuide).toEqual(markedGuide);
  });
  test('ApproveTrip', async () => {
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
    const resultTrip = Admin.approveTrip()(paidTrip, new Date('2018-11-11'));
    expect(resultTrip).toEqual(approvedTrip);
  });
  test('ApproveTrip', async () => {
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
    const resultTrip = Admin.rejectTrip()(paidTrip);
    expect(resultTrip).toEqual(rejectedTrip);
  });
  test('RefundTrip', async () => {
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
    const resultTrip = Admin.refundTrip()(
      requestedTrip,
      new Date('2018-12-12')
    );
    expect(resultTrip).toEqual(refundedTrip);
  });
  test('RejectTrip', async () => {
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
    const resultTrip = Admin.rejectRefundRequest()(
      requestedTrip
    );
    expect(resultTrip).toEqual(rejectedRefundTrip);
  });
});
