const audioInfo = {
  autoplay: false,
  testAutoPlay () {
    return new Promise(resolve => {
      let audio = document.createElement('audio');
      // require一个本地文件，会变成base64格式
      // audio.src = require('/music/music.mp3');
      audio.src = '/music/music.mp3';
      document.body.appendChild(audio);
      let autoplay = true;
      // play返回的是一个promise
      audio.play().then(() => {
        // 支持自动播放
        autoplay = true;
      }).catch(err => {
        // 不支持自动播放
        autoplay = false;
      }).finally(() => {
        audio.remove();
        // 告诉调用者结果
        resolve(autoplay);
      });
    });
  },
  // 监听页面的点击事件，一旦点过了就能autoplay了
  setAutoPlayWhenClick (callback) {
    function setAutoPlay () {
      // 设置自动播放为true
      audioInfo.autoplay = true;
      console.log('callback', callback);
      callback();
      document.removeEventListener('click', setAutoPlay);
      document.removeEventListener('touchend', setAutoPlay);
    }

    document.addEventListener('click', setAutoPlay);
    document.addEventListener('touchend', setAutoPlay);
  },
  init (callback) {
    // 检测是否能自动播放
    audioInfo.testAutoPlay().then(autoplay => {
      if (!audioInfo.autoplay) {
        audioInfo.autoplay = autoplay;
      }
    });
    // 用户点击交互之后，设置成能自动播放
    audioInfo.setAutoPlayWhenClick(callback);
  },
};
// audioInfo.init();
export default audioInfo;
