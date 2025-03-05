import { Component, OnInit } from '@angular/core';
import { OnesdkTokenService } from '../onesdk-token.service';
import { environment } from 'src/environments/environment';
import { EnvironmentConfigService } from '../environment-config.service';
import OneSDK from '@frankieone/one-sdk';

@Component({
	selector: 'app-idv',
	templateUrl: './idv.component.html',
	styleUrls: ['./idv.component.css']
})
export class IdvComponent implements OnInit {
  private oneSdk: any;
	constructor(private tokenService: OnesdkTokenService, private envConfigService: EnvironmentConfigService) { }

	async ngOnInit() {    
    // Initialize the OneSDK with the token from the token service
    this.oneSdk = await OneSDK({
      session: await this.tokenService.getToken(),
    });

		const flow = this.oneSdk.flow as unknown as (arg0: any) => any;

		const idv = flow("idv");
		const oneSdkIndividual = this.oneSdk.individual();
		oneSdkIndividual.addConsent("general");
		oneSdkIndividual.addConsent("docs");
		oneSdkIndividual.addConsent("creditheader");
		await oneSdkIndividual.submit();

		idv.mount("#idv-dynamic");
	}
}