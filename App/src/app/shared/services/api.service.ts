import { Injectable } from '@angular/core';
import { DataService } from '../../shared/services/data.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators'; 

@Injectable()
export abstract class ApiService<T> {
    public host: string = '';
    public path: string = '';
    constructor(protected dataService: DataService) {}
    Get(params : any): Observable<T[]> {
        let options = new URLSearchParams(params).toString();
        let url = this.GetHost() + this.path +"?"+options;
        return this.dataService.get(url).pipe<T[]>(tap((response: any) => {
            return response;
        }));
    }
    
    Create(data:T, action:string = ''): Observable<T> {
        let url = this.GetHost() + this.path;
        if (action) {
            url += `/${action}`;
        }
        return this.dataService.post(url, data).pipe<T>(tap((response: any) => true));
    }
    Update(id:any,data:T): Observable<T> {
        let url = this.GetHost() + this.path+"/"+id;
        return this.dataService.putWithId(url, data).pipe<T>(tap((response: any) => true));
    }
    Delete(id:any): Observable<any> {
        let url = this.GetHost() + this.path+"/"+id;
        return this.dataService.delete(url).pipe<any>(tap((response: any) => true));
    }
    DeleteItemSelected(ids:any): Observable<any> {
        let url = this.GetHost() + this.path;
        return this.dataService.delete_item_selected(url,ids).pipe<any>(tap((response: any) => true));
    }
    
    public GetHost(): any {
        //return this.storageService.retrieve('purchaseUrl');
        return ("http://localhost:5074");
    }
}