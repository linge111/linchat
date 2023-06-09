// https://nuxt.com/docs/api/configuration/nuxt-config
const appName = 'DnAI'

export default defineNuxtConfig({
    dev: false,
    ssr: false,
    app: {
        head: {
            title: appName,
        },
    },
    runtimeConfig: {
        public: {
            appName: appName,
            typewriter: false,
            typewriterDelay: 50,
        }
    },
    build: {
        transpile: ['vuetify']
    },
    css: [
        'vuetify/styles',
        'material-design-icons-iconfont/dist/material-design-icons.css',
        'highlight.js/styles/panda-syntax-dark.css',
    ],
    modules: [
        '@kevinmarrec/nuxt-pwa',
        '@nuxtjs/color-mode',
        '@nuxtjs/i18n',
    ],
    pwa: {
        manifest: {
            name: appName,
            short_name: appName,
            description: 'A ChatGPT web Client'
        },
        workbox: {
            enabled: true
        }
    },
    i18n: {
        strategy: 'no_prefix',
        locales: [
            {
                code: 'zh-CN',
                iso: 'zh-CN',
                name: '简体中文',
                file: 'zh-CN.json',
            }
        ],
        lazy: true,
        langDir: 'lang',
        defaultLocale: 'zh-CN',
        vueI18n: {
            fallbackLocale: 'zh-CN',
        },
    },
    nitro: {
        devProxy: {
            "/api": {
                target: process.env.NUXT_DEV_SERVER ?? 'http://localhost:8000/api',
                prependPath: true,
                changeOrigin: true,
            }

        }
    },
})
