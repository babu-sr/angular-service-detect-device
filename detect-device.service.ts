import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GlobalFunctionService } from './global-function.service';

const MOBILE_MAX_WIDTH = 425;
const MOBILE_MIN_HEIGHT = 600;
const TABLET_MAX_WIDTH = 1024;
const TABLET_MIN_HEIGHT = 600;

interface ScreenState {
	isMobile: boolean;
	isTablet: boolean;
	isDesktop: boolean;
}

@Injectable({
	providedIn: 'root'
})
export class DetectDeviceService {
	resolutionState$: BehaviorSubject<ScreenState> = new BehaviorSubject({
		isMobile: false,
		isTablet: false,
		isDesktop: false
	});
	devicePlatforms = [
		{ name: 'Windows Phone', value: 'Windows Phone', version: 'OS' },
		{ name: 'Windows', value: 'Win', version: 'NT' },
		{ name: 'Linux', value: 'Linux', version: 'rv' },
		{ name: 'Macintosh', value: 'Mac', version: 'OS X' },
		{ name: 'Kindle', value: 'Silk', version: 'Silk' },
		{ name: 'Android', value: 'Android', version: 'Android' },
		{ name: 'iPhone', value: 'iPhone', version: 'OS' },
		{ name: 'PlayBook', value: 'PlayBook', version: 'OS' },
		{ name: 'BlackBerry', value: 'BlackBerry', version: '/' },
		{ name: 'Palm', value: 'Palm', version: 'PalmOS' }
	];
	browserList = [
		{ searchKey: 'Firefox/', value: 'Mozilla Firefox' },
		{ searchKey: 'Safari/', value: 'Safari' },
		{ searchKey: 'Chrome/', value: 'Google Chrome' },
		{ searchKey: 'Edg/', value: 'Microsoft Edge' },
		{ searchKey: 'EdgA/', value: 'Microsoft Edge' },
		{ searchKey: 'OPR/', value: 'Opera' }
	];
	private fingerPrint: any = null;

	constructor(private gfService: GlobalFunctionService) {}

	resolution(): ScreenState {
		const windowWidth = window.innerWidth;
		const windowHeight = window.innerHeight;
		// const isMobile = (windowWidth <= MOBILE_MAX_WIDTH || windowHeight <= MOBILE_MIN_HEIGHT);
		// const isTablet = ((windowWidth <= TABLET_MAX_WIDTH && windowWidth > MOBILE_MAX_WIDTH) ||
		//   (windowHeight <= TABLET_MIN_HEIGHT && windowHeight > MOBILE_MIN_HEIGHT));
		const isMobile = windowWidth <= MOBILE_MAX_WIDTH;
		const isTablet = windowWidth <= TABLET_MAX_WIDTH && windowWidth > MOBILE_MAX_WIDTH;
		const isDesktop = !isMobile && !isTablet;

		this.resolutionState$.next({
			isMobile,
			isTablet,
			isDesktop
		});

		return {
			isMobile,
			isTablet,
			isDesktop
		};
	}

	get device() {
		if ([ null, undefined ].includes(this.fingerPrint)) {
			return this.getDeviceType();
		}
		return this.fingerPrint.deviceType;
	}

	get getFingerPrint() {
		if ([ null, undefined ].includes(this.fingerPrint)) {
			const platformDetails = this.getDeviceDetails(navigator.userAgent, this.devicePlatforms);
			const browserDetails = this.getBrowserDetails();
			const deviceDetails = this.gfService.JSONMerge(platformDetails, browserDetails); // Alternative Object.assign(platformDetails, browserDetails);
			const browserSpecDetails = {
				selectedLanguage: navigator.language,
				theme:
					window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'Dark' : 'Light',
				userAgent: navigator.userAgent
			};
			this.fingerPrint = this.gfService.JSONMerge(deviceDetails, browserSpecDetails); // Alternative Object.assign(deviceDetails, browserSpecDetails);
		}
		return this.fingerPrint;
	}

	private getBrowserDetails() {
		const browserInfo = navigator.userAgent;
		let browserName = 'unknown';
		let browserVersion = '0';
		for (let j = 0; j < this.browserList.length; j++) {
			if (browserInfo.includes(this.browserList[j].searchKey) || navigator.userAgent.indexOf('Opera') !== -1) {
				browserName = this.browserList[j].value;
				let startIndex = browserInfo.indexOf(this.browserList[j].searchKey);
				if (startIndex !== -1) {
					browserVersion = browserInfo.substr(startIndex + this.browserList[j].searchKey.length, 4);
				}
			}
		}
		return { browserName, browserVersion };
	}

	private getDeviceDetails(deviceData, devicePlatforms) {
		let i = 0,
			regex,
			match;

		const deviceType = this.getDeviceType();
		const data = { os: 'unknown', deviceType };
		for (i = 0; i < devicePlatforms.length; i += 1) {
			regex = new RegExp(devicePlatforms[i].value, 'i');
			match = regex.test(deviceData);
			if (match) {
				data.os = devicePlatforms[i].name;
			}
		}
		return data;
	}

	private getDeviceType() {
		const ua = navigator.userAgent;
		if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
			return 'tablet';
		}
		if (
			/Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
				ua
			)
		) {
			return 'mobile';
		}
		return 'desktop';
	}
}
