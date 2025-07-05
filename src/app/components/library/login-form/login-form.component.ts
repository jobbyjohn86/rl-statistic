import { CommonModule } from '@angular/common';
import { Component, NgModule, Input, OnInit, ViewChild, ElementRef, Renderer2, Pipe, PipeTransform } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { LoginOauthModule } from 'src/app/components/library/login-oauth/login-oauth.component';
import { DxFormComponent, DxFormModule } from 'devextreme-angular/ui/form';
import { DxLoadIndicatorModule } from 'devextreme-angular/ui/load-indicator';
import { DxButtonModule, DxButtonTypes } from 'devextreme-angular/ui/button';
import notify from 'devextreme/ui/notify';
import { AuthService, DataService, IResponse, ThemeService } from 'src/app/services';
import { DxPopupComponent, DxPopupModule, DxProgressBarModule, DxTextBoxComponent, DxTextBoxModule } from 'devextreme-angular';
import { AppAccessModule } from '../app-access/app-access.component';
import { DecryptionService } from 'src/app/services/decryption';
import { CryptoService } from 'src/app/services/crypto.service';
// import { TimePipe } from 'src/app/pipes/time.pipe';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {
  @Input() resetLink = '/auth/reset-password';
  @Input() createAccountLink = '/auth/create-account';

  defaultAuthData: IResponse;

  btnStylingMode: DxButtonTypes.ButtonStyle;

  passwordMode = 'password';

  loading = false;

  formData: any = {};

  passwordEditorOptions = {
    placeholder: 'Password',
    stylingMode: 'filled',
    mode: this.passwordMode,
    value: '03340546100',
    // buttons: [{
    //   name: 'password',
    //   location: 'after',
    //   options: {
    //     icon: 'info',
    //     stylingMode:'text',
    //     onClick: () => this.changePasswordMode(),
    //   }
    // }]
  }





  isAccessRequired: boolean = true;
  // rcidButtonOptions: Record<string, unknown>;

  @ViewChild(DxFormComponent, { static: false }) form: DxFormComponent;

  buttonText = 'Start progress';
  inProgress = false;
  seconds = 10;
  maxValue = 10;
  intervalId: number;


  constructor(private authService: AuthService, private router: Router,
    private themeService: ThemeService, private service: DataService,
    private el: ElementRef, private renderer: Renderer2, private route: ActivatedRoute,
    private decryptionService: DecryptionService, private cryptoService: CryptoService) {
    this.themeService.isDark.subscribe((value: boolean) => {
      this.btnStylingMode = value ? 'outlined' : 'contained';
    });



    //// here it will check the rcId esisx or not, it can be from Mobi saved in localstorage
    // let _rcid = localStorage.getItem('rcId');
    // if (_rcid) {
    //   this.authService.isAccessRequired = false;
    // } else {
    //   this.authService.isAccessRequired = true;
    // }
    // this.isAccessRequired = this.authService.isAccessRequired;

  }

  changePasswordMode() {
    debugger;
    this.passwordMode = this.passwordMode === 'text' ? 'password' : 'text';
  };

  async onSubmit(e: Event) {
    e.preventDefault();
    const { email, password } = this.formData;
    this.loading = true;
    this.authService.validateLogin(email, password).subscribe(r => {
      // if (r && r.ExecuteMobiDataResult[0].length > 0) {
      //   let defaultUser = this.authService.saveUserData(email, r.ExecuteMobiDataResult[0]);
      //   this.authService._user = { ...defaultUser, email };
      //   localStorage.setItem('user', JSON.stringify(this.authService._user));
      //   this.authService.getDataAfterLogin(defaultUser.userID, defaultUser.teamID, defaultUser.designationID).subscribe(x => {
      //     localStorage.setItem('fy', x.ExecuteMobiDataResult[7]);
      //     localStorage.setItem('location', x.ExecuteMobiDataResult[8]);
      //     this.service.getSavedStorage();
      //     notify('Authentication Successfull', 'success', 2000);
      //     console.log(this.authService._lastAuthenticatedPath);
      //     // this.router.navigate([this.authService._lastAuthenticatedPath]);
      //     this.router.navigate(['/analytics-dashboard']);
      //   }, () => {
      //     this.loading = false;
      //   })
      // } else {
      //   this.loading = false;
      //   notify('Authentication Failed', 'error', 2000);
      // }
    }, error => {
      this.loading = false;
      notify('Authentication Failed', 'error', 2000);
    }, () => {
      this.loading = false;
    })

    // const result = await this.authService.logIn(email, password);
    // this.loading = false;
    // if (result.isOk==false) {
    //   notify(result.message, 'error', 2000);
    // }

  }

  onCreateAccountClick = () => {
    this.router.navigate([this.createAccountLink]);
  };

  updateRCID() {
    this.isAccessRequired = !this.isAccessRequired;
  }




  async ngOnInit(): Promise<void> {



    this.route.queryParams.subscribe(params => {
      const encryptedData = params['data'];
      if (encryptedData) {



        // const ciphertext = 'b/aRE4LG/uaJvCLYoQjpdywKouY7fjbzyjP9mErfQfu/OjsSlFCAu1EgtM8gmD8GurGMd6yr9O8uqN4U1tWLcQ'; // Your encrypted ciphertext
        // const passPhrase = 'RanceLab';
        // const saltValue = 'FusionRetail6';
        // const hashAlgorithm = 'SHA1';
        // const passwordIterations = 6;
        // const initVector = 'A1B2C3D4E5F6G7H8';
        // const keySize = 128;

        // // const decryptedText = this.decryptionService.decryptWithParams(ciphertext);
        // // console.log('Decrypted Text:', decryptedText);

        // // const decryptedText = this.cryptoService.decrypt(ciphertext);

        // this.cryptoService.decrypt(ciphertext)
        //   .then(decryptedText => {
        //     console.log('Decrypted Text:', decryptedText);
        //   })
        //   .catch(error => {
        //     console.error('Decryption failed', error);
        //   });

        // // console.log('Decrypted Text:', decryptedText);


        //=======================
        const decryptedData = this.decryptionService.decrypt(encryptedData);
        // const decryptedData = this.decryptionService.decryptObjectFromHex<string>(decodeURIComponent(encryptedData));

        let paramsValues = decryptedData.split("&");
        if (paramsValues[0].length > 0) {
          let _rcidString = paramsValues[0].split("=");
          localStorage.setItem('rcId', _rcidString[1]);
        }

        if (paramsValues[1].length > 0) {
          let _userNameString = paramsValues[1].split("=");
          localStorage.setItem('userName', _userNameString[1]);
        }

        if (paramsValues[2].length > 0) {
          let _passwordString = paramsValues[2].split("=");
          localStorage.setItem('password', _passwordString[1]);
        }

      }

      // const inputRcID = params['rcid'];
      // const inputUserName = params['username'];
      // const inputPassword = params['password'];
      // if (inputRcID) {
      //   localStorage.setItem('rcId', inputRcID);
      // }
      // if (inputUserName) {
      //   localStorage.setItem('userName', inputUserName);
      // }
      // if (inputPassword) {
      //   localStorage.setItem('password', inputPassword);
      // }
    });



    let _rcid = localStorage.getItem('rcId');
    if (_rcid) {
      this.authService.isAccessRequired = false;
    } else {
      this.authService.isAccessRequired = true;
    }
    this.isAccessRequired = this.authService.isAccessRequired;


    let _email = localStorage.getItem('userName');
    let _password = localStorage.getItem('password');
    if (_email) { this.formData.email = _email; }
    if (_password) { this.formData.password = _password; }
    // submit the form
    if (_email.length > 0 && _password.length > 0) {
      const event = new Event('submit', { bubbles: true, cancelable: true });
      const formElement = this.el.nativeElement.querySelector('#myForm');
      if (formElement) {
        formElement.dispatchEvent(event);

        this.defaultAuthData = await this.authService.getUser();
        if (this.defaultAuthData) {
          this.authService.gotoDashboard();
        }

      }
    }


    // // this.defaultAuthData = await this.authService.getUser();
    // this.defaultAuthData = await this.authService.getUser();
    // if (this.defaultAuthData) {
    //   this.authService.gotoDashboard();
    // }

  }


  // ===============//

  

  onButtonClick() {
    if (this.inProgress) {
      this.buttonText = 'Continue progress';
      clearInterval(this.intervalId);
    } else {
      this.buttonText = 'Stop progress';

      if (this.seconds === 0) {
        this.seconds = 10;
      }

      this.intervalId = window.setInterval(() => this.timer(), 1000);
    }
    this.inProgress = !this.inProgress;
  }

  timer() {
    this.seconds--;
    if (this.seconds == 0) {
      this.buttonText = 'Restart progress';
      this.inProgress = !this.inProgress;
      clearInterval(this.intervalId);
    }
  }

  format(ratio) {
    return `Loading: ${ratio * 100}%`;
  }

}




@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    LoginOauthModule,
    DxFormModule,
    DxLoadIndicatorModule,
    DxButtonModule,
    DxPopupModule,
    DxTextBoxModule,
    AppAccessModule,
    DxProgressBarModule
  ],
  declarations: [LoginFormComponent],
  exports: [LoginFormComponent],
})
export class LoginFormModule { }

