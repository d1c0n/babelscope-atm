/**
 * emette un evento custom
 * @param element 
 * @param name 
 * @param detail 
 * @param bubbles 
 * @param cancelable 
 */
export function emit<T>(element : JQuery, name : string, detail : T, bubbles : boolean = true, cancelable : boolean = true)
{
    const options = 
    {
        bubbles : bubbles,
        cancelable : cancelable,
        detail : detail
    };

    const customEvent : CustomEvent = new CustomEvent(name, options);

    element.get(0).dispatchEvent(customEvent);
}