import identity from './identity.js';
const log = function (...args) {
  return;
};
import MD5 from 'crypto-js/md5';
const version = '1.0.0';


//过滤和去除鼠标轨迹数据中的噪声点
const removeNoise = function (positions, threshold = 10) {
  return positions.filter((pos, index, arr) => {
    if (index === 0) return true;
    const prevPos = arr[index - 1];
    const distance = Math.sqrt(Math.pow(pos.x - prevPos.x, 2) + Math.pow(pos.y - prevPos.y, 2));
    return distance > threshold;
  });
}
/**
 * 
 * Ramer-Douglas-Peucker 算法的缩写，主要用于简化路径数据。该算法通过递归方式识别和移除多余的点，以减少数据点的数量，同时保留路径的形状和特征。
 * @param {*} points 
 * @param {*} epsilon 
 * @returns 
 */
const rdp = function (points, epsilon) {
  if (points.length < 3) return points;

  const dmax = points.reduce((max, point, i, arr) => {
    const d = distanceToSegment(point, arr[0], arr[arr.length - 1]);
    return d > max.distance ? { distance: d, index: i } : max;
  }, { distance: 0, index: 0 });

  if (dmax.distance > epsilon) {
    const left = rdp(points.slice(0, dmax.index + 1), epsilon);
    const right = rdp(points.slice(dmax.index), epsilon);
    return left.slice(0, -1).concat(right);
  } else {
    return [points[0], points[points.length - 1]];
  }
}

/**
 * 获得通过差值计算的时间戳，差值需要和服务器的时间进行同步
 * @param {*} deltas 
 * @returns 
 */
const getDeltasTime = function (deltas) {
  if (!deltas) {
    const date = (new Date());
    date.setHours(0, 0, 0, 0);
    deltas = parseInt(date.getTime() / 1000)
  }
  return parseInt(new Date().getTime() / 1000 - deltas, 10);
};

/**
 * 一个用于计算点到线段距离的函数。在 Ramer-Douglas-Peucker 算法中，这个函数用于确定路径中某个点到连接起点和终点的线段的距离
 * @param {*} p 
 * @param {*} v 
 * @param {*} w 
 * @returns 
 */
const distanceToSegment = function (p, v, w) {
  const l2 = Math.pow(v.x - w.x, 2) + Math.pow(v.y - w.y, 2);
  if (l2 === 0) return Math.sqrt(Math.pow(p.x - v.x, 2) + Math.pow(p.y - v.y, 2));
  const t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  const tClamped = Math.max(0, Math.min(1, t));
  const proj = { x: v.x + tClamped * (w.x - v.x), y: v.y + tClamped * (w.y - v.y) };
  return Math.sqrt(Math.pow(p.x - proj.x, 2) + Math.pow(p.y - proj.y, 2));
}
/**
 * 
 * @param {string} url 
 * @param {Number} delay  一般设置为15000左右可以让img发送完请求
 */
const imgProx = function (url, delay = 1) {
  let img = new Image();
  const src = `${url}&uid=${encodeURIComponent(identity().getIdentity())}&v=${encodeURIComponent(version)}`;
  img.src = src;
  console.log('加载网址', src);

  img.onload = function () {
    // 图片加载成功的处理逻辑
  };

  img.onerror = function (e) {
    console.error(e); // 打印错误信息
  };

  img.onloadend = img.onerror = function () {
    console.log('清理img对象...');
    img = null; // 无论加载成功还是失败，都将 img 对象设置为 null 以释放内存。
  };

  // while (i <= delay) {
  //   i++;
  //   if (i == 1) {
  //     // const src = `${url}&uid=${identity().getIdentity()}&v=${version}`;
  //     // const worker = new Worker('https://www.eggjs.org/umi.10724b02.js');
  //     // debugger;
  //     // // 发送消息给 Web Worker
  //     // worker.postMessage({
  //     //   src
  //     // });

  //   }
  // }

}
function reported(config) {
  this.config = config;
  this.mousePositions = [];
  this.eventPositions = [];
  /**
   * 定时长时计时器
   */
  this.regular = null;
  this.newPage();
  this.pageIdx = MD5(String(new Date().getTime() + Math.random())).toString();
  this.actionListening();


}

