const qiniuConfig = {
	accessKey: '_C_l506psbbWCBbKfQC1SUeXXT9QhpFR9T1a8jZ9',
	secretKey: 'KaQ_lYr9zTYVQzVqBZkfokcaMTpl8q4gml5fAPJB',
	originPath: '',
	originFile: '编译完成后的引导，比如index.html，指定此文件会自动将文件中的"/styles/images/a.png"替换为"${cdnHost}/styles/images/a.png"',
	oldOriginPath: '上一次编译结果的保存文件夹，这个需要在npm run dev之类的编译命令中完成，也为了能快速的回退版本。如 oldDisk',
	zone: '七牛云空间的所属zone',
	envConfig: {
		//因为前端工程可能有多个不同环境下的，比如测试环境下、生产环境下的，只需在这里分别配置不同环境下的bucket和cdn的域名就可以了
		// 使用node运行脚本时会根据提供的参数识别相应的配置。
		testing: {
			bucket: 'your bucket',
			cdnHost: '你cdn的域名 如http://cdn.com'
		},
		prod: {
			bucket: '',
			cdnHost: ''
		}
	}
}

module.exports =  qiniuConfig;
