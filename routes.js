define([], function() {
    return [
        {
            path: '/',
            component: view('home')
        },
        // {
        //     path: '/contest',
        //     component: view('default'),
        //     children: [{
        //         path: '',
        //         component: view('contest'),
        //         name: 'contestList'
        //     }]
        // },
        {
            path: '/contact-us',
            component: view('default'),
            children: [{
                path: '',
                component: view('contact_us'),
                name: 'contactUs'
            }]
        },
        {
            path: '/dine',
            component: view('default'),
            children: [{
                    path: '',
                    component: view('dine'),
                    name: 'dineList'
                }
            ]
        },
        {
            path: '/events',
            component: view('default'),
            children: [
                {
                    path: '',
                    component: view('events'),
                    name: 'eventList'
                },
                {
                    path: ':id',
                    component: view('event_details'),
                    name: 'eventDetails',
                    props: true
                }
            ]
        },
        {
            path: '/hours',
            component: view('default'),
            children: [
                {
                    path: '',
                    component: view('hours'),
                    name: 'hourList',
                }
            ]
        },
        {
            path: '/jobs',
            component: view('default'),
            children: [
                {
                    path: '',
                    component: view('jobs'),
                    name: 'jobList'
                },
                {
                    path: ':id',
                    component: view('job_details'),
                    name: 'jobDetails',
                    props: true
                }
            ]
        },
        {
            path: '/kids-club',
            component: view('default'),
            children: [
                {
                    path: '',
                    component: view('kids_club'),
                    name: 'kidsClub'
                }    
            ]
        },
        {
            path: '/mall-information',
            component: view('default'),
            children: [
                {
                    path: '',
                    component: view('mall_info'),
                    name: 'mallInfo'
                }
            ]
        },
        {
            path: '/map',
            component: view('default'),
            children: [
                {
                    path: '',
                    component: view('map'),
                    name: 'map'
                }
            ]
        },
        // {
        //     path: '/newsletter',
        //     component: view('default'),
        //     children: [{
        //         path: '',
        //         component: view('newsletter'),
        //         name: 'newsletter',
        //         props: true
        //     }]
        // },
        {
            path: '/pages',
            component: view('default'),
            children: [{
                path: ':id',
                component: view('page_details'),
                name: 'pageDetails',
                props: true
            }]
        },
        {
            path: '/play',
            component: view('default'),
            children: [
                {
                    path: '',
                    component: view('play'),
                    name: 'playList'
                }
            ]
        },
        {
            path: '/promotions',
            component: view('default'),
            children: [
                {
                    path: '',
                    component: view('promotions'),
                    name: 'promoList'
                },
                {
                    path: ':id',
                    component: view('promotion_details'),
                    name: 'promotionDetails',
                    props: true

                }
            ]
        },
        {
            path: '/search-results',
            component: view('default'),
            children: [
                {
                    path: '',
                    component: view('search_results'),
                    meta: {
                        pageName: 'Search Results',
                    },
                    name: 'search-results'
                }
            ]
        },
        {
            path: '/stores',
            component: view('default'),
            children: [
                {
                    path: '',
                    component: view('stores'),
                    name: 'storeList'
                },
                {
                    path: ':id',
                    component: view('store_details'),
                    name: 'storeDetails',
                    props: true
                }
            ]
        },
        {
            path: '/southland-scoop',
            component: view('default'),
            children: [
                {
                    path: '',
                    component: view('scoop'),
                    name: 'scoop'
                }
            ]
        },
        // {
        //     path: '/thank-you',
        //     component: view('default'),
        //     children: [
        //         {
        //             path: '',
        //             component: view('thank_you'),
        //             name: 'thankYou'
        //         }
        //     ]
        // },
        {
            path: '*',
            redirect: '/'
        }
    ]

    /**
     * Asynchronously load view (lazy-loading)
     * @param {string} name the filename (basename) of the view to load.
     */
    function view(name) {
        return function(resolve) {
            require(['vue!' + name + '.vue'], resolve);
        }
    };
});