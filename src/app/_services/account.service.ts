import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';


import { environment } from '../../environments/environment';
import { User } from '../_models';  

@Injectable({ providedIn: 'root' })
export class AccountService {
    private userSubject: BehaviorSubject<User | null>;
    public user: Observable<User | null>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<User | null>(JSON.parse(localStorage.getItem('user')!));
        this.user = this.userSubject.asObservable();
    }

    public get userValue(): User | null {
        return this.userSubject.value;
    }

    login(username: any, password: any) {
        return this.http.post<User>(`${environment.apiUrl}/login`, { username, password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                return user;
            }));
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/account/login']);
    }

    register(user: User) {
        return this.http.post(`${environment.apiUrl}/save`, user);
    }

    getTempCredentials() {
        return this.http.get<User>(`${environment.apiUrl}/getCredentials`);
    }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/all`);
    }

    getById(id: string) {
        return this.http.get<User>(`${environment.apiUrl}/candidatebyId/${id}`);
    }

    getByUserName(username: string) {
        return this.http.get<User>(`${environment.apiUrl}/candidatebyUsername/${username}`);
    }
 
    update(id: string | null, user: User) {
        console.log("Candidate ID "+ user.candidateId);
        return this.http.post(`${environment.apiUrl}/update/${id}`, user)
            .pipe(map(x => {                
                if (this.userValue !=null && this.userValue.candidateId !=null && id == this.userValue.candidateId) {                    
                    const user1 = { ...this.userValue, ...user };
                    localStorage.setItem('user', JSON.stringify(user1));                    
                    this.userSubject.next(user1);
                }
                return x;
            }));
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/delete/${id}`)
            .pipe(map(x => {
                // auto logout if the logged in user deleted their own record
                if (this.userValue != null && id == this.userValue.candidateId) {
                    this.logout();
                }
                return x;
            }));
    }
}