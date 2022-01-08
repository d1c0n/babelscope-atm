import { Observable, of } from "rxjs";
import { delay } from "rxjs/operators";

export abstract class LocalService
{
    public of<T>(t : T) : Observable<T>
    {
        return of(t).pipe(delay(1000));
    }
}