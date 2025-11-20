export const typeDefs = /* GraphQL */ `
    type Query {
        rekoOffer(process_type: String!): RekoOffer
    }

    type RekoOffer {
        offers: [Offer!]!
    }

    type Offer {
        offerCode: String!
        offerName: String!
        duration: Int!
        status: OfferStatus!
        model: OfferModel!
        documents: [OfferDocument!]!
        items: [OfferItem!]!
        exclusions: [ProductExclusion!]!
        requirements: [ProductRequirement!]!
        configuration: Configuration
        gifts: [Gift!]!
        availablePaymentMethods: [PaymentMethod!]!
    }

    enum OfferStatus {
        NEW
        ACTIVE
        INACTIVE
        EXPIRED
    }

    enum OfferModel {
        DTH
        IPTV
        OTT
    }

    type OfferDocument {
        docUrl: String!
        docName: String!
        docPromoName: String
        priority: String!
    }

    type OfferItem {
        itemId: String!
        itemType: ItemType!
        itemCode: String!
        techItems: [TechItem!]!
        productCodes: [String!]!
        productCode: String!
        paymentSchedule: [PaymentScheduleEntry!]!
        activationFee: Int!
        status: ItemStatus!
        visibility: ItemVisibility!
        flags: [ItemFlag!]!
        documents: [ItemDocument!]!
        ptfs: [Ptf!]!
    }

    enum ItemType {
        MAINPRODUCT
        ADDON
        ACCESSORY
        SERVICE
    }

    enum ItemStatus {
        MANDATORY
        OPTIONAL
        DISABLED
    }

    enum ItemVisibility {
        DEFAULT
        HIDDEN
        VISIBLE
    }

    type TechItem {
        rfs: String!
        rfsItemCode: String!
        offerCode: String!
        rfsItemId: String!
    }

    type PaymentScheduleEntry {
        num: Int!
        fee: Float!
        price: Float!
        discount: Float!
        presentationDiscount: Float!
    }

    type ItemFlag {
        key: String!
        value: String!
    }

    type ItemDocument {
        docUrl: String!
        docName: String!
        priority: Int!
    }

    type Ptf {
        article: String!
        articlecpt: String!
        price: Float!
        discount: Float!
    }

    type ProductExclusion {
        productCode: String!
        productCodeExcluded: String!
    }

    type ProductRequirement {
        productCode: String!
        productCodeRequired: String!
    }

    type Configuration {
        additionalProp1: String
        additionalProp2: String
        additionalProp3: String
    }

    type Gift {
        id: String!
        group: String!
    }

    type PaymentMethod {
        paymentMethodCode: String!
        paymentMethodLabel: String!
    }
`