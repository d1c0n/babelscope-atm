export interface CreditCard
{
    owner : string;
    number : string;
    expiration : ShortDate;
    cvv : string;
    pin : string;
    brandMark : BrandMark;
}

export interface ShortDate
{
    month : number;
    year : number;
}

export enum BrandMark
{
    MASTERCARD,
    VISA
}