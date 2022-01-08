import { BankAccount } from "../models/bank-account";
import { BrandMark, CreditCard } from "../models/credit-card";

export const CREDIT_CARDS : CreditCard[] = 
[
    {
        owner : "Giuseppe Rossi",
        number : "6703444444444449",
        pin : "12345",
        expiration : 
        {
            month : 2,
            year : 2020
        },
        cvv : "231",
        brandMark : BrandMark.MASTERCARD
    },
    {
        owner : "Giuseppe Rossi",
        number : "6703444444444450",
        pin : "23456",
        expiration : 
        {
            month : 12,
            year : 2021
        },
        cvv : "124",
        brandMark : BrandMark.MASTERCARD
    },
    {
        owner : "Giuseppe Rossi",
        number : "6703444444444451",
        pin : "34567",
        expiration : 
        {
            month : 9,
            year : 2021
        },
        cvv : "998",
        brandMark : BrandMark.VISA
    }
];

export const BANK_ACCOUNTS : BankAccount[] = 
[
    {
        id : 1,
        owner : "Giuseppe Rossi",
        amount : 100.0
    },
    {
        id : 2,
        owner : "Giuseppe Rossi",
        amount : 1000.0
    },
];

export const CREDIT_CARDS_HAS_BANK_ACCOUNT : Map<string, number> = new Map();

CREDIT_CARDS_HAS_BANK_ACCOUNT.set("6703444444444449", 1);
CREDIT_CARDS_HAS_BANK_ACCOUNT.set("6703444444444450", 1);
CREDIT_CARDS_HAS_BANK_ACCOUNT.set("6703444444444451", 2);