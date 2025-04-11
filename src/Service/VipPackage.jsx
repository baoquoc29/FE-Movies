import {baseService} from "./BaseService";

export class VipPackage extends baseService {
    // eslint-disable-next-line no-useless-constructor
    constructor() {
        super()
    };
    getVipPackages = () => {
        return this.get('api/v1/vip-packages',false)
    }

}
export const vipPackage = new VipPackage ();