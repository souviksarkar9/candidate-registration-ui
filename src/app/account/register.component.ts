import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '../_services';
import { User } from '../_models';

@Component({ templateUrl: 'register.component.html' })
export class RegisterComponent implements OnInit {
    form!: FormGroup;
    loading = false;
    submitted = false;
    username : string | undefined;
    password : string | undefined;
    
    

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            name: ['', Validators.required],            
            dob: ['', Validators.required],
            username: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });

        this.accountService.getTempCredentials()
        .pipe(first())
        .subscribe(
            (                data: User) => {                
                this.username = data.username;
                this.password = data.password;
                this.alertService.success('username ' + data.username + ' password: ' + data.password );                   
            },
            (                error: any) => {
                this.alertService.error(error);
                this.loading = false;
            });    
    }

     get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;
        this.alertService.clear();
        if (this.form.invalid) {
            return;
        }
        this.loading = true;
        this.accountService.register(this.form.value)
            .pipe(first())
            .subscribe(
                (                data: any) => {
                    this.alertService.success('Registration successful', { keepAfterRouteChange: true });
                    this.router.navigate(['../login'], { relativeTo: this.route });
                },
                (                error: any) => {
                    this.alertService.error(error);
                    this.loading = false;
                });
            }
        } 