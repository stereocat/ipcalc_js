# ipcalc_js
IP Calculator using Vue.js
(inspired by [IP Calculator / IP Subnetting](http://jodies.de/ipcalc))

## Installation
### Install Node.js/npm
Install Node.js/npm. (Ubuntu)
```
sudo apt install nodejs npm
```

In Ubuntu 16, there are old version Node/npm... So, re-install Node.js/npm with "n package".
```
sudo npm cache clean
sudo npm install n -g
sudo n stable # or latest as you like
```

Then, delete old ubuntu packages.
```
sudo apt-get purge -y nodejs npm
```

### Install required packages
Install packages by `package.json`
```
npm install
```

## Build
```
npm run build
```

# Usage
Build and open `ipcalc.html` by browser.
All values are calculated automatically when you change IP/Mask input field.
(No need to push button and wait response.)

![Sample](./figs/ipcalc.png)
