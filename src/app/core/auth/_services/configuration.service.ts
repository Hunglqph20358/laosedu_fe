import { Injectable } from '@angular/core';
import { IConfiguration } from '../_models/configuration.model';

import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage.service';
import { environment } from '../../../../environments/environment';

@Injectable({providedIn: 'root'})
export class ConfigurationService {
    serverSettings: IConfiguration;
    // observable that is fired when settings are loaded from server
    private settingsLoadedSource = new Subject();
    settingsLoaded$ = this.settingsLoadedSource.asObservable();
    isReady = false;

    constructor(
        private http: HttpClient,
        private storageService: StorageService
        ) {}

    load() {
        this.serverSettings = {identityUrl: ''}
        this.serverSettings.identityUrl = environment.AUTH_SERVER;
        this.storageService.store('identityUrl', this.serverSettings.identityUrl);
        this.isReady = true;
        this.settingsLoadedSource.next();
    }
}