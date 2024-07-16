!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e="undefined"!=typeof globalThis?globalThis:e||self).TonIdentity=t()}(this,(function(){"use strict";var commonjsGlobal="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function getDefaultExportFromCjs(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}function getAugmentedNamespace(e){if(e.__esModule)return e;var t=e.default;if("function"==typeof t){var n=function e(){return this instanceof e?Reflect.construct(t,arguments,this.constructor):t.apply(this,arguments)};n.prototype=t.prototype}else n={};return Object.defineProperty(n,"__esModule",{value:!0}),Object.keys(e).forEach((function(t){var r=Object.getOwnPropertyDescriptor(e,t);Object.defineProperty(n,t,r.get?r:{enumerable:!0,get:function(){return e[t]}})})),n}function _defineProperty(e,t,n){return(t=_toPropertyKey(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function _toPrimitive(e,t){if("object"!=typeof e||!e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var r=n.call(e,t||"default");if("object"!=typeof r)return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}function _toPropertyKey(e){var t=_toPrimitive(e,"string");return"symbol"==typeof t?t:t+""}var md5={exports:{}};function commonjsRequire(e){throw new Error('Could not dynamically require "'+e+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var core={exports:{}},hasRequiredCore;function requireCore(){return hasRequiredCore||(hasRequiredCore=1,function(e,t){var n;e.exports=(n=n||function(e,t){var n;if("undefined"!=typeof window&&window.crypto&&(n=window.crypto),"undefined"!=typeof self&&self.crypto&&(n=self.crypto),"undefined"!=typeof globalThis&&globalThis.crypto&&(n=globalThis.crypto),!n&&"undefined"!=typeof window&&window.msCrypto&&(n=window.msCrypto),!n&&void 0!==commonjsGlobal&&commonjsGlobal.crypto&&(n=commonjsGlobal.crypto),!n&&"function"==typeof commonjsRequire)try{n=require("crypto")}catch(e){}var r=function(){if(n){if("function"==typeof n.getRandomValues)try{return n.getRandomValues(new Uint32Array(1))[0]}catch(e){}if("function"==typeof n.randomBytes)try{return n.randomBytes(4).readInt32LE()}catch(e){}}throw new Error("Native crypto module could not be used to get secure random number.")},i=Object.create||function(){function e(){}return function(t){var n;return e.prototype=t,n=new e,e.prototype=null,n}}(),o={},a=o.lib={},s=a.Base={extend:function(e){var t=i(this);return e&&t.mixIn(e),t.hasOwnProperty("init")&&this.init!==t.init||(t.init=function(){t.$super.init.apply(this,arguments)}),t.init.prototype=t,t.$super=this,t},create:function(){var e=this.extend();return e.init.apply(e,arguments),e},init:function(){},mixIn:function(e){for(var t in e)e.hasOwnProperty(t)&&(this[t]=e[t]);e.hasOwnProperty("toString")&&(this.toString=e.toString)},clone:function(){return this.init.prototype.extend(this)}},c=a.WordArray=s.extend({init:function(e,n){e=this.words=e||[],this.sigBytes=n!=t?n:4*e.length},toString:function(e){return(e||f).stringify(this)},concat:function(e){var t=this.words,n=e.words,r=this.sigBytes,i=e.sigBytes;if(this.clamp(),r%4)for(var o=0;o<i;o++){var a=n[o>>>2]>>>24-o%4*8&255;t[r+o>>>2]|=a<<24-(r+o)%4*8}else for(var s=0;s<i;s+=4)t[r+s>>>2]=n[s>>>2];return this.sigBytes+=i,this},clamp:function(){var t=this.words,n=this.sigBytes;t[n>>>2]&=4294967295<<32-n%4*8,t.length=e.ceil(n/4)},clone:function(){var e=s.clone.call(this);return e.words=this.words.slice(0),e},random:function(e){for(var t=[],n=0;n<e;n+=4)t.push(r());return new c.init(t,e)}}),u=o.enc={},f=u.Hex={stringify:function(e){for(var t=e.words,n=e.sigBytes,r=[],i=0;i<n;i++){var o=t[i>>>2]>>>24-i%4*8&255;r.push((o>>>4).toString(16)),r.push((15&o).toString(16))}return r.join("")},parse:function(e){for(var t=e.length,n=[],r=0;r<t;r+=2)n[r>>>3]|=parseInt(e.substr(r,2),16)<<24-r%8*4;return new c.init(n,t/2)}},l=u.Latin1={stringify:function(e){for(var t=e.words,n=e.sigBytes,r=[],i=0;i<n;i++){var o=t[i>>>2]>>>24-i%4*8&255;r.push(String.fromCharCode(o))}return r.join("")},parse:function(e){for(var t=e.length,n=[],r=0;r<t;r++)n[r>>>2]|=(255&e.charCodeAt(r))<<24-r%4*8;return new c.init(n,t)}},d=u.Utf8={stringify:function(e){try{return decodeURIComponent(escape(l.stringify(e)))}catch(e){throw new Error("Malformed UTF-8 data")}},parse:function(e){return l.parse(unescape(encodeURIComponent(e)))}},p=a.BufferedBlockAlgorithm=s.extend({reset:function(){this._data=new c.init,this._nDataBytes=0},_append:function(e){"string"==typeof e&&(e=d.parse(e)),this._data.concat(e),this._nDataBytes+=e.sigBytes},_process:function(t){var n,r=this._data,i=r.words,o=r.sigBytes,a=this.blockSize,s=o/(4*a),u=(s=t?e.ceil(s):e.max((0|s)-this._minBufferSize,0))*a,f=e.min(4*u,o);if(u){for(var l=0;l<u;l+=a)this._doProcessBlock(i,l);n=i.splice(0,u),r.sigBytes-=f}return new c.init(n,f)},clone:function(){var e=s.clone.call(this);return e._data=this._data.clone(),e},_minBufferSize:0});a.Hasher=p.extend({cfg:s.extend(),init:function(e){this.cfg=this.cfg.extend(e),this.reset()},reset:function(){p.reset.call(this),this._doReset()},update:function(e){return this._append(e),this._process(),this},finalize:function(e){return e&&this._append(e),this._doFinalize()},blockSize:16,_createHelper:function(e){return function(t,n){return new e.init(n).finalize(t)}},_createHmacHelper:function(e){return function(t,n){return new g.HMAC.init(e,n).finalize(t)}}});var g=o.algo={};return o}(Math),n)}(core)),core.exports}!function(e,t){var n;e.exports=(n=requireCore(),function(e){var t=n,r=t.lib,i=r.WordArray,o=r.Hasher,a=t.algo,s=[];!function(){for(var t=0;t<64;t++)s[t]=4294967296*e.abs(e.sin(t+1))|0}();var c=a.MD5=o.extend({_doReset:function(){this._hash=new i.init([1732584193,4023233417,2562383102,271733878])},_doProcessBlock:function(e,t){for(var n=0;n<16;n++){var r=t+n,i=e[r];e[r]=16711935&(i<<8|i>>>24)|4278255360&(i<<24|i>>>8)}var o=this._hash.words,a=e[t+0],c=e[t+1],p=e[t+2],g=e[t+3],h=e[t+4],y=e[t+5],v=e[t+6],m=e[t+7],w=e[t+8],_=e[t+9],b=e[t+10],x=e[t+11],C=e[t+12],P=e[t+13],M=e[t+14],S=e[t+15],B=o[0],D=o[1],E=o[2],j=o[3];B=u(B,D,E,j,a,7,s[0]),j=u(j,B,D,E,c,12,s[1]),E=u(E,j,B,D,p,17,s[2]),D=u(D,E,j,B,g,22,s[3]),B=u(B,D,E,j,h,7,s[4]),j=u(j,B,D,E,y,12,s[5]),E=u(E,j,B,D,v,17,s[6]),D=u(D,E,j,B,m,22,s[7]),B=u(B,D,E,j,w,7,s[8]),j=u(j,B,D,E,_,12,s[9]),E=u(E,j,B,D,b,17,s[10]),D=u(D,E,j,B,x,22,s[11]),B=u(B,D,E,j,C,7,s[12]),j=u(j,B,D,E,P,12,s[13]),E=u(E,j,B,D,M,17,s[14]),B=f(B,D=u(D,E,j,B,S,22,s[15]),E,j,c,5,s[16]),j=f(j,B,D,E,v,9,s[17]),E=f(E,j,B,D,x,14,s[18]),D=f(D,E,j,B,a,20,s[19]),B=f(B,D,E,j,y,5,s[20]),j=f(j,B,D,E,b,9,s[21]),E=f(E,j,B,D,S,14,s[22]),D=f(D,E,j,B,h,20,s[23]),B=f(B,D,E,j,_,5,s[24]),j=f(j,B,D,E,M,9,s[25]),E=f(E,j,B,D,g,14,s[26]),D=f(D,E,j,B,w,20,s[27]),B=f(B,D,E,j,P,5,s[28]),j=f(j,B,D,E,p,9,s[29]),E=f(E,j,B,D,m,14,s[30]),B=l(B,D=f(D,E,j,B,C,20,s[31]),E,j,y,4,s[32]),j=l(j,B,D,E,w,11,s[33]),E=l(E,j,B,D,x,16,s[34]),D=l(D,E,j,B,M,23,s[35]),B=l(B,D,E,j,c,4,s[36]),j=l(j,B,D,E,h,11,s[37]),E=l(E,j,B,D,m,16,s[38]),D=l(D,E,j,B,b,23,s[39]),B=l(B,D,E,j,P,4,s[40]),j=l(j,B,D,E,a,11,s[41]),E=l(E,j,B,D,g,16,s[42]),D=l(D,E,j,B,v,23,s[43]),B=l(B,D,E,j,_,4,s[44]),j=l(j,B,D,E,C,11,s[45]),E=l(E,j,B,D,S,16,s[46]),B=d(B,D=l(D,E,j,B,p,23,s[47]),E,j,a,6,s[48]),j=d(j,B,D,E,m,10,s[49]),E=d(E,j,B,D,M,15,s[50]),D=d(D,E,j,B,y,21,s[51]),B=d(B,D,E,j,C,6,s[52]),j=d(j,B,D,E,g,10,s[53]),E=d(E,j,B,D,b,15,s[54]),D=d(D,E,j,B,c,21,s[55]),B=d(B,D,E,j,w,6,s[56]),j=d(j,B,D,E,S,10,s[57]),E=d(E,j,B,D,v,15,s[58]),D=d(D,E,j,B,P,21,s[59]),B=d(B,D,E,j,h,6,s[60]),j=d(j,B,D,E,x,10,s[61]),E=d(E,j,B,D,p,15,s[62]),D=d(D,E,j,B,_,21,s[63]),o[0]=o[0]+B|0,o[1]=o[1]+D|0,o[2]=o[2]+E|0,o[3]=o[3]+j|0},_doFinalize:function(){var t=this._data,n=t.words,r=8*this._nDataBytes,i=8*t.sigBytes;n[i>>>5]|=128<<24-i%32;var o=e.floor(r/4294967296),a=r;n[15+(i+64>>>9<<4)]=16711935&(o<<8|o>>>24)|4278255360&(o<<24|o>>>8),n[14+(i+64>>>9<<4)]=16711935&(a<<8|a>>>24)|4278255360&(a<<24|a>>>8),t.sigBytes=4*(n.length+1),this._process();for(var s=this._hash,c=s.words,u=0;u<4;u++){var f=c[u];c[u]=16711935&(f<<8|f>>>24)|4278255360&(f<<24|f>>>8)}return s},clone:function(){var e=o.clone.call(this);return e._hash=this._hash.clone(),e}});function u(e,t,n,r,i,o,a){var s=e+(t&n|~t&r)+i+a;return(s<<o|s>>>32-o)+t}function f(e,t,n,r,i,o,a){var s=e+(t&r|n&~r)+i+a;return(s<<o|s>>>32-o)+t}function l(e,t,n,r,i,o,a){var s=e+(t^n^r)+i+a;return(s<<o|s>>>32-o)+t}function d(e,t,n,r,i,o,a){var s=e+(n^(t|~r))+i+a;return(s<<o|s>>>32-o)+t}t.MD5=o._createHelper(c),t.HmacMD5=o._createHmacHelper(c)}(Math),n.MD5)}(md5);var md5Exports=md5.exports,MD5=getDefaultExportFromCjs(md5Exports);
/*! js-cookie v3.0.5 | MIT */
function assign(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)e[r]=n[r]}return e}var defaultConverter={read:function(e){return'"'===e[0]&&(e=e.slice(1,-1)),e.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent)},write:function(e){return encodeURIComponent(e).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,decodeURIComponent)}};function init(e,t){function n(n,r,i){if("undefined"!=typeof document){"number"==typeof(i=assign({},t,i)).expires&&(i.expires=new Date(Date.now()+864e5*i.expires)),i.expires&&(i.expires=i.expires.toUTCString()),n=encodeURIComponent(n).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape);var o="";for(var a in i)i[a]&&(o+="; "+a,!0!==i[a]&&(o+="="+i[a].split(";")[0]));return document.cookie=n+"="+e.write(r,n)+o}}return Object.create({set:n,get:function(t){if("undefined"!=typeof document&&(!arguments.length||t)){for(var n=document.cookie?document.cookie.split("; "):[],r={},i=0;i<n.length;i++){var o=n[i].split("="),a=o.slice(1).join("=");try{var s=decodeURIComponent(o[0]);if(r[s]=e.read(a,s),t===s)break}catch(e){}}return t?r[t]:r}},remove:function(e,t){n(e,"",assign({},t,{expires:-1}))},withAttributes:function(e){return init(this.converter,assign({},this.attributes,e))},withConverter:function(e){return init(assign({},this.converter,e),this.attributes)}},{attributes:{value:Object.freeze(t)},converter:{value:Object.freeze(e)}})}var api=init(defaultConverter,{path:"/"});function getCanvasFingerprint(){var e=document.createElement("canvas"),t=e.getContext("2d");t.textBaseline="top",t.font="14px Arial",t.textBaseline="alphabetic",t.fillStyle="#f60",t.fillRect(125,1,62,20),t.fillStyle="#069",t.fillText("Hello, world!",2,15),t.fillStyle="rgba(102, 204, 0, 0.7)",t.fillText("Hello, world!",4,17);for(var n=e.toDataURL(),r=0,i=0;i<n.length;i++){r=(r<<5)-r+n.charCodeAt(i),r|=0}return r}function getJsVersion(){var features={let:function(){try{return eval("let a = 1;"),!0}catch(e){return!1}}(),const:function(){try{return eval("const a = 1;"),!0}catch(e){return!1}}(),"arrow functions":!0,class:function(){try{return eval("class A {}"),!0}catch(e){return!1}}(),Promise:"undefined"!=typeof Promise,Map:"undefined"!=typeof Map,Set:"undefined"!=typeof Set},version="ES5";return features.let&&features.const&&(version="ES6"),features.Promise&&features.Map&&features.Set&&(version="ES6+"),version}function getWebGLFingerprint(){var e=document.createElement("canvas"),t=e.getContext("webgl")||e.getContext("experimental-webgl");if(!t)return null;var n=t.getExtension("WEBGL_debug_renderer_info");if(!n)return null;var r=t.getParameter(n.UNMASKED_RENDERER_WEBGL),i=t.getParameter(n.UNMASKED_VENDOR_WEBGL);return"".concat(r," ").concat(i)}function identity(){var e,t=navigator.userAgent,n=screen,r=n.width,i=n.height,o=Intl.DateTimeFormat().resolvedOptions().timeZone,a=navigator.language||navigator.userLanguage,s=navigator.connection||navigator.mozConnection||navigator.webkitConnection,c=s.effectiveType,u=s.downlink,f=s.rtt,l=navigator.hardwareConcurrency,d=navigator.deviceMemory,p=navigator.cookieEnabled,g=!!window.WebGLRenderingContext,h=!!("serviceWorker"in navigator),y=!!("PushManager"in window);return{info:(e={userAgent:t,screen:{width:r,height:i},timeZone:o,language:a,getWebGLFingerprint:getWebGLFingerprint(),getCanvasFingerprint:getCanvasFingerprint(),connection:s},_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(e,"connection",{effectiveType:c,downlink:u,rtt:f}),"hardwareConcurrency",l),"deviceMemory",d),"cookiesEnabled",p),"supportsWebGL",g),"supportsServiceWorkers",h),"supportsPushNotifications",y),"time",parseInt((new Date).getTime()/1e3)),"url",window.location.href),"referrer",document.referrer),_defineProperty(e,"jsVersion",getJsVersion())),base64:function(){return btoa(JSON.stringify(this.info))},getIdentity:function(){var e="__ton_u_id_",t=this.info.supportsWebGL?localStorage.getItem(e):api.get(e);if(!t){var n="".concat(this.info.getCanvasFingerprint,"_").concat((new Date).getTime());console.log(n),t=MD5(n).toString(),this.info.supportsWebGL?localStorage.setItem(e,t):api.set(e,t)}return t}}}var identity$1=Object.freeze({__proto__:null,default:identity}),require$$0=getAugmentedNamespace(identity$1),log=console.log,removeNoise=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:10;return e.filter((function(e,n,r){if(0===n)return!0;var i=r[n-1];return Math.sqrt(Math.pow(e.x-i.x,2)+Math.pow(e.y-i.y,2))>t}))},rdp=function e(t,n){if(t.length<3)return t;var r=t.reduce((function(e,t,n,r){var i=distanceToSegment(t,r[0],r[r.length-1]);return i>e.distance?{distance:i,index:n}:e}),{distance:0,index:0});if(r.distance>n){var i=e(t.slice(0,r.index+1),n),o=e(t.slice(r.index),n);return i.slice(0,-1).concat(o)}return[t[0],t[t.length-1]]},getDeltasTime=function(e){if(!e){var t=new Date;t.setHours(0,0,0,0),e=parseInt(t.getTime()/1e3)}return parseInt((new Date).getTime()/1e3-e,10)},distanceToSegment=function(e,t,n){var r=Math.pow(t.x-n.x,2)+Math.pow(t.y-n.y,2);if(0===r)return Math.sqrt(Math.pow(e.x-t.x,2)+Math.pow(e.y-t.y,2));var i=((e.x-t.x)*(n.x-t.x)+(e.y-t.y)*(n.y-t.y))/r,o=Math.max(0,Math.min(1,i)),a=t.x+o*(n.x-t.x),s=t.y+o*(n.y-t.y);return Math.sqrt(Math.pow(e.x-a,2)+Math.pow(e.y-s,2))},imgProx=function(e){var t=new Image;t.src="".concat(e,"&uid=").concat(identity().getIdentity()),t.onload=function(){t=null},t.onerror=function(){t=null}};function reported(e){this.config=e,this.mousePositions=[],this.eventPositions=[],this.regular=null;var t=identity().base64();imgProx("".concat(this.config.reportedUrl||"","&base64=").concat(t,"&active=init")),this.actionListening()}reported.prototype.startRegular=function(){var e=this;this.regular&&clearTimeout(this.regular),this.regular=setTimeout((function(){log("触发自动上报机制!"),e.send()}),this.config.regularTime||1e4)},reported.prototype.actionListening=function(){var e=this;log("初始化监听机制"),document.addEventListener("mousemove",(function(t){e.trackMouseMove(t)})),document.addEventListener("click",(function(t){e.trackClick(t)})),document.addEventListener("dblclick",(function(t){e.trackClick(t)})),this.startRegular()},reported.prototype.trackClick=function(e){this.eventPositions.push({x:e.clientX,y:e.clientY,t:getDeltasTime(),e:{i:e.target.id,n:e.target.nodeName,t:e.type}})},reported.prototype.trackMouseMove=function(e){this.mousePositions.push({x:e.clientX,y:e.clientY,t:getDeltasTime()})},reported.prototype.send=function(){var e=this.dataSlice();imgProx("".concat(this.config.reportedUrl||"","&base64=").concat(e,"&active=active")),this.startRegular()},reported.prototype.formatted=function(e){var t,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:50,r=removeNoise(e),i=rdp(r,n),o="function"==typeof this.config.formatted?this.config.formatted(i):i;return{f:Object.keys(null!==(t=o[0])&&void 0!==t?t:{}),v:o?o.map((function(e){return Object.values(e)})):[]}},reported.prototype.dataSlice=function(){var e=this.mousePositions.splice(0,500),t=JSON.stringify(this.formatted(e));log("compressedData=",t);var n=this.eventPositions.splice(0,this.eventPositions.length),r=JSON.stringify(this.formatted(n),15);return log("eventCompressedData=",r),btoa(JSON.stringify({m:t,a:r}))};var reported$1=Object.freeze({__proto__:null,default:reported}),require$$1=getAugmentedNamespace(reported$1),src={identity:require$$0,reported:require$$1},index=getDefaultExportFromCjs(src);return index}));
