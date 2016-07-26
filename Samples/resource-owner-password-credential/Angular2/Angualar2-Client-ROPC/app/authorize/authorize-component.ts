﻿import {Component, ViewChild } from '@angular/core'
import {JwtHelper,tokenNotExpired} from 'angular2-jwt'
import {Router} from '@angular/router';
import {Authservice} from './authorize-service';
import {ResourceService} from '../resource/resource-service';
import { MODAL_DIRECTIVES, ModalComponent  } from 'ng2-bs3-modal/ng2-bs3-modal';
declare var System;
@Component({
    selector: 'authorize',
    templateUrl: '/app/authorize/authorize-component.html',
    directives: [MODAL_DIRECTIVES]
})
export class AuthorizeComponent{

    constructor(public jwtHelper: JwtHelper,
                private parentRouter: Router,
                private authService: Authservice,
                private resourceService:ResourceService) {}

    public userDetails: any ;
    public isLoggedin: boolean;
    public isLoading : boolean; // to show the loading progress
    public logMsg: string;
    public model: LogModel;
    public rmodel: RegisterModel;
    public loginBool: boolean;
    public registerBool: boolean;
    public user: string;
    public authdata: any;
    public authState:any;

    ngOnInit() {
        var instance = this; 
         // check if auth key is present.
         if(this.authService.authenticated()){
                instance.getUserFromServer();
                this.parentRouter.navigate(['/dashboard']);
         }
         else{
                if (localStorage.getItem('refresh_key')) { // check if refresh key is present it wont be present for external logged in users
                    this.refreshLogin(); // renew auth key and redirect
                }
         }
       
        this.model = new LogModel();
        this.rmodel = new RegisterModel();
        // below logic is for my login form snippet  to view login/register 
        this.logMsg = "Type your credentials.";
        this.loginBool = true;
        this.registerBool = false;
        //end of logic
    }
    // below logic is for my login form snippet to view login/register 
    @ViewChild('myModal')
    modal: ModalComponent;

    public mclose() {
        this.modal.close();
    }

   public mopen() {
        this.modal.open();
    }

   public logstatus() {
       this.isLoggedin = true; 
   }

    public callLogin() { // method to open login form
        this.loginBool = true;
        this.registerBool = false;
    }

    public callRegister() {//method to open register form
        this.loginBool = false;
        this.registerBool = true;
    }
    // end

    public login(creds: LogModel) {
        this.isLoading=true;
        var instance = this;
        this.authService.login(creds)
            .subscribe(
            TokenResult => {
                this.logMsg = "You are logged In Now , Please Wait ....";
                localStorage.setItem("auth_key", TokenResult.access_token);
                localStorage.setItem("refresh_key", TokenResult.refresh_token);
                instance.getUserFromServer();
                this.mclose();
                this.parentRouter.navigate(['/dashboard']);
                this.isLoading=false;
            },
            Error => {
                this.isLoading=false;
                var error, key;
                key = Error.json();
                for (error in key) 
                {
                    this.logMsg = "";
                    this.logMsg = this.logMsg + key[error] + "\n";
                }
            })
    }

    public refreshLogin() {
    this.isLoading=true;
    var instance = this;
        this.authService.refreshLogin()
            .subscribe(
            TokenResult => {
                this.isLoading=false;
                this.logMsg = "You are logged In Now , Please Wait ....";
                localStorage.setItem("auth_key", TokenResult.access_token);
                localStorage.setItem("refresh_key", TokenResult.refresh_token);
                instance.getUserFromServer();
                this.mclose();
                this.parentRouter.navigate(['/dashboard']);
            },
            Error => {
                this.isLoading=false;
                var error, key;
                key = Error.json();
                for (error in key) 
                {
                    this.logMsg = "";
                    this.logMsg = this.logMsg + key[error] + "\n";
                }
            })
    }

    public getUserFromServer() {
        this.isLoading=true;
        var instance = this;
        this.resourceService.getUserInfo().subscribe(data => {
            this.isLoading=false;
            instance.userDetails = data;
            this.isLoggedin = true;
            },
            error => 
            {
                this.isLoading=false;
                instance.userDetails = error;
            });
    }

    public logout() {
        this.isLoading=true;
        this.authService.logout().subscribe(data => {
            this.isLoading=false;
            localStorage.removeItem("auth_key");
            localStorage.removeItem("refresh_key");
            this.parentRouter.navigate(['/']);
            this.isLoggedin = false;
        }, error => 
            {
             this.isLoading=false;
             this.logMsg = error 
            });
    }

    public userRegister(creds:RegisterModel) {
        this.isLoading=true;
        this.authService.register(creds)
            .subscribe(
            TokenResult => {
                this.isLoading=false;
                if (TokenResult.succeeded) {
                    this.model.username = creds.Email;
                    this.model.password = creds.Password;
                    this.login(this.model);
                }
                else
                {
                    this.logMsg = TokenResult.errors[0].description
                }
            },
            Error => {
                this.isLoading=false;
                var error, key;
                   key = Error.json();
                 if (key.succeeded == false) 
                    {
                    this.logMsg = key.errors[0].description
                    }
                 else
                    {
                        for (error in key)
                        {
                            this.logMsg = "";
                            this.logMsg = this.logMsg + key[error] + "\n";
                        }
                    }
            });
     }
     //End of class
}


export class LogModel {
    public username: string;
    public password: string;
}

export class RegisterModel {
    public Email: string;
    public Password: string;
    public ConfirmPassword: string;
}

export class TokenResult {
    public access_token: string;
    public expires_in: string;
    public refresh_token: string;
    public token_type: string;
}

export class Regresult {
    public succeeded: string;
    public errors: any[];
   
}