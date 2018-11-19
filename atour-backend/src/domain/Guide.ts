import { List } from 'immutable';
import {
  Tour,
  Guide,
  GuideType,
  UnApprovedGuide,
  ApprovalStatus,
  Gender,
  UserProfile,
  ApprovedGuide,
  BadGuide
} from './types';
import { IdGenerator } from './Tour';

type RegisterGuide = (
  userName: string,
  password: string,
  personalId: string,
  email: string,
  firstName: string,
  lastName: string,
  phoneNumber: string,
  birthDate: Date,
  bankAccountNumber: string,
  bankName: string,
  gender: Gender
) => UnApprovedGuide;

type ApproveGuide = (g: Guide) => ApprovedGuide

type MarkBadGuide = (g: Guide) => BadGuide

type AddPublishedTour = (c: Guide, t: Tour) => Guide;

type EditPublishedTour = (c: Guide, editedTour: Tour) => Guide;

type EditGuide = (g: Guide, p: UserProfile) => Guide;

export function registerGuide(idGenerator: IdGenerator): RegisterGuide {
  return (
    userName,
    password,
    personalId,
    email,
    firstName,
    lastName,
    phoneNumber,
    birthDate,
    bankAccountNumber,
    bankName,
    gender
  ) => {
    const guide: UnApprovedGuide = {
      _type: GuideType.UnApprovedGuide,
      guideId: idGenerator(),
      userName,
      password,
      personalId,
      bankAccountNumber,
      bankName,
      email,
      profile: {
        firstName,
        lastName,
        birthDate,
        phoneNumber,
        gender,
        profileImageUrl: null
      },
      approvalStatus: ApprovalStatus.NotApprove
    };
    return guide;
  };
}

export function approveGuide(): ApproveGuide {
  return (guide: Guide) => {
    const approvedGuide: ApprovedGuide = {
      _type: GuideType.ApprovedGuide,
      guideId: guide.guideId,
      userName: guide.userName,
      password: guide.password,
      personalId: guide.personalId,
      bankAccountNumber: guide.bankAccountNumber,
      bankName: guide.bankName,
      email: guide.email,
      profile: guide.profile,
      approvalStatus: ApprovalStatus.Approved,
      availableDate: [],
      dealtTrips: [],
      publishedTours: []
    }
    return approvedGuide;
  }
}

export function markBadGuide(): MarkBadGuide {
  return (guide: Guide) => {
    switch (guide._type) {
      case GuideType.ApprovedGuide: {
        const badGuide: BadGuide = {
          _type: GuideType.BadGuide,
          guideId: guide.guideId,
          userName: guide.userName,
          password: guide.password,
          personalId: guide.personalId,
          bankAccountNumber: guide.bankAccountNumber,
          bankName: guide.bankName,
          email: guide.email,
          profile: guide.profile,
          approvalStatus: guide.approvalStatus,
          availableDate: guide.availableDate,
          dealtTrips: guide.dealtTrips,
          publishedTours: guide.publishedTours
        }
        return badGuide;
      }
      default: {
        throw new Error('Guide must be approved to be marked bad');
      }
    }
  }
}

export function addPublishedTour(): AddPublishedTour {
  return (guide: Guide, tour: Tour) => {
    switch (guide._type) {
      case GuideType.ApprovedGuide: {
        const { publishedTours } = guide;
        const addedPublishedTours = [...publishedTours, tour];
        return {
          ...guide,
          publishedTours: addedPublishedTours
        };
      }
      default: {
        throw new Error('Guide must be approved to publish tour');
      }
    }
  };
}

export function editPublishedTour(): EditPublishedTour {
  return (guide, toBeTour) => {
    switch (guide._type) {
      case GuideType.ApprovedGuide: {
        const { publishedTours } = guide;
        const publishedTourList = List(publishedTours);
        const updateIdx = publishedTourList.findIndex(
          t => t.tourId === toBeTour.tourId
        );
        if (updateIdx != -1) {
          const updatedList = publishedTourList.set(updateIdx, toBeTour);
          return {
            ...guide,
            publishedTours: updatedList.toArray()
          };
        }
        return guide;
      }
      default: {
        throw new Error('Guide must be approved to update published tour');
      }
    }
  };
}

export function editGuide(): EditGuide {
  return (guide, profile) => {
    return {
      ...guide,
      profile
    };
  };
}
