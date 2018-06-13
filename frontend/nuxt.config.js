module.exports = {
    head: {
        htmlAttrs: {
            lang: 'en'
        },
        meta: [
            { charset: 'utf-8' },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1, user-scalable=no'
            }
        ],
        titleTemplate(title) {
            return title ? `${title} | Beerlytics` : 'Beerlytics';
        },
        link: [
            { rel: 'icon', type: 'image/png', href: '/favicon.png' },
            { rel: 'stylesheet', href: '/fonts/fonts.min.css' }
        ]
    },
    css: [
        'bulma/css/bulma.css'
    ],
    router: {
        linkActiveClass: 'is-active'
    }
};