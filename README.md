# Detect Device
This can be used to find the device information.

### Usage

##### Full cap
```TypeScript
detectDeviceServe.device(); //To get device type.
detectDeviceServe.getFingerPrint(); //To get device full information.
detectDeviceServe.resolutionState$.subscribe((resp) => { console.log(resp); }); //To get device state based on resolution.
```

#### Developer
[Babu S.R](http://babu-sr.github.io/profile "Profile")
