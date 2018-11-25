import { GetCustomerDb, UpdateCustomerDb } from '../repository/Customer';

import {
  GetTourDb,
  UpdateTourDb,
  UpdateTripDb,
  GetTripDb,
  SaveReviewDb,
  UpdateReviewDb,
  GetReviewDb,
  DeleteReviewDb
} from '../repository/Tour';

import { Trip, Review, TripType, Tour, FinishedTrip } from '../domain/types';

import {
  bookTrip,
  updateTripToTour,
  updateCustomerTripHistory,
  uploadPayment,
  createReview,
  addReviewToTour,
  editReview,
  removeReviewFromTour,
  addTripToCustomer,
  refundTrip,
  cancelTrip,
  freeTrip
} from '../domain/CustomerTour';
import { IdGenerator, DateGenerator } from 'domain/Tour';

export type BookTripService = (
  tripId: string,
  tripDate: Date,
  customerId: string,
  size: number,
  price: number
) => Promise<Trip>;

export type UploadPaymentService = (
  tourId: string,
  tripId: string,
  customerId: string,
  slipImage: string
) => Promise<Trip>;

export type AddReviewService = (
  tourId: string,
  tripId: string,
  customerId: string,
  comment: string
) => Promise<Review>;

export type EditReviewService = (
  tourId: string,
  customerId: string,
  reviewId: string,
  comment: string
) => Promise<Review>;

export type RemoveReviewService = (
  tourId: string,
  customerId: string,
  reviewId: string
) => Promise<Review>;

export type SeeBookHistoryService = (customerId: string) => Promise<Trip[]>;

export type RefundTripService = (
  tourId: string,
  tripId: string,
  customerId: string
) => Promise<Trip>;

export type CancelTripService = (
  tourId: string,
  tripId: string,
  customerId: string
) => Promise<Trip>;

export type GetTourService = (tourId: string) => Promise<Tour>;

export type FinishedTripService = (tripId: string) => Promise<Trip>;

export function setFinishedTrip(
  updateCustomerDb:UpdateCustomerDb,
  updateTourDb: UpdateTourDb,
  updateTripDb: UpdateTripDb,
  getTripDb: GetTripDb,
  getCustomerDb: GetCustomerDb,
  getTourDb: GetTourDb
):FinishedTripService {
  return async tripId => {
    const trip = await getTripDb(tripId);
    const finishDate = trip.tripDate;
    const _type = TripType.FinishedTrip;
    if (trip._type === TripType.ApprovedTrip && new Date().getTime() - new Date(trip.tripDate).getTime() >= 0 ){
      const acustomer = await getCustomerDb(trip.bookInfo.customerId)
      const updatetrip: FinishedTrip = {...trip, _type, finishDate}
      const customer = await updateCustomerTripHistory()(acustomer, updatetrip);
      await updateCustomerDb(customer);
      const tour = await getTourDb(trip.tourId);
      await updateTripToTour()(tour, updatetrip);
      await updateTripDb(updatetrip)
      return updatetrip;
    }
      return trip;
    
  }
}

export function getTourService(getTourDb: GetTourDb): GetTourService {
  return async tourId => {
    return await getTourDb(tourId);
  };
}

export function bookTripService(
  getCustomerDb: GetCustomerDb,
  getTourDb: GetTourDb,
  getTripDb: GetTripDb,
  updateTourDb: UpdateTourDb,
  updateTripDb: UpdateTripDb,
  updateCustomerDb: UpdateCustomerDb,
  dateGenerator: DateGenerator
): BookTripService {
  return async (tripId, tripDate, customerId, size, price) => {
    const trip = await getTripDb(tripId);
    const tour = await getTourDb(trip.tourId);
    const customer = await getCustomerDb(customerId);
    switch (trip._type) {
      case TripType.UnbookedTrip: {
        const bookedTrip = bookTrip()(
          trip,
          customerId,
          size,
          price,
          dateGenerator()
        );
        const updatedTour = updateTripToTour()(tour, bookedTrip);
        const updatedCustomer = addTripToCustomer()(customer, bookedTrip);
        await updateCustomerDb(updatedCustomer);
        await updateTourDb(updatedTour);
        await updateTripDb(bookedTrip);
        return bookedTrip;
      }
      default: {
        throw new Error('Trip is already booked');
      }
    }
  };
}

export function uploadPaymentService(
  getCustomerDb: GetCustomerDb,
  getTourDb: GetTourDb,
  getTripDb: GetTripDb,
  updateTourDb: UpdateTourDb,
  updateTripDb: UpdateTripDb,
  updateCustomerDb: UpdateCustomerDb,
  dateGenerator: DateGenerator
): UploadPaymentService {
  return async (tourId, tripId, customerId, slipUrl) => {
    const tour = await getTourDb(tourId);
    const customer = await getCustomerDb(customerId);
    const trip = await getTripDb(tripId);
    if (trip._type === TripType.BookedTrip || trip._type === TripType.PaidTrip || trip._type === TripType.RejectedPaidTrip ){
      const paidTrip = uploadPayment()(
        trip,
        { url: slipUrl },
        dateGenerator()
      );

      const updatedTour = updateTripToTour()(tour, paidTrip);

      const updatedCustomer = updateCustomerTripHistory()(customer, paidTrip);

      await updateCustomerDb(updatedCustomer);
      await updateTourDb(updatedTour);
      await updateTripDb(paidTrip);
      return paidTrip;
    }else{
      throw new Error('Trip is not booked, paid or payment rejected');
    }
    
  };
}

