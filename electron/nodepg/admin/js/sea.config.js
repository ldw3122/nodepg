// seajs 配置
seajs.config({
  alias: {
        "jquery":            "lib/jqsea.js",
        "vue":              "lib/vue/vue_sea.js",
        "jqvue":            "lib/vue/jquery_vue_sea.js",
        "vuex":             "lib/vue/vuex_sea.js",
        "index":            "m/index.js"
  },
  paths: {  
    'm': 'module',
    'v': 'view',
    'lib': 'lib'
  },
  preload: ['vue', 'jqvue']
})