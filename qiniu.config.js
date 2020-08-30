const qiniuConfig = {
  accessKey: '_C_l506psbbWCBbKfQC1SUeXXT9QhpFR9T1a8jZ9',
  secretKey: 'KaQ_lYr9zTYVQzVqBZkfokcaMTpl8q4gml5fAPJB',
  originPath: 'dist',
  originFile: 'index4.html',
  oldOriginPath: 'dist2',
  zone: 'qiniu.zone.Zone_z0',
  envConfig: {
    //因为前端工程可能有多个不同环境下的，比如测试环境下、生产环境下的，只需在这里分别配置不同环境下的bucket和cdn的域名就可以了
    // 使用node运行脚本时会根据提供的参数识别相应的配置。
    testing: {
      bucket: 'zhunong-inspur',
      cdnHost: 'zhunong.wanyudc.com',
    },
    prod: {
      bucket: 'zhunong-inspur',
      cdnHost: 'zhunong.wanyudc.com',
    },
  },
};

module.exports = qiniuConfig;
