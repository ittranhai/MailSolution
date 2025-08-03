import { Injectable } from '@angular/core';
import { DataService } from '../../shared/services/data.service';
import { ApiService } from '../../shared/services/api.service';


@Injectable()
export class ApiTempateService<T> extends ApiService<T>{
    constructor(dataService: DataService) {
        super(dataService)
        this.path = '/Template'
    }
}
@Injectable()
export class ApiMailService<T> extends ApiService<T>{
    constructor(dataService: DataService) {
        super(dataService)
        this.path = '/Mail'
    }
}