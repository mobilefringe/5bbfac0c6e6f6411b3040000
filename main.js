require.config({
    paths: {
        'Vue': 'https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.13/vue',
        'vue_router': 'https://cdnjs.cloudflare.com/ajax/libs/vue-router/2.7.0/vue-router.min',
        'axios': 'https://cdnjs.cloudflare.com/ajax/libs/axios/0.16.1/axios.min',
        'jquery': 'https://code.jquery.com/jquery-3.2.1.min',
        'lodash': 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.min',
        'moment': 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment-with-locales.min',
        'moment-timezone': 'https://momentjs.com/downloads/moment-timezone-with-data-2012-2022.min',
        'vue2-filters': 'https://cdn.jsdelivr.net/vue2-filters/0.1.8/vue2-filters.min',
        'vue': 'https://mmvue.codecloudapp.com/require-vuejs.min',
        'vuex': 'https://cdnjs.cloudflare.com/ajax/libs/vuex/2.3.1/vuex.min',
        'vue-i18n': 'https://cdnjs.cloudflare.com/ajax/libs/vue-i18n/6.1.1/vue-i18n.min',
        'text': 'https://cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text.min',
        'json': 'https://unpkg.com/requirejs-plugins-current@1.0.3/src/json',
        'js-cookie': 'https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.1.4/js.cookie.min',
        'vue-meta': 'https://unpkg.com/vue-meta@1.0.4/lib/vue-meta.min',
        'Fuse': 'https://cdnjs.cloudflare.com/ajax/libs/fuse.js/3.0.4/fuse.min',
        'datastore_mutation_types': 'https://mmvue.codecloudapp.com/datastore_mutation_types',
        'datastore_getters': 'https://mmvue.codecloudapp.com/datastore_getters',
        'datastore_actions': 'https://mmvue.codecloudapp.com/datastore_actions',
        'datastore_mutations': 'https://mmvue.codecloudapp.com/datastore_mutations',
        'datastore': 'https://mmvue.codecloudapp.com/datastore',
        'vue-moment': 'https://mmvue.codecloudapp.com/vue-moment',
        'vuex-router-sync': 'https://mmvue.codecloudapp.com/vuex-router-sync',
        'today_hours': 'https://mmvue.codecloudapp.com/today_hours.vue?noext', //append a dummy query string so requireJS doesn't auto-append .js to the end of the url
        'search-component': 'https://mmvue.codecloudapp.com/search-component.vue?noext',
        'slick': 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min',
        'vue-slick': 'https://mmvue.codecloudapp.com/slick.vue?noext',
        'vue-select': 'https://cdn.jsdelivr.net/npm/vue-select@2.3.0/dist/vue-select.min',
        'vue-social-sharing': 'https://cdn.jsdelivr.net/npm/vue-social-sharing@2.3.1/dist/vue-social-sharing.min',
        'vee-validate' : 'https://cdn.jsdelivr.net/npm/vee-validate@latest/dist/vee-validate',
        'v-calendar': 'https://unpkg.com/v-calendar@0.5.1/lib/v-calendar.min',
        'lightbox': 'https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.10.0/js/lightbox.min',
        'vue-simple-spinner': 'https://cdn.jsdelivr.net/npm/vue-simple-spinner@1.2.8/dist/vue-simple-spinner.min',
        'vue-lazy-load': 'https://unpkg.com/vue-lazyload/vue-lazyload',
        'masonry' : 'https://cdnjs.cloudflare.com/ajax/libs/masonry/4.0.0/masonry.pkgd.min',
        'vue-masonry-plugin' : 'https://cdn.jsdelivr.net/npm/vue-masonry@0.10.16/dist/vue-masonry-plugin',
        'vue-paginate': 'https://cdnjs.cloudflare.com/ajax/libs/vue-paginate/3.5.1/vue-paginate',
        // 'loader': 'https://mmvue.codecloudapp.com/loader.vue?noext',
        'bootstrap-vue' : 'https://unpkg.com/bootstrap-vue@latest/dist/bootstrap-vue',
        'campaignMonitor': 'https://js.createsend1.com/javascript/copypastesubscribeformlogic',
        // Dependencies for Map //
        'mousewheel' : 'https://cdnjs.cloudflare.com/ajax/libs/jquery-mousewheel/3.1.13/jquery.mousewheel.min',
        'mapplic' : 'https://preview-mmvue.codecloudapp.com/mapplic',
        'hammer' : 'https://codecloud.cdn.speedyrails.net/sites/59bac7db6e6f644f22ba0000/text/javascript/1484859750000/hammer.min',
        'mapplic-map' : 'https://mmvue.codecloudapp.com/mapplic.vue?noext',
        'loader': 'https://mmvue.codecloudapp.com/loader.vue?noext'
    }
});

