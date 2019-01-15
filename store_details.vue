<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loader v-if="!dataLoaded"></loader>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <div class="page_header" v-if="pageBanner" v-bind:style="{ backgroundImage: 'url(' + pageBanner.image_url + ')' }">
        			<div class="site_container">
        				<div class="header_content caps">
        					<h1>{{ pageCategory }}</h1>
        				</div>
        			</div>
        		</div>
        		<div class="margin_60"></div>
                <div v-if="dataLoaded" v-cloak class="site_container">
                    <div class="row">
                        <div class="col-md-8">
                            <div class="details_store_name">
                                <h2>{{ currentStore.name }}</h2>
                                <p v-if="storeCategory" class="store_category">{{ storeCategory }}</p>
                                <h3 v-if="currentStore.phone" class="hidden_phone store_phone"><i class="fa fa-phone"></i><span>{{ currentStore.phone }}</span></h3>
                                <div class="hidden_phone">
                                    <a v-if="currentStore.website" :href="currentStore.website" target="_blank">
                                        <div class="store_website animated_btn caps">{{ $t("stores_page.store_website") }}</div>
                                    </a>
                                    <router-link to="/map">
                                        <div class="store_website animated_btn caps">{{ $t("stores_page.view_map") }}</div>
                                    </router-link>
                                </div>
                            </div>
                            <div class="visible_phone details_store_btn center">
                                <div class="btn_container">
                                    <a v-if="currentStore.website" :href="currentStore.website" target="_blank">
                                        <div class="store_website animated_btn caps">{{ $t("stores_page.store_website") }}</div>
                                    </a>
                                    <router-link to="/map">
                                        <div class="store_website animated_btn caps">{{ $t("stores_page.view_map") }}</div>
                                    </router-link>
                                </div>
                                <h3 v-if="currentStore.phone" class="store_phone"><i class="fa fa-phone"></i><span><a :href="'tel' + currentStore.phone">{{ currentStore.phone }}</a></span></h3>
                            </div>
                        </div>
                        <div class="col-md-4">
            				<div class="details_store_image">
            				    <div v-if="currentStore.no_logo" class="store_details_image center-block">
                                    <div class="no_logo">
                                        <p class="store_details_name">{{ currentStore.name }}</p>
                                    </div>    
                                </div>
                                <img v-else class="store_details_image center-block" :src="currentStore.store_front_url_abs" :alt="currentStore.name + ' Logo'" />
            				</div>
            			</div>
            		</div>
            		<div class="row">
                        <div class="col-md-5">
            				<div class="details_store_hours">
            				    <h4 class="details_store_title caps">{{ $t("stores_page.store_hours") }}</h4> 
            				    <ul v-if="storeHours" class="details_store_hours_list">
                                    <li v-for="hour in storeHours" :class="{ today: hour.todays_hours }">
                                        <div v-if="!hour.is_closed">
                                            <span class="hours_list_day">{{hour.day_of_week | moment("dddd", timezone)}} </span>{{hour.open_time | moment("h:mma", timezone)}} - {{hour.close_time | moment("h:mma", timezone)}}
                                        </div>
                                        <div v-else>
                                            <span class="hours_list_day">{{hour.day_of_week | moment("dddd", timezone)}} </span>CLOSED
                                        </div>
                                    </li>
                                </ul>
            				</div>
            			</div>
            			<div class="col-md-7">
            				<div class="details_store_desc">
            				    <h4 class="details_store_title caps">{{ currentStore.name }}</h4>
            				    <div v-html="currentStore.description"></div>
            				</div>
            			</div>
                    </div>
                    <div class="details_store_promo">
                        <div class="promo_container" v-if="storePromotions" v-for="promo in storePromotions" :key="promo.id">
    					    <div class="promo_img" v-lazy:background-image="promo.image_url"></div>
    					    <div class="promo_content">
    					        <p class="promo_title" v-if="promo.store">{{ promo.store.name }}</p>
    					        <p class="promo_title" v-else>{{ property.name }}</p>
    					        <h3 class="center caps" >{{ promo.name_short }}</h3>
    							<router-link :to="'/promotions/'+ promo.slug">
    							   <div class="promo_learn_more animated_btn">{{ $t("promos_page.read_more") }}</div>
    						    </router-link>
    					    </div>
    					</div>
                    </div>
    		    </div>
    		</div>
		</transition>
	</div>
