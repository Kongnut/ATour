import * as express from 'express';
import { Db } from 'mongodb';

import { 
    saveCustomer,
    checkCustomerUsernameDuplicate,
    editCustomerProfile,
    login,
    saveCustomerToken,
    getCustomerToken,
    getCustomer,
    updateCustomer,
    getCustomerProfile

} from '../repository/Customer';

import {
    getTour,
    updateTour,
    updateTrip,
    getTrip,
    saveReview,
    getReview,
    updateReview,
    deleteReview
} from '../repository/Tour';
import {
  registerCustomerService,
  loginService,
  editCustomerProfileService,
  getCustomerProfileService
} from '../service/CustomerService';
import {
  searchTourService,
  searchGuideService
} from '../service/CustomerSearchService';
import { searchTour, searchGuide } from '../repository/CustomerSearch';

import * as uuid from 'uuid/v4';
import { bookTripService, uploadPaymentService, addReviewService, editReviewSrevice, removeReviewSrevice, seeBookHistoryService, refundTripService, cancelTripService } from '../service/CustomerTourService';
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello Customer');
});

router.post('/register', async (req, res) => {
  try {
    const db: Db = res.locals.db;
    const {
      userName,
      password,
      email,
      firstName,
      lastName,
      personalId,
      phoneNumber,
      birthDate,
      gender
    } = req.body;
    const customer = await registerCustomerService(
      checkCustomerUsernameDuplicate(userName, db),
      saveCustomer(db),
      saveCustomerToken(db),
      () => uuid()
    )(
      userName,
      password,
      email,
      firstName,
      lastName,
      personalId,
      phoneNumber,
      birthDate,
      gender
    );
    res.json(customer);
  } catch (e) {
    console.log(e.message);
    res.json({ customer: null, error: e.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const db: Db = res.locals.db;
    const { userName, password } = req.body;
    const token = await loginService(login(db), getCustomerToken(db))(
      userName,
      password
    );
    res.json(token);
  } catch (error) {
    console.log(error.message);
    res.json({ token: null, error: error.message });
  }
});

router.post('/editProfile', async (req, res) => {
  try {
    const db: Db = res.locals.db;
    const {
          customerId,
          email,
          phoneNumber,
          profileImageUrl
    } = req.body;
    const customer = await editCustomerProfileService(editCustomerProfile(db))(
        customerId,
        email,
        phoneNumber,
        profileImageUrl
    );
    res.json(customer);
  } catch (error) {
    console.log(error.message);
    res.json({ customer: null, error: error.message });
  }
});

router.post('/getProfile', async (req, res) => {
  try {
    const db: Db = res.locals.db;
    const { userName } = req.body;
    const customer = await getCustomerProfileService(getCustomerProfile(db))(
      userName
    );
    res.json(customer);
  } catch (error) {
    console.log(error.message);
    res.json({ customer: null, error: error.message });
  }
});

router.get('/searchTours', async (req, res) => {
  const db: Db = res.locals.db;
  const cursor = await db.collection('tour').find();
  const tours = await cursor.toArray();
  res.json(tours);
});

router.post('/searchTour', async (req, res) => {
  try {
    const db: Db = res.locals.db;
    const { keyword } = req.body;
    const results = await searchTourService(searchTour(db))(keyword);
    res.json(results);
  } catch (error) {
    console.log(error.message);
    res.json({ results: null, error: error.message });
  }
});

router.post('/searchGuide', async (req, res) => {
  try {
    const db: Db = res.locals.db;
    const { keyword } = req.body;
    const results = await searchGuideService(searchGuide(db))(keyword);
    res.json(results);
  } catch (error) {
    console.log(error.message);
    res.json({ results: null, error: error.message });
  }
});

router.post('/bookTrip', async (req,res) => {
    try{
        const db:Db = res.locals.db;
        const {
            tourId,
            tripId,
            tripDate,
            customerId,
            size,
            price
        } = req.body;
        const trip = await bookTripService(
            getCustomer(db),
            getTour(db),
            getTrip(db),
            updateTour(db),
            updateTrip(db),
            updateCustomer(db),
            () => new Date()
        )(
            tourId,
            tripId,
            tripDate,
            customerId,
            size,
            price
        );
        res.json(trip);
    }catch (error) {
        console.log(error.message);
        res.json({ trip: null, error: error.message })
    }
})

router.post('/uploadPayment', async (req, res) => {
  try {
    const db: Db = res.locals.db;
    const {
      tourId,
      tripId,
      customerId,
      slipUrl
    } = req.body;
    const trip = await uploadPaymentService(
      getCustomer(db),
      getTour(db),
      getTrip(db),
      updateTour(db),
      updateTrip(db),
      updateCustomer(db),
      () => new Date()
    )(
      tourId,
      tripId,
      customerId,
      slipUrl
    );
    res.json(trip);
  } catch (error) {
    console.log(error.message);
    res.json({ trip: null, error: error.message })
  }
})

router.post('/addReview', async (req, res) => {
  try {
    const db: Db = res.locals.db;
    const {
      tourId,
      tripId,
      customerId,
      comment
    } = req.body;
    const review = await addReviewService(
      getTour(db),
      getTrip(db),
      updateTour(db),
      saveReview(db),
      () => uuid(),
      () => new Date()
      )(
      tourId,
      tripId,
      customerId,
      comment
    );
    res.json(review);
  } catch (error) {
    console.log(error.message);
    res.json({ review: null, error: error.message })
  }
})

router.post('/editReview', async (req, res) => {
  try {
    const db: Db = res.locals.db;
    const {
      tourId,
      customerId,
      reviewId,
      comment
    } = req.body;
    const review = await editReviewSrevice(
      getTour(db),
      getReview(db),
      updateTour(db),
      updateReview(db),
      () => new Date()
    )(
      tourId,
      customerId,
      reviewId,
      comment
    );
    res.json(review);
  } catch (error) {
    console.log(error.message);
    res.json({ review: null, error: error.message })
  }
})

router.post('/removeReview', async (req, res) => {
  try {
    const db: Db = res.locals.db;
    const {
      tourId,
      customerId,
      reviewId,
    } = req.body;
    const review = await removeReviewSrevice(
      getTour(db),
      getReview(db),
      updateTour(db),
      deleteReview(db),
    )(
      tourId,
      customerId,
      reviewId,
    );
    res.json(review);
  } catch (error) {
    console.log(error.message);
    res.json({ review: null, error: error.message })
  }
})

router.post('/seeBookHistory', async (req, res) => {
  try {
    const db: Db = res.locals.db;
    const {
      customerId
    } = req.body;
    const trips = await seeBookHistoryService(
      getCustomer(db)
    )(
      customerId
    );
    res.json(trips);
  } catch (error) {
    console.log(error.message);
    res.json({ trips: null, error: error.message })
  }
})

router.post('/refundTrip', async (req, res) => {
  try {
    const db: Db = res.locals.db;
    const {
      tourId,
      tripId,
      customerId,
    } = req.body;
    const trip = await refundTripService(
      getCustomer(db),
      getTour(db),
      getTrip(db),
      updateTour(db),
      updateTrip(db),
      updateCustomer(db),
      () => new Date()
    )(
      tourId,
      tripId,
      customerId,
    );
    res.json(trip);
  } catch (error) {
    console.log(error.message);
    res.json({ trip: null, error: error.message })
  }
})

router.post('/cancelTrip', async (req, res) => {
  try {
    const db: Db = res.locals.db;
    const {
      tourId,
      tripId,
      customerId,
    } = req.body;
    const trip = await cancelTripService(
      getCustomer(db),
      getTour(db),
      getTrip(db),
      updateTour(db),
      updateTrip(db),
      updateCustomer(db),
      () => new Date()
    )(
      tourId,
      tripId,
      customerId,
    );
    res.json(trip);
  } catch (error) {
    console.log(error.message);
    res.json({ trip: null, error: error.message })
  }
})

export default router;
