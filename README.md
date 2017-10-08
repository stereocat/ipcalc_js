# ipcalc_js
IP Calculator using Vue.js

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

### Install WebPack
```
sudo npm install webpack -g
```

### Install required packages
Install packages by `package.json`
```
npm install
```

## Build
Build (generate) `bundle.js` using `webpack`.
```
webpack ipcalc.js bundle.js
```

# Usage
Build and open `ipcalc.html` by browser.