export function addReviewService(
  getTourDb: GetTourDb,
  getTripDb: GetTripDb,
  updateTourDb: UpdateTourDb,
  saveReviewDb: SaveReviewDb,
  idGenerator: IdGenerator,
  dateGenerator: DateGenerator
): AddReviewService {
  return async (tourId, tripId, customerId, comment) => {
    const tour = await getTourDb(tourId);
    const trip = await getTripDb(tripId);
    switch (trip._type) {
      case TripType.FinishedTrip: {
        const review = createReview(idGenerator)(
          trip,
          customerId,
          comment,
          dateGenerator()
        );

        const updatedTour = addReviewToTour()(tour, review);
        await saveReviewDb(review);
        await updateTourDb(updatedTour);
        return review;
      }
      default: {
        throw new Error('Your trip is not finished');
      }
    }
  };
}

export function editReviewSrevice(
  getTourDb: GetTourDb,
  getReviewDb: GetReviewDb,
  updateTourDb: UpdateTourDb,
  updateReviewDb: UpdateReviewDb,
  dateGenerator: DateGenerator
): EditReviewService {
  return async (tourId, customerId, reviewId, comment) => {
    const tour = await getTourDb(tourId);
    const review = await getReviewDb(reviewId);

    if (review.authorId.localeCompare(customerId) == 0) {
      const updatedReview = editReview()(review, comment, dateGenerator());

      const updatedTour = addReviewToTour()(tour, review);
      await updateReviewDb(review);
      await updateTourDb(updatedTour);
      return updatedReview;
    } else {
      throw new Error('This is not your review');
    }
  };
}

export function removeReviewSrevice(
  getTourDb: GetTourDb,
  getReviewDb: GetReviewDb,
  updateTourDb: UpdateTourDb,
  deleteReviewDb: DeleteReviewDb
): RemoveReviewService {
  return async (tourId, customerId, reviewId) => {
    const tour = await getTourDb(tourId);
    const review = await getReviewDb(reviewId);

    switch (review.authorId) {
      case customerId: {
        const updatedTour = removeReviewFromTour()(tour, review);

        await deleteReviewDb(review);
        await updateTourDb(updatedTour);
        return review;
      }
      default: {
        throw new Error('This is not your review');
      }
    }
  };
}

export function seeBookHistoryService(
  getCustomerDb: GetCustomerDb
): SeeBookHistoryService {
  return async customerId => {
    const customer = await getCustomerDb(customerId);
    return customer.tripHistory;
  };
}

export function refundTripService(
  getCustomerDb: GetCustomerDb,
  getTourDb: GetTourDb,
  getTripDb: GetTripDb,
  updateTourDb: UpdateTourDb,
  updateTripDb: UpdateTripDb,
  updateCustomerDb: UpdateCustomerDb,
  dateGenerator: DateGenerator
): RefundTripService {
  return async (tourId, tripId, customerId) => {
    const tour = await getTourDb(tourId);
    const customer = await getCustomerDb(customerId);
    const trip = await getTripDb(tripId);
    switch (trip._type) {
      case TripType.ApprovedTrip: {
        const refundRequestedTrip = refundTrip()(trip, dateGenerator());
        const updatedTour = updateTripToTour()(tour, refundRequestedTrip);
        const updatedCustomer = updateCustomerTripHistory()(
          customer,
          refundRequestedTrip
        );
        await updateCustomerDb(updatedCustomer);
        await updateTourDb(updatedTour);
        await updateTripDb(refundRequestedTrip);
        return refundRequestedTrip;
      }
      default: {
        throw new Error('Your Payment has not been approve');
      }
    }
  };
}

export function cancelTripService(
  getCustomerDb: GetCustomerDb,
  getTourDb: GetTourDb,
  getTripDb: GetTripDb,
  updateTourDb: UpdateTourDb,
  updateTripDb: UpdateTripDb,
  updateCustomerDb: UpdateCustomerDb,
  dateGenerator: DateGenerator
): CancelTripService {
  return async (tourId, tripId, customerId) => {
    const tour = await getTourDb(tourId);
    const customer = await getCustomerDb(customerId);
    const trip = await getTripDb(tripId);
    if (trip._type === TripType.PaidTrip || trip._type === TripType.BookedTrip){
      const cancelledTrip = cancelTrip()(trip, dateGenerator());

      const unbookedTrip = freeTrip()(cancelledTrip);

      const updatedTour = updateTripToTour()(tour, unbookedTrip);
      const updatedCustomer = updateCustomerTripHistory()(customer, cancelledTrip);
      await updateCustomerDb(updatedCustomer);
      await updateTourDb(updatedTour);
      await updateTripDb(unbookedTrip);
      return cancelledTrip;
    }
    else{
      throw new Error('Your step is not 1 or 2');
    }
  };
}
