import ATMService from "../../src/services/atm.service";
import { CREDIT_CARDS_HAS_BANK_ACCOUNT } from "../../src/data/database";
import { Alert } from "../../src/components/alert/alert";
import { Button } from "../components/button/button";
import { cardNumber} from "../../main";

/**
 * Oggetto che si occupa della creazione della pagina di prelievo 
 * e della gestione delle funzioni di accesso alla pagina e di prelievo dal conto
 */
export class WithdrawHandler
{
    private static instance : WithdrawHandler;

    private backButton : Button;
    private confirmWithdrawButton : Button;


    private constructor() {}

    public static getInstance() : WithdrawHandler
    {
        if (this.instance == undefined)
            this.instance = new WithdrawHandler();
        return this.instance;
    }

    /**
     * Accede alla pagina di prelievo dal menu principale
     */
    public goToPage() : void
    {
        $(".menu-container").fadeOut(400, () => $(".withdraw-container").fadeIn());
    }

    /**
     * Preleva dalla carta salvata l'importo inserito dall'utente
     */
    public withdraw()
    {
        let withdrawAmount = (<HTMLInputElement>document.getElementById("withdraw-amount")).value;
        WithdrawHandler.getInstance().withdrawAmount( Number(withdrawAmount));
    }

    /**
     * Preleva dalla carta salvata l'importo passato come parametro
     * @param withdrawAmount 
     */
    public withdrawAmount(withdrawAmount : number)
    {
        let bankAccountID = CREDIT_CARDS_HAS_BANK_ACCOUNT.get(cardNumber);

        this.confirmWithdrawButton.disable();

        ATMService.getInstance()
                    .withdraw(bankAccountID,Number(withdrawAmount))
                    .subscribe(
                        (esito) => 
                        {
                            let alert : JQuery = $("<div />")
                                                        .appendTo(".container")

                            var outcomeNotification : Alert;

                            if (esito)
                                outcomeNotification = new Alert(alert, "success", "Sucesso", "Il prelievo e' andato a buon fine");
                            else
                                outcomeNotification = new Alert(alert, "danger", "Errore", "Fondi insufficienti");                  
                            outcomeNotification.animateInOut(1500);

                            this.confirmWithdrawButton.enable(() => WithdrawHandler.getInstance().withdraw())
                            $(".withdraw-container").fadeOut(400, () => $(".menu-container").fadeIn())
                        }
                    );
        $(' :input').val('');
    }

     /**
     * Finisce di costruire la pagina di prelievo con bottoni e funzioni annesse 
     */
    public buildPage()
    {           
        var jWithdrawButton : JQuery = $("<div />")
                .appendTo(".menu-container")
                .on("click", () => WithdrawHandler.getInstance().goToPage());

        var withdrawButton : Button = new Button(jWithdrawButton, "Preleva");

        var jBackWithdrawButton : JQuery = $("<div />")
                .appendTo(".withdraw-container")
                .addClass("back")
                .on("click", () => $(".withdraw-container").fadeOut(400, () => $(".menu-container").fadeIn()));

        this.backButton = new Button(jBackWithdrawButton, "Indietro"); 

        //withdraw button
        var jConfirmWithdrawButton : JQuery = $("<div />")
                            .appendTo(".withdraw-container")
                            .addClass("withdraw-button")
                            .on("click", () => WithdrawHandler.getInstance().withdraw());

        this.confirmWithdrawButton = new Button(jConfirmWithdrawButton, "Preleva"); 

        $("#5-euro").on("click", () => WithdrawHandler.getInstance().withdrawAmount(5));
        $("#10-euro").on("click", () => WithdrawHandler.getInstance().withdrawAmount(10));
        $("#20-euro").on("click", () => WithdrawHandler.getInstance().withdrawAmount(20));
        $("#50-euro").on("click", () => WithdrawHandler.getInstance().withdrawAmount(50));
    }
}