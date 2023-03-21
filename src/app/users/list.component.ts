import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService } from '../_services';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    users!: any[];

    constructor(private accountService: AccountService,private datePipe: DatePipe,) {}

    ngOnInit() {
        this.accountService.getAll()
            .pipe(first())
            .subscribe(users => {
                users.forEach(item =>  item.dob = this.datePipe.transform( item.dob, 'dd-MM-yyyy')!);  
                this.users = users;

            });          
    }

    deleteUser(id: string) {
        const user = this.users.find((x: { id: string; }) => x.id === id);
        user.isDeleting = true;
        this.accountService.delete(id)
            .pipe(first())
            .subscribe(() => {
                this.users = this.users.filter(x => x.id !== id) 
            });
    }
}