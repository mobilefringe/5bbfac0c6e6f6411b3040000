<template>
    <header id="header" :class="{ 'nav-up': navUp }">
		<div class="site_container">
			<div class="header_logo">
				<div class="hidden_phone">
				    <div class="social_icons">
                        <span v-for="item in social_media">
                            <a :href="item.url" target="_blank">
                                <p class="accessibility">{{ item.name }}</p>
                                <i :class="item.iconClass" aria-hidden="true"></i>
                            </a>
                        </span>
                    </div>
                    <div class="header_hours">
                        <p v-if="todaysHours && !todaysHours.is_closed">Open Now: {{ todaysHours.open_time | moment("h a", timezone) }} - {{ todaysHours.close_time | moment("h a", timezone) }}</p>
                        <p v-else>Closed</p>
                    </div>
				</div>
				<div class="mobile_header">
				    <div class="property_logo center-block">
						<router-link to="/">
						    <img src="//codecloud.cdn.speedyrails.net/sites/5daf7e206e6f643cde010000/image/png/1539292470000/southland-mall-logo2-01-compressor.png" :alt="property.name + ' Logo'"/>
					    </router-link>
					</div>
			        <div id="menu-icon" @click="showMenu = !showMenu" :class="{ open: showMenu }" class="visible_phone hamburger">
        				<div class="hamburger__line">
        					<span class="hamburger__dots"></span>
        					<span class="hamburger__dots hamburger__dots--right"></span>
        					<span class="hamburger__dots"></span>
        				</div> 
        				<div class="hamburger__line">
        					<span class="hamburger__dots hamburger__dots--up"></span>
        					<span class="hamburger__dots"></span>
        					<span class="hamburger__dots hamburger__dots--down"></span>
        				</div>
        				<div class="hamburger__line">
        					<span class="hamburger__dots"></span>
        					<span class="hamburger__dots hamburger__dots--left"></span>
        					<span class="hamburger__dots"></span>
        				</div> 
        			</div>
				</div>
				<div class="hidden_phone">
				    <div class="header_search_container">
					    <search-component v-if="headerReady" :list="searchList" placeholder="Search" :suggestion-attribute="suggestionAttribute" :keys="keys" v-model="search_result" @select="onOptionSelect" :autocomplete="false" :minMatchCharLength="3" :tokenize="true" class="text-left">
                            <template slot="item" scope="option" class="manual">
                                <article class="media">
                                    <p>{{ option.data.name }}</p>
                                </article>
                            </template>
                        </search-component>
                    </div>
				</div>
			</div>
			<div class="row">
			    <div class="col-md-2 hidden_phone"></div>
				<div class="col-sm-12 col-md-8">
					<nav id="primary_nav" class="hidden_phone">
						<ul>
						    <li class="menu_item" v-for="item in menu_items" :id="item.id">
						        <router-link v-if="item.sub_menu == undefined" :to="item.href">{{$t(item.name)}}</router-link>
						        <span v-if="item.sub_menu != undefined">{{$t(item.name)}}</span>
						        <ul v-if="item.sub_menu">
						            <li v-for="sub_menu in item.sub_menu" class="dropdown_item">
						                <router-link :to="sub_menu.href">{{$t(sub_menu.name)}}</router-link>
						            </li>
								</ul>
						    </li>
						</ul>
					</nav>
				</div>
				<div class="nav_container visible_phone">
				    <transition name="custom-classes-transition" enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight">
					    <nav id="mobile_nav" v-show="showMenu" class="">
					        <hr class="menu_top_line">
					        <ul>
					            <li v-for="(item,key) in menu_items" class="menu_item">
							        <router-link :to="item.href" v-if="item.sub_menu == undefined">{{$t(item.name)}}</router-link>
							        <div v-else>
							            <b-card no-body class="mb-1">
                                            <b-card-header header-tag="header" class="p-1" role="tab">
                                                <b-btn block @click="item.show_sub_menu = !item.show_sub_menu" :class="item.show_sub_menu ? 'collapsed' : null" :aria-controls="$t(item.name)" :aria-expanded="item.show_sub_menu ? 'true' : 'false'">
                                                    {{$t(item.name)}}
                                                    <i v-if="item.show_sub_menu"  class="fa fa-minus"></i>
                                                    <i v-else  class="fa fa-plus"></i>
                                                </b-btn>
                                            </b-card-header>
                                            <b-collapse v-model="item.show_sub_menu" :id="$t(item.name)" :visible="item.show_sub_menu" :accordion="$t(item.name)" role="tabpanel" class="accordion_body">
                                                <b-card-body v-for="sub_menu in item.sub_menu">
                                                    <p class="card-text" @click="showMenu = !showMenu">
                                                        <router-link :to="sub_menu.href">{{$t(sub_menu.name)}}</router-link>
                                                    </p>
                                                </b-card-body>
                                            </b-collapse>
                                        </b-card>
							        </div>
							    </li>
					        </ul>
						    <div class="mobile_nav_content visible_phone">
                                <div class="mobile_address_container center">
                                    <hr>
                                    <a href="https://goo.gl/maps/RJ5dV8dxP1y" target="_blank">
                                        <p class="property_address">{{ property.address1 }},<br>{{ property.city }}, {{ property.province_state }}</p>
                                    </a>
                                    <a :href="'tel:' + property.contact_phone" >
                                        <h5>{{ property.contact_phone }}</h5>
                                    </a>
                                    <hr>
                                </div>
                                <div class="social_icons center">
                                    <span v-for="item in social_media">
                                        <a :href="item.url" target="_blank">
                                            <p class="accessibility">{{ item.name }}</p>
                                            <i :class="item.iconClass" aria-hidden="true"></i>
                                        </a>
                                    </span>
                                </div> 
							</div>
						</nav>
				    </transition>
				</div>
				<div class="col-md-2 hidden_phone"></div>
			</div>
		</div>
    </header>
