import ATMService from "../../src/services/atm.service";
import { CREDIT_CARDS_HAS_BANK_ACCOUNT } from "../../src/data/database";
import { Alert } from "../../src/components/alert/alert";
import { Button } from "../components/button/button";
import { cardNumber} from "../../main";

/**
 * Oggetto che si occupa della creazione della pagina di deposito 
 * e della gestione delle funzioni di accesso alla pagina e di deposito sul conto
 */
export class DepositHandler
{
    private static instance : DepositHandler;

    private backButton : Button;
    private confirmDepositButton : Button;


    private constructor() {}

    public static getInstance() : DepositHandler
    {
        if (this.instance == undefined)
            this.instance = new DepositHandler();
        return this.instance;
    }

    /**
     * Accede alla pagina di deposito dal menu principale
     */
    public goToPage() : void
    {
        $(".menu-container").fadeOut(400, () => $(".deposit-container").fadeIn());
    }

    /**
     * Deposita sulla carta salvata l'importo inserito dall'utente
     */
    public deposit()
    {
        let bankAccountID = CREDIT_CARDS_HAS_BANK_ACCOUNT.get(cardNumber);

        // prende la quantita' da depositare dall'input field
        let depositAmount = (<HTMLInputElement>document.getElementById("deposit-amount")).value;

        this.confirmDepositButton.disable();

        ATMService.getInstance()
                    .deposit(bankAccountID,Number(depositAmount))
                    .subscribe(
                        (esito) => 
                        {
                            let alert : JQuery = $("<div />")
                                                        .appendTo(".container")

                            var outcomeNotification : Alert;

                            if (esito)
                                outcomeNotification = new Alert(alert, "success", "Sucesso", "Il deposito e' andato a buon fine");
                            else
                                outcomeNotification = new Alert(alert, "danger", "Errore", "nel deposito");                  
                            outcomeNotification.animateInOut(1500);

                            this.confirmDepositButton.enable(() => DepositHandler.getInstance().deposit())

                            //ritorna al menu principale dopo ogni deposito
                            $(".deposit-container").fadeOut(400, () => $(".menu-container").fadeIn())
                        }
                    );
        //azzera il campo di input dopo ogni deposito
        $(' :input').val('');
    }

    /**
     * Finisce di costruire la pagina di deposito con bottoni e funzioni annesse 
     */
    public buildPage()
    {           
        var jDepositButton : JQuery = $("<div />")
                .appendTo(".menu-container")
                .on("click", () => DepositHandler.getInstance().goToPage());

        var depositButton : Button = new Button(jDepositButton, "Deposita");

        var jBackdepositButton : JQuery = $("<div />")
                .appendTo(".deposit-container")
                .addClass("back")
                .on("click", () => $(".deposit-container").fadeOut(400, () => $(".menu-container").fadeIn()));

        this.backButton = new Button(jBackdepositButton, "Indietro"); 

        //deposit button
        var jConfirmDepositButton : JQuery = $("<div />")
                            .appendTo(".deposit-container")
                            .addClass("deposit-button")
                            .on("click", () => DepositHandler.getInstance().deposit());

        this.confirmDepositButton = new Button(jConfirmDepositButton, "Deposita"); 
    }
}