require(["Vue", "vuex", "vue2-filters", "vue_router", "routes", "datastore", "vue-i18n", "locales", "jquery", "moment", "moment-timezone", "vue-moment", "vue-meta", "vuex-router-sync", "vue-social-sharing", "vue-select", "vue!search-component", "vue-simple-spinner", "vue!loader.vue", "vue!header.vue", "vue!footer.vue"], function (Vue, Vuex, Vue2Filters, VueRouter, appRoutes, store, VueI18n, messages, $, moment, tz, VueMoment, Meta, VuexRouterSync, SocialSharing, VueSelect, Spinner, Loader, HeaderComponent, FooterComponent) {

    Vue.use(Meta);
    Vue.use(VueRouter);
    Vue.use(Vue2Filters);
    Vue.use(VueI18n);
    Vue.use(SocialSharing);
    
    /* initialize router */
    const router = new VueRouter({
        mode: 'history',
        routes: appRoutes,
        scrollBehavior(to, from, savedPosition) {
            return {
                x: 0,
                y: 0
            }
        }
    });

    /* initialize i18n */
    const i18n = new VueI18n({
        locale: 'en-ca',
        fallbackLocale: 'en-ca',
        messages,
    });

    Vue.component('v-select', VueSelect.VueSelect);
    /* bootstrap app */
    const vm = new Vue({
        el: '#app',
        data: function() {
            return {
                dataLoaded: false,
                menu_items: [
                    {
                        name: "nav.directory",
                        id: "menu1",
                        href: "",
                        sub_menu: [
                            {
                                name: "nav.stores",
                                href: "/stores"
                            },
                            {
                                name: "nav.dine",
                                href: "/dine"
                            },
                            {
                                name: "nav.play",
                                href: "/play"
                            },
                            {
                                name: "nav.centre_map",
                                href: "/map"
                            }
                        ]
                    },
                    {
                        name: "nav.promos",
                        href: "/promotions",
                    },
                    {
                        name: "nav.events",
                        href: "/events",
                    },
                    {
                        name: "nav.programs",
                        id: "menu2",
                        href: "",
                        sub_menu: [
                            {
                                name: "nav.scoop",
                                href: "/southland-scoop"
                            },
                            {
                                name: "nav.kids_club",
                                href: "/kids-club"
                            }
                        ]
                    },
                    {
                        name: "nav.about",
                        id: "menu3",
                        href: "",
                        sub_menu: [
                            {
                                name: "nav.contact",
                                href: "/contact-us"
                            },
                            {
                                name: "nav.hours",
                                href: "/hours"
                            },
                            {
                                name: "nav.mall_info",
                                href: "/mall-information"
                            },
                            {
                                name: "nav.jobs",
                                href: "/jobs"
                            }
                        ]
                    }
                ],
                footer_menu_items: [
                    {
                        name: "Shop",
                        href: "/stores",
                    },
                    {
                        name: "Dine",
                        href: "/dine",
                    },
                    {
                        name: "Play",
                        href: "/play",
                    },
                    {
                        name: "Map",
                        href: "/map",
                    },
                    {
                        name: "Careers",
                        href: "/jobs",
                    },
                    {
                        name: "Hours",
                        href: "/hours",
                    },
                    {
                        name: "Contact",
                        href: "/contact-us",
                    }
                ],
                social_media: [
                    {
                        name: "Instagram",
                        url: "https://www.instagram.com",
                        iconClass: "fa fa-instagram instagram"
                    },
                    {
                        name: "Twitter",
                        url: "https://twitter.com/solandmall",
                        iconClass: "fa fa-twitter twitter"
                    },
                    {
                        name: "Facebook",
                        url: "https://www.facebook.com/southlandmallmiami",
                        iconClass: "fa fa-facebook-square facebook"
                    }
                ],
                search_result : null,
                suggestionAttribute: 'name'
            }
        },
        created() {
            this.loadData().then(response => {
                this.dataLoaded = true;
                this.locale = "en-ca";
            });
        },
        watch: {
            // watcher to update vue-i18n when the locale has been changed by the user
            locale: function(val, oldVal) {
                this.$i18n.locale = val;
                moment.locale(val);
            }
        },
        computed: {
            // computed property for locale which returns locale value from data store and also updates the data store with new locale information
            locale: {
                get() {
                    return this.$store.state.locale
                },
                set(value) {
                    this.$store.commit('SET_LOCALE', {
                        lang: value
                    })
                }
            },
            copyright_year() {
                return moment().year();
            },
            ...Vuex.mapGetters([
                'property',
                'timezone',
                'banners',
                'hours',
                'getTodayHours',
                'processedStores',
            ]),
            todays_hours() {
                return this.getTodayHours;
            },
            allStores() {
                return this.processedStores;
            }
        },
        methods: {
            loadData: async function() {
                try {
                    await this.$store.dispatch('initializeApi', { site: "southland", version: "v4" });
                    await Promise.all([this.$store.dispatch("getData", "property")]);
                    this.property.mm_host = this.property.mm_host.replace("http:", "");
                    let results = await Promise.all([this.$store.dispatch("INITIALIZE_LOCALE"), this.$store.dispatch("getData", "hours"), this.$store.dispatch("getData", "stores"), this.$store.dispatch("getData", "categories")]);
                    // await Promise.all([this.$store.dispatch("LOAD_META_DATA")]);
                    return results;
                } catch (e) {
                    console.log("Error loading data: " + e.message);
                }
            },
            // utility method to allow user to change locale value
            changeLocale: function(val) {
                this.locale = val; // this will update the data store, which in turn will trigger the watcher to update the locale in the system
                console.log("locale", this.locale);
            }
        },
        destroyed: function() {
            window.removeEventListener('scroll', this.enableStickyNavbar);
        },
        router: router,
        store,
        i18n
    });
});