</template>

<script>
    define(["Vue", "vuex", "moment", "moment-timezone", "vue_router", "routes", "bootstrap-vue", "google-translate"], function (Vue, Vuex, moment, tz, VueRouter, appRoutes, BootstrapVue, googleTranslate) {
        Vue.use(BootstrapVue);
        return Vue.component("header-component", {
            template: template, // the variable template will be injected,
            props:['menu_items', 'social_media'],
            data: function () {
                return {
                    scrolled: false,
                    navUp: false,
                    search_result: null,
                    suggestionAttribute: "name",
                    keys: ["name", "description", "tags", "store.name"],
                    headerReady: false,
                    showMenu: false,
                    showMobileMenu: false,
                    noScroll: false,
                    windowWidth: 0,
				    mobileScroll: false,
				    lastScrollTop: 0,
				    navUp: false,
				    m : false
                }
            },
            beforeRouteUpdate(to, from, next) {
                document.body.classList.remove("nav-up");
                this.navUp = false;
                next();
            },
            watch: {
                $route: function(to, from) {
                    document.body.classList.remove("nav-up");
                    this.navUp = false;

                    if (this.windowWidth <= 768) {
                        this.showMenu = false;
                    }  
                    _.forEach(this.menu_items, function(value, key) {
                        value.show_sub_menu = false;
                    });
                },
                showMenu: function() {
                    if(this.showMenu == true){
                        document.body.classList.add("no_scroll");
                        document.body.classList.remove("nav-up");
                        this.navUp = false;
                    } else if (this.showMenu == false) {
                        document.body.classList.remove("no_scroll");
                    }
                }
            },
            created() {
                this.loadData().then(response => {
                    this.headerReady = true;
                });
                this.$nextTick(function() {
                    window.addEventListener('resize', this.getWindowWidth);
                    this.getWindowWidth();
                });
            },
            mounted()
            {
                this.$nextTick(() => {
                    this.googleTranslateInit();
                });
        
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'getPropertyHours',
                    'getPropertyHolidayHours',
                    'getTodayHours',
                    'processedStores',
                    'processedEvents',
                    'processedPromos',
                    'processedJobs'
                ]),
                locale: {
                    get () {
                        return this.$store.state.locale
                    },
                    set (value) {
                        this.$store.commit('SET_LOCALE', { lang: value })
                    }
                },
                todaysHours() {
                    return this.getTodayHours;
                },
                searchList() {
                    var _this = this;
                    
                    var events = this.processedEvents;
                    var temp_events = [];
                    _.forEach(events, function (value, key) {
                        var today = moment.tz(_this.timezone).format();
                        var showOnWebDate = moment.tz(value.show_on_web_date, _this.timezone).format();
                        if (today >= showOnWebDate) {
                            if (_.includes(value.eventable_type, 'Property')) {
                                value.is_store = false;
                            } else {
                                value.is_store = true;    
                            }
                            temp_events.push(value);
                        }
                    });
                    events = temp_events;
                    
                    var promos = this.processedPromos;
                    var temp_promos = [];
                    _.forEach(promos, function (value, key) {
                        var today = moment.tz(_this.timezone).format();
                        var showOnWebDate = moment.tz(value.show_on_web_date, _this.timezone).format();
                        if (today >= showOnWebDate) {
                            if (_.includes(value.promotionable_type, 'Property')) {
                                value.is_store = false;
                            } else {
                                value.is_store = true;    
                            }
                            
                            temp_promos.push(value)
                        }
                    });
                    promos = temp_promos;

                    var jobs = this.processedJobs;
                    _.forEach(jobs, function (value, key) {
                        if (_.includes(value.jobable_type, 'Property')) {
                            value.is_store = false;
                        } else {
                            value.is_store = true;    
                        }
                    });

                    var stores = this.processedStores;
                    _.forEach(stores, function (value, key) {
                        value.is_store = true;    
                    });

                    var list = _.union( stores, events, promos, jobs );
                    return list
                },
            },
            methods: {
                googleTranslateInit: function() {
                    let checkIfGoogleLoaded = setInterval(() => {
                        if (google.translate.TranslateElement != null) {
                            clearInterval(checkIfGoogleLoaded);
                            this.googleTranslateElement('google_translate_element');
                        }
                    }, 100);
                },
                googleTranslateElement: function(id) {
                    new google.translate.TranslateElement({pageLanguage: 'en', includedLanguages: 'en,es', layout: google.translate.TranslateElement.InlineLayout.SIMPLE, gaTrack: true, gaId: 'UA-115200481-13'}, id);
                    var vm = this;
                    setTimeout(function(){
                        if (vm.windowWidth < 768){
                            vm.m = true;
                            $('#g_translater').detach().appendTo('#google_translate_element_m');                            
                        }
                    }, 1500);
                    
                },
                loadData: async function() {
                    try {
                        let results = await Promise.all([this.$store.dispatch("getData", "stores"), this.$store.dispatch("getData", "events"),this.$store.dispatch("getData", "promotions"),this.$store.dispatch("getData", "jobs")]);
                    } catch (e) {
                        console.log("Error loading data: " + e.message);    
                    }
                },
                changeLocale: function(val) {
                    // this will update the data store, which in turn will trigger the watcher to update the locale in the system
                    this.locale = val; 
                },
                getWindowWidth(event) {
                    this.windowWidth = window.innerWidth;
                    if (this.windowWidth < 768 && this.m == false){
                        m = true;
                        $('#g_translater').detach().appendTo('#google_translate_element_m');                            
                    } else if (this.windowWidth >= 768 && this.m == true){
                        m = false;
                        $('#g_translater').detach().prependTo('#desktopHeader');                            
                    }
                },
                onOptionSelect(option) {
                    this.$router.push({
                        name: "search-results",
                        query: { searchQuery: this.search_result },
                        params: { results: option }
                    });
                    this.$nextTick(function() {
                        this.search_result = "";
                    });
                },
                handleScroll () {
				    this.scrolled = window.pageYOffset > 100;
			    },
        		mobileDidScrolled () {
        		    if (!this.showMenu) {
    				    this.mobileScroll = window.pageYOffset > 0;
        				var _this = this;
        				// setTimeout(function() {
        					if (_this.mobileScroll) {
        						_this.mobileHasScrolled();
        						_this.mobileScroll = false;
        					}
        				// }, 150);
        		    }
        		},
    			mobileHasScrolled () {
    				// var lastScrollTop = 0;
    				var delta = 5;
    				var navbarHeight = document.getElementById("header").offsetHeight;
    				var st = $(window).scrollTop();
    
    				// If they scrolled down and are past the navbar, add class .nav-up.
    				// This is necessary so you never see what is "behind" the navbar.
    				if (st > this.lastScrollTop && st > navbarHeight){
    					// Scroll Down
    					this.navUp = true;
    				} else {
    					// Scroll Up
    					if(st + $(window).height() < $(document).height()) {
    						this.navUp = false;
    					}
    				}
    				
    				this.lastScrollTop = st;
    			},
		    },
    		beforeMount () {
    			window.addEventListener('resize', this.getWindowWidth);
    			window.addEventListener('scroll', this.handleScroll);
    			window.addEventListener('scroll', this.mobileDidScrolled);
    		},
    		beforeDestroy () {
    			window.addEventListener('resize', this.getWindowWidth);
    			window.removeEventListener('scroll', this.handleScroll);
    			window.removeEventListener('scroll', this.mobileDidScrolled);
    		}
        });
    });
</script>