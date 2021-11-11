import { Response } from "express";
import Request from "../types/Request";
import { dataArray, responseFunction } from "../response_builder/responsefunction";
import responsecode from "../response_builder/responsecode";
require('dotenv').config();
const stripe = require("stripe")(process.env.STRIPE_API_KEY);

const stripeController = {
    payment: async function payment(req: Request, res: Response) {
            stripe.customers.create({
                email: req.body.stripeEmail,
                source: req.body.stripeToken,
                name: 'Gourav Hammad',
                address: {
                    line1: 'TC 9/4 Old MES colony',
                    postal_code: '452331',
                    city: 'Indore',
                    state: 'Madhya Pradesh',
                    country: 'India',
                }
            })
            .then((customer: any) => {
          
                return stripe.charges.create({
                    amount: 2500,     // Charing Rs 25
                    description: 'New Creation Shoes',
                    currency: 'INR',
                    customer: customer.id
                });
            })
            .then((charge: any) => {
                let meta: object = { message: "Success", status: "Success" };
                responseFunction(meta, charge, responsecode.Success, res);
            })
            .catch((err: any) => {
                console.log(err);    
                let meta: object = { message: "Server error", status: "Failed" };
                responseFunction(meta, dataArray, responsecode.Internal_Server_Error, res);
            });
        }
}

export default stripeController;