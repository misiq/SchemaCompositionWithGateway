import DataLoader from 'dataloader';
import { BaseDataSource } from './base.datasource';
import { logger } from '../utils/logger';

interface OfferDocument {
    docUrl: string;
    docName: string;
    docPromoName?: string;
    priority: string;
}

interface TechItem {
    rfs: string;
    rfsItemCode: string;
    offerCode: string;
    rfsItemId: string;
}

interface PaymentScheduleEntry {
    num: number;
    fee: number;
    price: number;
    discount: number;
    presentationDiscount: number;
}

interface ItemFlag {
    key: string;
    value: string;
}

interface ItemDocument {
    docUrl: string;
    docName: string;
    priority: number;
}

interface Ptf {
    article: string;
    articlecpt: string;
    price: number;
    discount: number;
}

interface OfferItem {
    itemId: string;
    itemType: string;
    itemCode: string;
    techItems: TechItem[];
    productCodes: string[];
    productCode: string;
    paymentSchedule: PaymentScheduleEntry[];
    activationFee: number;
    status: string;
    visibility: string;
    flags: ItemFlag[];
    documents: ItemDocument[];
    ptfs: Ptf[];
}

interface ProductExclusion {
    productCode: string;
    productCodeExcluded: string;
}

interface ProductRequirement {
    productCode: string;
    productCodeRequired: string;
}

interface Configuration {
    additionalProp1?: string;
    additionalProp2?: string;
    additionalProp3?: string;
}

interface Gift {
    id: string;
    group: string;
}

interface PaymentMethod {
    paymentMethodCode: string;
    paymentMethodLabel: string;
}

interface Offer {
    offerCode: string;
    offerName: string;
    duration: number;
    status: string;
    model: string;
    documents: OfferDocument[];
    items: OfferItem[];
    exclusions: ProductExclusion[];
    requirements: ProductRequirement[];
    configuration?: Configuration;
    gifts: Gift[];
    availablePaymentMethods: PaymentMethod[];
}

export interface RekoOffer {
    offers: Offer[];
}

export class BFFDataSource extends BaseDataSource {
    private rekoOfferLoader: DataLoader<string, RekoOffer>;
    
    constructor(baseUrl?: string, authToken?: string) {
        super(baseUrl, authToken);
        this.rekoOfferLoader = new DataLoader(async (process_types: readonly string[]) => {
            const promises = process_types.map(process_type => this.fetchRekoOffer(process_type));
            return Promise.all(promises);
        });
    }

    async getRekoOffer(process_type: string): Promise<RekoOffer> {
        return this.rekoOfferLoader.load(process_type);
    }

    private async fetchRekoOffer(process_type: string): Promise<RekoOffer> {
        const response = await this.get<any>(`/v1/getRekoOffer?process_type=${process_type}`);
        
        // Ensure the response has the expected structure
        if (!response || typeof response !== 'object') {
            logger.warn({ process_type, response }, 'Invalid response from getRekoOffer');
            return { offers: [] };
        }

        // Map propositionCfs to offers
        // The API returns offers in 'propositionCfs' key
        const offers = response.propositionCfs || [];
        
        if (!Array.isArray(offers)) {
            logger.warn({ process_type, response }, 'propositionCfs is not an array');
            return { offers: [] };
        }
        
        return { offers };
    }
}
