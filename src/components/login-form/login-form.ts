import { Component } from "../component";
import { Button } from "../button/button"

export class LoginForm extends Component
{
    constructor(element : JQuery)
    {
        super(element);

        this._element
            .addClass("login-form")
            .append('<h1>ATM</h1>')
            .append('<p>Card Number</p>')
            .append('<input type="text" placeholder="Card Number" id="card-number">')
            .append('<p>PIN</p>')
            .append('<input type="password" placeholder="PIN" id="card-pin">');

            
            
    }
}