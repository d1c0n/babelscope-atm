import { data } from "jquery";
import { Component } from "../component";
import "./button.scss";

export class Button extends Component
{
    private label : string;

    constructor(element : JQuery, label : string, disable : boolean = false)
    {
        super(element);

        this.label = label;

        this._element
            .addClass("button")
            .prop("tabindex", "")
            .text(label)
            .attr("data-disable", String(disable));
    }

    enable(fun : () => void)
    {
        this._element.attr("data-disable", "false").text(this.label).on("click", fun);
    }
    disable()
    {
        this._element.attr("data-disable", "true").text("Caricamento...").off("click");
    }
}