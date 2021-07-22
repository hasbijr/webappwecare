import {config} from './global.config'

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Sahabat NITS',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
      { rel: 'stylesheet', href: 'http://fonts.cdnfonts.com/css/gotham-rounded' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' },
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@static/assets/css/argon.min.css',
    '@static/assets/css/custom.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    {src: '@plugins/vue-horizontal-timeline.js', ssr: false},
    {src: '@plugins/vue-carousel.js', ssr: false},
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    
  ],

  dateFns: {
    /* module options */
  },

  resolve: {
    // Add `.ts` as a resolvable extension.
    extensions: ['.ts', '.js']
  },

  module: {
    rules: [
      // ... other rules omitted
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: { appendTsSuffixTo: [/\.vue$/] }
      }
    ]
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    '@nuxtjs/style-resources',
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },

  env: {
    baseURL: process.env.BASE_URL || config.baseApiUrl,
    baseURLProd: config.baseApiUrlProd,
    baseApiUrl: config.baseApiUrl
  },
  axios: {
    baseURL: config.baseApiUrl,
    headers: {
      'Content-Type':'application/json',
      'X-Requested-With':'XMLHttpRequest'
    },
  },
  router: {
    // middleware: 'auth',
    base: config.base
  },

  auth: {
    busy:false,
    loggedIn:true,
    strategies: {
      local: {
        token: {
          property: 'access_token',
          // required: true,
          type: 'Bearer'
        },
        user: {
          property: false,
          // autoFetch: true
        },
        endpoints: {
          login: {url: 'auth/login', method: 'post'},
          logout: false,
          user: {
              url: '/auth/profile',
              method: 'get',
          }
        },
        // tokenRequired: true,
      }
    },
    redirect: {
      login: '/login',
      logout: '/login',
      user: '/profile',
      callback:'/'
    }
  },
}