reported.prototype.newPage = function () {
  console.log('pageIdx org=', new Date().getTime() + Math.random());
  this.pageIdx = MD5(String(new Date().getTime() + Math.random())).toString();
  const base64 = identity().base64();
  imgProx(`${this.config.reportedUrl || ''}&base64=${base64}&active=init&pid=${this.pageIdx}`);
}

/**
 * 定时上报机制
 */
reported.prototype.startRegular = function () {
  this.regular && clearTimeout(this.regular);
  // 定时30秒进行一次上报
  this.regular = setTimeout(() => {
    log('触发自动上报机制!');
    this.send();
  }, this.config.regularTime || 1000 * 10);;
}


reported.prototype.actionListening = function () {

  //如果是单页面的应用，
  if (typeof MutationObserver !== 'undefined') {
    const cxt = this;
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'href') {
          // 处理 URL 变化
          cxt.newPage();
        }
      });
    });

    observer.observe(document.querySelector('head > base') || document.documentElement, {
      attributes: true,
      attributeFilter: ['href']
    });
  }

  log('初始化监听机制');
  document.addEventListener('mousemove', (Event) => {
    this.trackMouseMove(Event);
  });
  document.addEventListener('click', (Event) => {
    this.trackClick(Event);
  });
  document.addEventListener('dblclick', (Event) => {
    this.trackClick(Event);
  });
  //不一定有用，需要关闭窗口时，发送最后剩余的数据
  window.addEventListener('beforeunload', (event) => {
    this.trackClick({
      target: {
        nodeName: "window",
      },
      type: "beforeunload"
    })
    this.send(-1, 20e3);

  });
  this.startRegular();
}


reported.prototype.trackClick = function (event) {
  this.eventPositions.push({
    x: event.clientX || 0, y: event.clientY || 0, t: getDeltasTime(), e: {
      i: event.target.id || '',
      n: event.target.nodeName || '',
      t: event.type || ''
    }
  });
};




reported.prototype.trackMouseMove = function (event) {
  this.mousePositions.push({ x: event.clientX, y: event.clientY, t: getDeltasTime() });
};


/**
 * 手动触发发送事件
 */
reported.prototype.customizeSend = function (config = {}) {
  if (typeof config.onBefore === 'function') {
    try {
      const values = config.onBefore();
      if (values) {
        if (Array.isArray(values)) {
          this.eventPositions.push(...values);
        } else {
          this.eventPositions.push(values);
        }
      }
    } catch (e) {
      console.log(e);
    }
    console.log(this.eventPositions);
  }
  try {
    this.send(-1);
  } catch (e) {
    console.log(e);
  }
  typeof config.onAfter === 'function' && config.onAfter();
};

/**
 * 
 */
reported.prototype.send = function (len = 500, delay = 1) {
  const base64 = this.dataSlice(len);
  imgProx(`${this.config.reportedUrl || ''}&base64=${base64}&active=active&pid=${this.pageIdx}`, delay);
  this.startRegular();
}


/**
 * 
 * @param {Array} val 
 */
reported.prototype.formatted = function (val, epsilon = 50) {
  const noiseReducedData = removeNoise(val);
  const compressedData = rdp(noiseReducedData, epsilon);
  const values = 'function' === typeof this.config.formatted ? this.config.formatted(compressedData) : compressedData;

  return {
    f: Object.keys(values[0] ? values[0] : {}),
    v: values ? values.map(d => {
      return Object.values(d)
    }) : []
  };
}

/**
 * 对数据进行剪切后指定长度的数据包，去噪，压缩后转换成base64数据进行上报
 * @returns 
 */
reported.prototype.dataSlice = function (leng = 500) {
  const mousePositions = this.mousePositions.splice(0, leng > 0 ? leng : this.mousePositions.length);
  const compressedData = JSON.stringify(this.formatted(mousePositions));
  log('compressedData=', compressedData);
  const eventPositions = this.eventPositions.splice(0, this.eventPositions.length);
  const eventCompressedData = JSON.stringify(this.formatted(eventPositions), 15);
  log('eventCompressedData=', eventCompressedData);
  console.log(eventCompressedData, eventCompressedData);
  return btoa(JSON.stringify({
    m: compressedData,
    a: eventCompressedData
  }));
}

export default reported;