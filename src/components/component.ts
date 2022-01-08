import { emit } from "../commons";

export abstract class Component
{
    protected _element : JQuery;
    
    constructor(element : JQuery)
    {
        this._element = element;
    }

    public get element() : JQuery { return this._element; }

    protected emit<T>(name : string, detail : T, bubbles : boolean = true, cancelable : boolean = true)
    {
        emit<T>(this._element, name, detail, bubbles, cancelable);
    }
}