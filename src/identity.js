import MD5 from 'crypto-js/md5';
import Cookies from 'js-cookie'

/**
 * 使用HTML5的Canvas元素绘制图形并获取图像数据的哈希值，这种方法可以生成较为独特的指纹。
 * @returns 
 */
function getCanvasFingerprint() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.textBaseline = 'top';
  ctx.font = '14px Arial';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#f60';
  ctx.fillRect(125, 1, 62, 20);
  ctx.fillStyle = '#069';
  ctx.fillText('Hello, world!', 2, 15);
  ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
  ctx.fillText('Hello, world!', 4, 17);
  const dataUrl = canvas.toDataURL();
  let hash = 0;
  for (let i = 0; i < dataUrl.length; i++) {
    const char = dataUrl.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

function getJsVersion() {
  const features = {
    'let': (() => { try { eval('let a = 1;'); return true; } catch (e) { return false; } })(),
    'const': (() => { try { eval('const a = 1;'); return true; } catch (e) { return false; } })(),
    'arrow functions': typeof (() => { }) === 'function',
    'class': (() => { try { eval('class A {}'); return true; } catch (e) { return false; } })(),
    'Promise': typeof Promise !== 'undefined',
    'Map': typeof Map !== 'undefined',
    'Set': typeof Set !== 'undefined'
  };

  let version = 'ES5';

  if (features['let'] && features['const']) {
    version = 'ES6';
  }
  if (features['Promise'] && features['Map'] && features['Set']) {
    version = 'ES6+';
  }

  return version;
}

/**
  * 使用WebGL来渲染图形并获取图像数据的哈希值。
  * @returns 
  */
function getWebGLFingerprint() {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) return null;
  const extension = gl.getExtension('WEBGL_debug_renderer_info');
  if (!extension) return null;
  const renderer = gl.getParameter(extension.UNMASKED_RENDERER_WEBGL);
  const vendor = gl.getParameter(extension.UNMASKED_VENDOR_WEBGL);
  return `${renderer} ${vendor}`;
}
function identity() {
  const userAgent = navigator.userAgent;
  const { width, height } = screen;
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const language = navigator.language || navigator.userLanguage;
  // const getCanvasFingerprint = getCanvasFingerprint();
  // //获取用户的网络连接类型、下行速度等
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection || {};
  const {
    effectiveType,
    downlink,
    rtt
  } = connection;
  // //获取设备的逻辑处理器数量（CPU内核数）。
  const hardwareConcurrency = navigator.hardwareConcurrency;
  // //获取设备的内存容量（单位为GB）。
  const deviceMemory = navigator.deviceMemory;
  const cookiesEnabled = navigator.cookieEnabled;
  const supportsWebGL = !!window.WebGLRenderingContext;
  const supportsServiceWorkers = !!('serviceWorker' in navigator);
  const supportsPushNotifications = !!('PushManager' in window);
  return {
    info: {
      userAgent,
      screen: {
        width, height
      },
      timeZone,
      language,
      getWebGLFingerprint: getWebGLFingerprint(),
      getCanvasFingerprint: getCanvasFingerprint(),
      connection,
      connection: {
        effectiveType,
        downlink,
        rtt
      },
      hardwareConcurrency,
      deviceMemory,
      cookiesEnabled,
      supportsWebGL,
      supportsServiceWorkers,
      supportsPushNotifications,
      time: parseInt(new Date().getTime() / 1000),
      url: window.location.href,
      referrer: document.referrer,
      jsVersion: getJsVersion()
    },
    base64() {
      return btoa(JSON.stringify(this.info));
    },
    getIdentity() {
      const key = "__ton_u_id_";
      let v = typeof localStorage !== 'undefined' ? localStorage.getItem(key) : Cookies.get(key);
      if (!v) {
        const orgStr = `${this.info.getCanvasFingerprint}_${new Date().getTime()}`;
        console.log(orgStr);
        v = MD5(orgStr).toString();
        typeof localStorage !== 'undefined' ? localStorage.setItem(key, v) : Cookies.set(key, v);
      }
      return v;
    }
  }
};


export default identity;