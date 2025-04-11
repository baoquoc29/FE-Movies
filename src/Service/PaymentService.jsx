import {baseService} from "./BaseService";

export class PaymentService extends baseService {
    // eslint-disable-next-line no-useless-constructor
    constructor() {
        super()
    };
    createUrlPay = (amount,orderInfo) => {
        const params = new URLSearchParams({
            amount: amount.toString(),
            orderInfo: orderInfo,
        }).toString();
        return this.post('api/v1/payments/create',params)
    }
    deposit = (username,amount) => {
        const params = new URLSearchParams({
            username: username,
            amount: amount,
        }).toString();
       return  this.post('api/v1/payments',params)
    }
    buyVip = (username,duration) => {
        const params = new URLSearchParams({
            username: username,
            duration: duration,
        }).toString();
        return  this.post('api/v1/payments/buy-vip',params)
    }

}
export const paymentService = new PaymentService ();