import identity from './identity.js';
const log = console.log;


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
const imgProx = function (url) {
  let img = new Image();
  img.src = `${url}&uid=${identity().getIdentity()}`;
  img.onload = function () {
    img = null;
  };
  img.onerror = function () {
    img = null;
  };
}
function reported(config) {
  this.config = config;
  this.mousePositions = [];
  this.eventPositions = [];
  /**
   * 定时长时计时器
   */
  this.regular = null;

  const base64 = identity().base64();
  imgProx(`${this.config.reportedUrl || ''}&base64=${base64}&active=init`);
  this.actionListening();
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
  this.startRegular();
}


reported.prototype.trackClick = function (event) {
  this.eventPositions.push({
    x: event.clientX, y: event.clientY, t: getDeltasTime(), e: {
      i: event.target.id,
      n: event.target.nodeName,
      t: event.type
    }
  });
};




reported.prototype.trackMouseMove = function (event) {
  this.mousePositions.push({ x: event.clientX, y: event.clientY, t: getDeltasTime() });
};

/**
 * 
 */
reported.prototype.send = function () {
  const base64 = this.dataSlice();
  imgProx(`${this.config.reportedUrl || ''}&base64=${base64}&active=active`);
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
    f: Object.keys(values[0] ?? {}),
    v: values ? values.map(d => {
      return Object.values(d)
    }) : []
  };
}

/**
 * 对数据进行剪切后指定长度的数据包，去噪，压缩后转换成base64数据进行上报
 * @returns 
 */
reported.prototype.dataSlice = function () {
  const mousePositions = this.mousePositions.splice(0, 500);
  const compressedData = JSON.stringify(this.formatted(mousePositions));
  log('compressedData=', compressedData);
  const eventPositions = this.eventPositions.splice(0, this.eventPositions.length);
  const eventCompressedData = JSON.stringify(this.formatted(eventPositions), 15);
  log('eventCompressedData=', eventCompressedData);
  return btoa(JSON.stringify({
    m: compressedData,
    a: eventCompressedData
  }));
}

export default reported;