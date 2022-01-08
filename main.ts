import ATMService from "./src/services/atm.service";
import { CreditCard } from "./src/models/credit-card";
import { Button } from "./src/components/button/button";
import { Alert } from "./src/components/alert/alert";
import { WithdrawHandler } from "./src/page-handlers/withdraw";
import { DepositHandler } from "./src/page-handlers/deposit";



import "@fortawesome/fontawesome-free/js/fontawesome";
import "@fortawesome/fontawesome-free/js/solid";
import "@fortawesome/fontawesome-free/js/regular";
import "@fortawesome/fontawesome-free/js/brands";

import "./main.scss";

export var cardNumber : string;
var cardPin : string;

/**
 * Gestisce il login controllando la presenza della carta di credito, se e' scaduta
 * e se il pin immesso e' corretto.
 */
const login : () => void =
    () => 
    {   
        // Prende i valori immessi per numero di carta di credito e PIN 
        cardNumber = (<HTMLInputElement>document.getElementById("card-number")).value;
        cardPin = (<HTMLInputElement>document.getElementById("card-pin")).value;

        // Disabilita il bottone di login mentre processa il login
        $(".login-form > .button").text("Caricamento...").attr("data-disable", "true");

        /** Processing del login e riabilita il bottone una volta finito, qualsiasi sia l'esito */
        ATMService.getInstance()
                .getCreditCard(cardNumber)
                .subscribe(
                    (cc) => 
                    {
                        // se esiste la carta di credito inserita
                        if (cc == undefined)
                        {
                            let alert : JQuery = $("<div />")
                                                .appendTo(".container")
                            var errorAlert : Alert = new Alert(alert, "danger", "Errore", "Numero carta non valido");              
                            errorAlert.animateInOut(2000);
                            $(".login-form > .button").text("Login").attr("data-disable", "false");           
                        }
                        else
                        {
                            ATMService.getInstance()
                                    .isExpired(cc)
                                    .subscribe(
                                        (check) =>
                                        {
                                            //se la carta di credito inserita non e' scaduta
                                            if (!check)
                                            {
                                                ATMService.getInstance()
                                                            .checkPIN(cc.number, cardPin)
                                                            .subscribe(
                                                            (check) =>
                                                            {
                                                                // se il PIN e' corretto
                                                                if (check)
                                                                {
                                                                    $(".login-form").fadeOut(400, () => $(".menu-container").fadeIn())
                                                                    $(".login-form > .button").text("Login").attr("data-disable", "false"); 
                                                                } 
                                                                else
                                                                {
                                                                    let alert : JQuery = $("<div />")
                                                                                        .appendTo(".container")
                                                                    var errorAlert : Alert = new Alert(alert, "danger", "Errore", "Pin non corretto");              
                                                                    errorAlert.animateInOut(2000); 
                                                                    $(".login-form > .button").text("Login").attr("data-disable", "false");  
                                                                }
                                                            }
                                                        )
                                                    }
                                            else
                                            {
                                                let alert : JQuery = $("<div />")
                                                                    .appendTo(".container")
                                                var errorAlert : Alert = new Alert(alert, "danger", "Errore", "Carta scaduta");              
                                                errorAlert.animateInOut(2000); 
                                                $(".login-form > .button").text("Login").attr("data-disable", "false"); 
                                            }
                                        }
                                    )
                        }
                    }
                )

        //scuota i campi numero carta e PIN ad ogni login
        $(' :input').val('');
    };

/**
 * Trova e mostra il saldo disponibile per la carta di credito inserita
 */
const checkBalance : () => void =
    () =>
    {
        // Disabilita il bottone per il controllo del saldo e procede nella pagina una volta risolto il saldo
        $(".menu-container > #checkbalance-button").text("Caricamento...").attr("data-disable", "true");
        ATMService.getInstance()
                  .getCredit(cardNumber)
                  .subscribe
                  (
                      (credit) => 
                      {
                        $(".menu-container > #checkbalance-button").text("Saldo").attr("data-disable", "false");

                        $("#balance").text(String(credit)+"€")

                        $(".menu-container").fadeOut(400, () => $(".balance-container").fadeIn());
                      }
                  )
    }

/**
 * Gestisce il logout dell'utente:
 * ritorna al menu di login, notifica la corretta uscita e azzera numero di carta e
 * PIN salvati
 */
const logout : () => void =
    () =>
    {
        $(".menu-container").fadeOut(400, "swing", function()
        {
            $(".login-form").fadeIn()
        });

        let alert : JQuery = $("<div />").appendTo(".container")

        var outcomeNotification : Alert = new Alert(alert, "info", "Logout", "avvenuto con successo");
        outcomeNotification.animateInOut(1500);
        
        cardNumber = '';
        cardPin = '';
    }

/**
 * Aggiunge i componenti interattivi mancanti alle pagine e crea le pagine mancanti
 */
const init : () => void =
    () =>
    {
        //login button
        var button : JQuery = $("<div />")
                                    .appendTo(".login-form")
                                    .on("click", login);

        var loginButton : Button = new Button(button, "Login");


        //menu buttons
        var jBalanceButton : JQuery = $("<div />")
                                    .appendTo(".menu-container")
                                    .attr("id", "checkbalance-button")
                                    .on("click", checkBalance);
        
        var jLogoutButton : JQuery = $("<div />")
                                    .appendTo(".menu-container")
                                    .addClass("logout")
                                    .on("click", logout);


        var balanceButton : Button = new Button(jBalanceButton, "Saldo");
        var logoutButton : Button = new Button(jLogoutButton, "Esci");

        //balace page buttons
        var jBackBalanceButton : JQuery = $("<div />")
                                    .appendTo(".balance-container")
                                    .addClass("back")
                                    .on("click", () => 
                                    {
                                        $(".balance-container").fadeOut(400, () => $(".menu-container").fadeIn())
                                        setTimeout( () => $("#balance").text(""), 400);
                                    }
                                    );       
        var backBalanceButton : Button = new Button(jBackBalanceButton, "Indietro"); 

       
        WithdrawHandler.getInstance().buildPage();
        DepositHandler.getInstance().buildPage();
    };

$(document).ready(init)