</template>

<script>
    define(['Vue', 'vuex', 'moment', 'vue-lazy-load'], function(Vue, Vuex, moment, VueLazyload) {
        Vue.use(VueLazyload);
        return Vue.component("store-details-component", {
            template: template, // the variable template will be injected,
            props:['locale'],
            data: function() {
                return {
                    dataLoaded: false,
                    pageBanner: null,
                    currentStore: null,
                    storeHours: {},
                    storePromotions: {}
                }
            },
            props:['id'],
            beforeRouteUpdate(to, from, next) {
                this.updateCurrentStore(to.params.id);
                next();
            },
            created (){
                this.loadData().then(response => {
                    var temp_repo = this.findRepoByName('Shop Banner');
                    if(temp_repo) {
                        try {
                            this.pageBanner = temp_repo.images[0];
                        } catch(e) {
                            
                        }
                    } else {
                        this.pageBanner = { "image_url": "https://via.placeholder.com/1920x300" }
                    }
                    
                    this.updateCurrentStore(this.id);
                    this.dataLoaded = true;
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'findRepoByName',
                    'processedStores',
                    'findStoreBySlug',
                    'findCategoryById',
                    'findHourById',
                    'findPromoById'
                ]),
                pageCategory() {
                    var pageCategory = this.currentStore.categories[1];
                    category = this.findCategoryById(pageCategory)
                    return category.name
                },
                storeCategory() {
                    var currentStoreCategory = this.currentStore.categories[0];
                    category = this.findCategoryById(currentStoreCategory)
                    return category.name
                }
            },
            methods: {
                loadData: async function() {
                    try {
                        let results = await Promise.all([this.$store.dispatch("getData", "repos"), this.$store.dispatch("getData", "categories")]);
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
                updateCurrentStore (id) {
                    this.currentStore = this.findStoreBySlug(id);
                    if (this.currentStore === null || this.currentStore === undefined){
                        this.$router.replace({ path: '/'});
                    } else {
                        var vm = this;
                        // STORE LOGO
                        if (_.includes(this.currentStore.store_front_url_abs, 'missing')) {
                            this.currentStore.no_logo = true
                        } else {
                            this.currentStore.no_logo = false
                        }
                        // STORE WEBSITE 
                        if (this.currentStore.website) {
                            this.currentStore.website = "http://" + this.currentStore.website
                        }
                        // STORE HOURS
                        var storeHours = [];
                        _.forEach(this.currentStore.store_hours, function (value, key) {
                            hours = vm.findHourById(value)
                            today = moment().day();
                            if( today == hours.day_of_week ){
                                hours.todays_hours = true;
                            } else {
                                hours.todays_hours = false;
                            }
                            storeHours.push(hours);
                        });
                        this.storeHours = _.sortBy(storeHours, function(o) { return o.day_of_week });
                        // PROMOTIONS
                        var temp_promo = [];
                        var promos = this.currentStore.promotions;
                        _.forEach(promos, function(value, key) {
                            var current_promo = vm.findPromoById(value);
                            if (_.includes(current_promo.image_url, 'missing')) {
                                current_promo.image_url = "https://placehold.it/1560x800/757575";
                            }
                            
                            current_promo.name_short = _.truncate(current_promo.name, { 'length': 21, 'separator': ' ' });
                            current_promo.name_short_2 = _.truncate(current_promo.name_2, { 'length': 21, 'separator': ' ' });
    
                            temp_promo.push(current_promo);
                        }); 
                        this.storePromotions = temp_promo;
                    }
                }
            }
        });
    });
</script>