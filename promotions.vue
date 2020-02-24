<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loader v-if="!dataLoaded"></loader>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
        		<div class="page_header" v-if="pageBanner" v-bind:style="{ background: '#000 url(' + pageBanner.image_url + ')' }">
        			<div class="site_container">
        				<div class="header_content caps">
        					<h1 class="banner-content">{{ $t("promos_page.promos_header") }}</h1>
        				</div>
        			</div>
        		</div>
        		<div class="site_container page_content">
        		    <transition-group name="list" tag="div">
    					<div class="promo_container" v-if="promos.length > 0" v-for="promo in promos" :key="promo.id">
    					    <div class="promo_img" v-if="locale=='en-ca'" v-lazy:background-image="promo.image_url"></div>
    					    <div class="promo_img" v-else v-lazy:background-image="promo.promo_image2_url_abs"></div>
    					    <div class="promo_content">
    					        <p class="promo_title" v-if="promo.store">{{ promo.store.name }}</p>
    					        <p class="promo_title" v-else>{{ property.name }}</p>
    					        <div class="center caps h3" v-if="locale=='en-ca'">{{ promo.name_short }}</div>
    							<div class="center caps h3" v-else>{{ promo.name_short_2 }}</div>
    							<router-link :to="'/promotions/'+ promo.slug">
    							   <div class="promo_learn_more animated_btn">{{ $t("promos_page.read_more") }}</div>
    						    </router-link>
    					    </div>
    					</div>
    					
    				</transition-group>
        			<div class="row" v-if="promos.length > 0">
                        <div class="col-md-12">
                            <button class="animated_btn promo_load_more" v-if="!noMorePromos" @click="handleButton">Load More</button>
                            <p v-if="noPromos">{{$t("promos_page.no_more_promo_message")}}</p>
                        </div>
                    </div>
                    <div v-else>
                        <div class="row">
                            <div class="col-md-12">
                                <p>{{$t("promos_page.no_promo_message")}}</p>    
                            </div>
                        </div>
                    </div>
        		</div>
	        </div>
	    </transition>
	</div>
</template>

<script>
    define(['Vue', 'vuex', "moment", "moment-timezone", 'vue-lazy-load'], function(Vue, Vuex, moment, tz, VueLazyload) {
        Vue.use(VueLazyload);
        return Vue.component("promos-component", {
            template: template, // the variable template will be injected
            props:['locale'],
            data: function() {
                return {
                    dataLoaded: false,
                    pageBanner: null,
                    promos: [],
                    morePromos: [],
                    morePromosFetched: false,
                    noMorePromos: false,
                    noPromos: false
                }
            },
            created() {
                this.loadData().then(response => {
                    var temp_repo = this.findRepoByName('Promotions Banner');
                    if (temp_repo) {
                        try {
                            this.pageBanner = temp_repo.images[0];
                        } catch(e) {
                            
                        }
                    } else {
                        this.pageBanner = { "image_url": "https://via.placeholder.com/1920x300" }
                    }

                    this.handleButton();
                    this.dataLoaded = true;
                });
                
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'findRepoByName',
                    'processedPromos'
                ]),
                promotions() {
                    var vm = this;
                    var temp_promo = [];
                    var temp_job = [];
                    _.forEach(this.processedPromos, function(value, key) {
                        var today = moment.tz(this.timezone).format();
                        var showOnWebDate = moment.tz(value.show_on_web_date, this.timezone).format();
                        if (today >= showOnWebDate) {
                            value.name_short = _.truncate(value.name, { 'length': 30, 'separator': ' ' });
                            value.name_short_2 = _.truncate(value.name_2, { 'length': 30, 'separator': ' ' });
                            value.description_short = _.truncate(value.description, { 'length': 60, 'separator': ' ' });
                            value.description_short_2 = _.truncate(value.description_2, { 'length': 60, 'separator': ' ' });
    
                            if (_.includes(value.image_url, 'missing')) {
                                value.image_url = "//codecloud.cdn.speedyrails.net/sites/5daf7e206e6f643cde010000/image/png/1546551307522/eventplaceholder2@2x.png";
                            }
                            if (_.includes(value.promo_image2_url_abs, 'missing')) {
                                value.promo_image2_url_abs = "//codecloud.cdn.speedyrails.net/sites/5daf7e206e6f643cde010000/image/png/1546551307522/eventplaceholder2@2x.png";
                            }
                            
                            temp_promo.push(value);
                        }
                    });
                    _.sortBy(temp_promo, [function(o) { return o.start_date; }]);
                    return temp_promo;
                },
            },
            methods: {
                loadData: async function() {
                    try {
                        let results = await Promise.all([this.$store.dispatch("getData", "repos"), this.$store.dispatch("getData", "promotions")]);
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
                handleButton: function () {
                    if(!this.morePromosFetched){
                        this.morePromos = this.promotions;
                        this.promos = this.morePromos.splice(0, 3);
                        this.morePromosFetched = true;
                    } else {
                        var nextPromos = this.morePromos.splice(0, 3);
                        // Add 3 more posts to posts array
                        var vm = this;
                        _.forEach(nextPromos, function(value, key) {
                            vm.promos.push(value);
                        });
                    }
                    if(this.promotions.length === 0){
                        this.noMorePromos = true
                        this.noPromos = true
                    } else {

                    }
                }
            }
        });
    });
</script>