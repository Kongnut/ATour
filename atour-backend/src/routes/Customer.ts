import * as express from 'express';
import { Db } from 'mongodb';
import { 
    saveCustomer,
    checkCustomerUsernameDuplicate,
    editCustomerProfile,
    login
} from '../repository/Customer';
import {
    registerCustomerService,
    loginService,
    editCustomerProfileService
} from '../service/CustomerService';

const router = express.Router();

router.get('/', (req,res) => {
    res.send('Hello Customer');
});

router.post('/register', async (req,res) => {
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
    await registerCustomerService(
        checkCustomerUsernameDuplicate(userName, db),
        saveCustomer(db))(
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
        res.send('Customer register');
});

router.post('/login', async (req,res) => {
    const db: Db = res.locals.db;
    const {
        userName,
        password
    } = req.body;
    const customer = await loginService(
        login(db))(
            userName,
            password
        );
    res.send(customer);


})

router.post('/editProfile', async (req,res) => {
    const db: Db = res.locals.db;
    const {
        customerId,
        firstName,
        lastName,
        phoneNumber,
        birthDate,
        gender
    } = req.body;
    await editCustomerProfileService(
        editCustomerProfile(db))(
            customerId,
            firstName,
            lastName,
            phoneNumber,
            birthDate,
            gender
        );
        res.send('Customer register');
});

export default router;