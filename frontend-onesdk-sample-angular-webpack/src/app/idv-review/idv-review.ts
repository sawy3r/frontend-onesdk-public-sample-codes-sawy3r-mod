import { Component, OnInit } from '@angular/core';
import { OnesdkTokenService } from '../onesdk-token.service';
import OneSDK from '@frankieone/one-sdk';
import { environment } from 'src/environments/environment';
import { EnvironmentConfigService } from '../environment-config.service';

@Component({
	selector: 'app-idv-review',
	templateUrl: './idv-review.component.html',
	styleUrls: ['./idv-review.component.css']
})
export class IdvReviewComponent implements OnInit {
  private oneSdk: any;
	constructor(private tokenService: OnesdkTokenService, private envConfigService: EnvironmentConfigService) { }

	async ngOnInit() {    this.oneSdk = await OneSDK({
			session: await this.tokenService.getToken(),
			recipe: {
				form: {
					provider: {
						name: 'react',
						googleApiKey: await this.envConfigService.getGoogleApiKey()
					},
				}
			}
		});

		const component = this.oneSdk.component as unknown as (arg0: any, arg1?: any) => any;
		const flow = this.oneSdk.flow as unknown as (arg0: any) => any;

		const oneSdkIndividual = this.oneSdk.individual();
		oneSdkIndividual.addConsent("general");
		oneSdkIndividual.addConsent("docs");
		oneSdkIndividual.addConsent("creditheader");
		await oneSdkIndividual.submit();

		const idv = flow("idv");
		const loading1 = component("form", { name: "LOADING", title: { label: "Loading..." }, descriptions: [{ label: "" }] });
		const review = component("form", {
			name: "REVIEW",
			type: "ocr",
		});

		let before = true;
		idv.on("loading", (display: any) => {
			if (display) {
				if (before) {
					loading1.mount("#e2e-idv-loading1");
				}
			} else {
				if (before) {
					loading1.unmount();
				}
				before = false;
			}
		});

		idv.on("results", async () => {
			review.mount("#e2e-idv-container");
		});

		idv.mount("#e2e-idv-container");
	}
}