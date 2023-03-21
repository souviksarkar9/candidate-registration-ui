import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '../_services';
import { User } from '../_models';
import { DatePipe } from '@angular/common';
import { Education } from '../_models/education';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
    user: User;
    education!: Education;
    form!: FormGroup;
    loading = false;
    submitted = false;
    isCollapsed = true;
    isCollapsedEducationSection = true;
    isCollapsedEmploymentSection = true;
    isCollapsedPersonalSection = true;
    isCollapsedPhotoSection = true;
    isCollapsedProjectSection = true;
    disableForm = false;
 

    constructor(private formBuilder: FormBuilder,        
        private route: ActivatedRoute,
        private router: Router,private datePipe: DatePipe,
        private accountService: AccountService,
        private alertService: AlertService) {
        this.user = this.accountService.userValue!;
    }
    ngOnInit() {
        this.form = this.formBuilder.group({
            name: ['', Validators.required],            
            dob: ['', Validators.required],
            username: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });

        this.accountService.getByUserName(this.user.username!)
        .pipe(first())
        .subscribe(
            (                data: User) => {     
                this.user = data;                
                this.user.dob = this.datePipe.transform(data.dob, 'yyyy-MM-dd')!;                
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
        this.accountService.update(this.user.candidateId! , this.form.value)        
            .pipe(first())
            .subscribe(
                (                data: any) => {
                    this.alertService.success('Update successful', { keepAfterRouteChange: true }); 
                    this.loading = false;                   
                    this.router.navigate(['../home'], { relativeTo: this.route });
                },
                (                error: any) => {
                    this.alertService.error(error);
                    this.loading = false;
                });
            }
        } 