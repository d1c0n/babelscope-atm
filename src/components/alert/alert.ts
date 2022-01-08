import { Component } from "../component";
import "./alert.scss";

export class Alert extends Component
{
    constructor(element : JQuery, type : string, title : string, body : string)
    {
        super(element);

        const titleElement : JQuery = $("<strong />").addClass("title").text(title);
        const bodyElement : JQuery = $("<span />").addClass("body").text(body);

        this._element
            .addClass("alert")
            .addClass("alert-" + type)
            .append(titleElement)
            .append(bodyElement)
            .on("click", () => 
                        $('.alert')
                            .animate({opacity:0, right:"-40%", bottom:"20px"}, 400, "swing", 
                            () => $('.alert').remove()));

    }

    public animateInOut(duration : number)
    {
        $(".alert").show();
                    $(".alert").animate({opacity:1, right:"20px", bottom:"20px"}, 400, "swing");
                
        setTimeout(() => {
            $('.alert')
                        .animate({opacity:0, right:"-40%", bottom:"20px"}, 400, "swing", 
                        () => $('.alert').remove());
            }, duration);
    }
}