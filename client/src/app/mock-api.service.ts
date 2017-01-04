import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';

@Injectable()
export class MockApiService implements InMemoryDbService {
    createDb() {
        let accounts = [
            {
                
            }
        ];

        return {
            accounts
        };
    }
}