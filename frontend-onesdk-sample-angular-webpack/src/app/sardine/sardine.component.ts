import { Component, OnInit } from '@angular/core';
import OneSDK from '@frankieone/one-sdk';
import { environment } from 'src/environments/environment';
import { EnvironmentConfigService } from '../environment-config.service';
import { OnesdkTokenService } from '../onesdk-token.service';

@Component({
	selector: 'app-sardine',
	templateUrl: './sardine.component.html',
	styleUrls: ['./sardine.component.css']
})
export class SardineComponent implements OnInit {
  private oneSdk: any;
	constructor(private tokenService: OnesdkTokenService, private envConfigService: EnvironmentConfigService) { }

	async ngOnInit() {    this.oneSdk = await OneSDK({
			session: await this.tokenService.getToken(),
			recipe: {
				form: {
					provider: {
						name: "react",
						googleApiKey: await this.envConfigService.getGoogleApiKey()
					}
				}
			},
		});

		const component = this.oneSdk.component as unknown as (arg0: any, arg1: any) => any;
		const device = component("device", {
			activityType: "REGISTRATION",
		});
		device.start();

		const welcome = component("form", {
			name: "WELCOME",
			mode: "individual",
			type: "manual",
		}) as any;

		const consent = component("form", {
			name: "CONSENT",
			mode: "individual",
			type: "manual",
		});

		const personal = component("form", {
			name: "PERSONAL",
			mode: "individual",
			type: "manual",
			personal: {
				countries: {
					default: {
						default: {
							fields: [
								{
									fieldType: 'input',
									dataType: 'text',
									label: 'Email',
									name: 'extraData.email',
									hide: false,
									rules: {
										required: {
											value: true,
											message: "Please enter your email"
										}
									}
								},
								{
									fieldType: 'phone',
									dataType: 'phone',
									label: 'Phone Number',
									name: 'extraData.phone',
									hide: false,
									placeholder: {
										cc: "Code",
										phoneNumber: "e.g. 0400 000 000"
									},
									options: [
										{ label: "AU +61", value: "+61" },
										{ label: "NZ +64", value: "+64" },
										{ label: "PH +63", value: "+63" },
									],
									rules: {
										required: {
											value: true,
											message: "Please enter your phone number"
										}
									}
								},
							]
						}
					}
				}
			}
		});

		const document = component("form", {
			name: "DOCUMENT",
			mode: "individual",
			type: "manual",
		});

		const review = component("form", {
			name: "REVIEW",
			mode: "individual",
			type: "manual",
			verify: true,
		});

		const retry = component("form", {
			name: "RETRY",
			mode: "individual",
			type: "manual",
		});

		const result = component("form", {
			name: "RESULT",
			mode: "individual",
			type: "manual",
			state: "FAIL",
		});

		welcome.on("*", OneSDK.wildcardEventLogger);

		welcome.on("form:welcome:ready", () => {
			consent.mount("#sardine-container");
		});

		consent.on("form:consent:ready", async () => {
			personal.mount("#sardine-container");
		});

		personal.on("form:personal:ready", async () => {
			document.mount("#sardine-container");
		});

		document.on("form:document:back", async () => {
			personal.mount("#sardine-container");
		});

		document.on("form:document:ready", async () => {
			review.mount("#sardine-container");
		});

		let count = 0;
		review.on("form:result:partial", async () => {
			if (count < 2) {
				retry.mount("#sardine-container");
				count += 1;
			}
		});

		welcome.mount("#sardine-container");
	}
}
