import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { BANK_ACCOUNTS, CREDIT_CARDS, CREDIT_CARDS_HAS_BANK_ACCOUNT } from "../data/database";
import { BankAccount } from "../models/bank-account";
import { CreditCard } from "../models/credit-card";
import { LocalService } from "./local.service";

export default class ATMService extends LocalService
{
    private static instance : ATMService;

	public static getInstance() : ATMService
	{
		if (this.instance == undefined)
		{
			this.instance = new ATMService();
		}

		return this.instance;
	}

	private constructor() 
    { 
        super();
    }

    /**
     * ritorna la carta di credito associata al number passato come argomento
     * @param number 
     */
    public getCreditCard(number : string) : Observable<CreditCard>
    {
        return this.of(CREDIT_CARDS.filter(cc => cc.number === number)[0]);
    }

    /**
     * ritorna la lista delle carte di credito/bancomat disponibili
     * @returns 
     */
    public getCreditCardList() : Observable<CreditCard[]>
    {
        return this.of(CREDIT_CARDS);
    }

    /**
     * ritorna la carta di credito associata al number passato come argomento
     * @param number 
     */
    public getBankAccount(id : number) : Observable<BankAccount>
    {
        return this.of(BANK_ACCOUNTS.filter(ba => ba.id === id)[0]);
    }

    /**
     * ritorna true, se la data di scadenza della carta di credito è antecente al giorno corrente; 
     * false, in caso contrario
     * @param CreditCard 
     */
    public isExpired(creditCard : CreditCard) : Observable<boolean>
    {
        let isExp : boolean = true;
        const today : Date = new Date();

        if (creditCard)
        {
            if (creditCard.expiration.year > today.getFullYear())
            {
                isExp = false;
            }
            else if (creditCard.expiration.year === today.getFullYear())
            {
                if (creditCard.expiration.month > today.getMonth())
                {
                    isExp = false;
                }
            }
        }

        return this.of(isExp);
    }

    /**
     * ritorna il credito residuo nel conto associato alla carta di credito fornita
     * @param number 
     * @returns 
     */
    public getCredit(number : string) : Observable<number>
    {
        const bankAccountID : number = CREDIT_CARDS_HAS_BANK_ACCOUNT.has(number) 
            ? CREDIT_CARDS_HAS_BANK_ACCOUNT.get(number)
            : undefined;

        return this.getBankAccount(bankAccountID)
            .pipe(
                map(bankAccount => bankAccount?.amount)
            );
    }

    /**
     * controlla se il pin passato come argomento è valido per la carta di credito
     * @param number 
     * @param pin 
     */
    public checkPIN(number : string, pin : string) : Observable<boolean>
    {
        return this.getCreditCard(number)
            .pipe(
                map(
                    cc => 
                    {
                        return cc ? cc.pin === pin : false;
                    }));
    }

    /**
     * ritorna true se il saldo è maggiore uguale della cifra richiesta e quindi il prelievo è andato a buon fine
     * false altrimenti
     * @param bankAccountID 
     * @param amount 
     * @returns 
     */
    public withdraw(bankAccountID : number, amount : number) : Observable<boolean>
    {
        return this.getBankAccount(bankAccountID)
            .pipe(
                map(
                    ba =>
                    {
                        if (amount > 0 && ba?.amount >= amount)
                        {
                            ba.amount = ba.amount - amount;

                            return true;
                        }

                        return false;
                    }));
    }

    /**
     * ritorna true se il versamento è andato a buon fine
     * false altrimenti
     * @param bankAccountID 
     * @param amount 
     * @returns 
     */
    public deposit(bankAccountID : number, amount : number) : Observable<boolean>
    {
        return this.getBankAccount(bankAccountID)
            .pipe(
                map(
                    ba =>
                    {
                        if (amount > 0)
                        {
                            ba.amount = ba.amount + amount;

                            return true;
                        }

                        return false;
                    }));
    }
}