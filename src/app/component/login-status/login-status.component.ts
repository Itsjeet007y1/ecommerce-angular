import { Component, Inject, OnInit } from '@angular/core';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated: boolean = false;
  userFullName: string = '';

  constructor(private oktaAuthService: OktaAuthStateService,
             @Inject(OKTA_AUTH) private oktaAuth: OktaAuth) { }
  
  
  async ngOnInit(): Promise<void> {
    
    // Subscribe to authentication state changes
    console.log("Inside ngOnInit ===========")
    await this.oktaAuthService.authState$.subscribe(
      (result) => {
        console.log("---------------------------------");
        console.log(result);
        this.isAuthenticated = result.isAuthenticated!;
        this.getUserDetails();
      }
    )
  }

  getUserDetails() {

    if(this.isAuthenticated) {
      
      // fetch the logged in user details (user's claims)
      //
      // user full name is exposed as a property name
      this.oktaAuth.getUser().then(
        (res) => {
          this.userFullName = res.name as string;
        }
      );
    }
  }
  
  logOut() {
    // Terminates the session with okta and remove current tokens
    this.oktaAuth.signOut();
  }

}
