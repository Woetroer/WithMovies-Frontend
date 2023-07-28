import { Observable } from "rxjs";

export function toObservable<T>(promise: Promise<T>) {
    return new Observable<T>((sub) => {
        promise
            .then((res) => {
                sub.next(res);
                sub.complete();
            })
            .catch(sub.error);
    });
}
