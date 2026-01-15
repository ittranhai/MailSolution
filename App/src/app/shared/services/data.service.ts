import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';


// Implementing a Retry-Circuit breaker policy 
// is pending to do for the SPA app
@Injectable()
export class DataService {
    constructor(private http: HttpClient) { }

    get(url: string, params?: any): Observable<Response> {
        let options = { };
        //this.setHeaders(options);
        return this.http.get(url, { ...options, withCredentials: true })
            .pipe(
                // retry(3), // retry a failed request up to 3 times
                tap((res: any) => {
                    return res;
                }),
                catchError(this.handleError)
            );
    }

    
    post(url: string, data: any, params?: any): Observable<Response> {
        return this.doPost(url, data, false, params);
    }
    export(url: string, data: any, params?: any): Observable<any> {
        return this.doExport(url, data, false, params);
    }
    putWithId(url: string, data: any, params?: any): Observable<Response> {
        return this.doPut(url, data, true, params);
    }

    private doPost(url: string, data: any, needId: boolean, params?: any): Observable<Response> {
        let options = { };
        //this.setHeaders(options, needId);

        return this.http.post(url, data, { ...options, withCredentials: true })
            .pipe(
                tap((res: any) => {
                    return res;
                }),
                catchError(this.handleError)
            );
    }
    private doExport(url: string, data: any, showLoading = false, options?: any): Observable<any> {

        // 🔥 BYPASS FILE / PDF
        if (options?.responseType === 'blob') {
            return this.http.post(url, data, options);
        }

        // ⬇️ logic cũ cho JSON
        return this.http.post(url, data, options).pipe(
            map((res: any) => res?.data ?? res)
        );
    }
    
    delete(url: string, params?: any): Observable<Response> {
        let options = { };
        //this.setHeaders(options);

        console.log('data.service deleting');

        return this.http.delete(url, { ...options, withCredentials: true })
        .pipe(
            tap((res: any) => {
                return res;
            }),
            catchError(this.handleError)
        );
    }
    delete_item_selected(url: string, params?: any): Observable<Response> {
        let options = { 
            body: params
        };
        //this.setHeaders(options);

        console.log('data.service deleting');

        return this.http.delete(url, { ...options, withCredentials: true })
        .pipe(
            tap((res: any) => {
                return res;
            }),
            catchError(this.handleError)
        );
    }

    private doPut(url: string, data: any, needId: boolean, params?: any): Observable<Response> {
        let options = { };
        //this.setHeaders(options, needId);
       
        return this.http.put(url, data, { ...options, withCredentials: true })
            .pipe(
                tap((res: any) => {
                    return res;
                }),
                catchError(this.handleError)
            );
    }

    // private setHeaders(options: any, needId?: boolean){
    //     if (needId && this.securityService) {
    //         options["headers"] = new HttpHeaders()
    //             //.append('authorization', 'Bearer ' + this.securityService.GetToken())
    //             .append('x-requestid', Guid.newGuid())
    //             .append('accept-language', 'vi-VN');
    //     }
    //     else if (this.securityService) {
    //         options["headers"] = new HttpHeaders()
    //             //.append('authorization', 'Bearer ' + this.securityService.GetToken())
    //             .append('accept-language', 'vi-VN');
    //     }
    // }
    private handleError(error: any) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('Client side network error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.log('Backend - ' +
                `status: ${error.status}, ` +
                `statusText: ${error.statusText}, ` +
                `message: ${error.message}`);
        }

        // return an observable with a user-facing error message
        return throwError(error || 'server error');
    }
}
