<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loader v-if="!dataLoaded"></loader>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
        		<div class="banner_div">
        			<div class="home_banner_container">
        				<slick ref="slick" :options="slickOptions">
        					<div class="" v-for="banner in banners" v-if="banners" tabindex="-1">
        						<div class="home_banner" v-bind:style="{ background: '#000 url(' + banner.image_url + ')' }">
        						    <div class="home_banner_content" v-if="banner.name && banner.description">
        						        <h1>{{ banner.name }}</h1>
        						        <h2>{{ banner.description }}</h2>
        						    </div>   
        						</div>
        					</div>
        				</slick>
        			</div>
        		</div>
        		<div class="site_container">
        		    <div class="visible_phone">
        		        <div class="hours_container home_hours margin_top_30">
                            <div class="center caps h5" v-if="hour.is_open" v-for="hour in todaysHours">{{ property.name }} is open today:</div>
        		            <div class="center caps h5" v-else>{{ property.name }} is</div>
                            <div class="center caps h3" v-if="hour.is_open" v-for="hour in todaysHours">{{hour.open_time | moment("h a", timezone)}} - {{hour.close_time | moment("h a", timezone)}}</div>
                            <div class="center caps h3" v-else>Closed</div>
                        </div>
        		        <div class="home_page_title_container">
            		        <div class="home_page_subtitle center caps h5">Discover {{ property.name }}</div>
            		        <div class="home_page_title caps h3">Find Your Store</div>
            		    </div>
            		    <div class="margin_30">
                            <div class="map_search_container">
                                <search-component v-model="storeSearch" :list="processedStores" :suggestion-attribute="suggestionAttribute" @select="onOptionSelect" :placeholder="$t('stores_page.find_your_store')">
                                    <template slot="item" scope="option">
                                        <article class="media"><p>{{ option.data.name }}</p></article>
                                    </template>
                                </search-component>
                                <i id="store_search_icon" class="fa fa-search" aria-hidden="true"></i>
                            </div>
                        </div>
                        <mapplic-map ref="mapplic_ref" :height="556" :minimap= "false" :deeplinking="false" :sidebar="false" :hovertip="true" :maxscale= "5" :storelist="allStores" :floorlist="floorList" tooltiplabel="View Store Details"></mapplic-map>
        		    </div>
        		    <div class="home_page_title_container">
        		        <div class="home_page_subtitle center caps h5">Discover {{ property.name }}</div>
        		        <div class="home_page_title caps h3">What's Happening</div>
        		    </div>
        		    <div v-masonry transition-duration="0.3s" item-selector=".grid-item" > <!-- class="hidden_phone" -->
                        <div v-masonry-tile class="item">
                            <div v-for="feature in feature_items" :class="'grid-item ' + feature.masonry_class ">
                        	    <div v-if="feature.name" class="feature_item_container">
                        			<img :src="feature.image_url" alt="">
                        			<div class="feature_item_info" >
                        				<div class="feature_item_content">
                        					<!--<p v-if="feature.description">{{ feature.name }}</p>-->
                        					<div class="h3">{{ feature.name }}</div>
                        					<a class="feature_item_link" :href="feature.url">
                        					    <div class="feature_item_more animated_btn" :aria-label="feature.name">View Details</div>
                        					</a>
                        				</div>
                        			</div>
                        	    </div>
                        	    <div v-else class="feature_item_container">
                        	        <a :href="feature.url">
                            			<img :src="feature.image_url" :alt="feature.name">
                            			<div class="feature_item_info"></div>
                            		</a>
                        	    </div>
                            </div>
                        </div>
                    </div>
                    <div class="home_page_title_container">
        		        <div class="home_page_subtitle center caps h5">Programs</div>
        		        <div class="home_page_title second caps h3">Kids Club & Southland Scoop</div>
        		    </div>
        		    <div class="row">
        		        <div v-for="feature in programs" class="col-sm-6">
        		            <div class="feature_item_container programs" :class="feature.program_class">
                    			<div class="feature_item_info">
                    				<div class="feature_item_content">
                    					<p>{{ feature.name }}</p>
                    					<div class"h3">{{ feature.description }}</div>
                    					<a :href="feature.url" :aria-label="feature.name">
                        					<div class="feature_item_more animated_btn">View Details</div>
                        				</a>
                    				</div>
                    			</div>
                    	    </div>
        		        </div>
        		    </div>
        		</div>
        	</div>
        </transition>    		
	</div>
</template>

<script>
    define(["Vue", "vuex", "vue-meta", "vue!vue-slick", "js-cookie", "masonry", "vue-masonry-plugin", "vue!mapplic-map", "moment", "moment-timezone"], function(Vue, Vuex, Meta, slick, Cookies, masonry, VueMasonryPlugin, MapplicComponent, moment, tz) {
        Vue.use(VueMasonryPlugin.default);
        return Vue.component("home-component", {
            template: template, // the variable template will be injected
            props:['locale'],
            head: {
                // To use "this" in the component, it is necessary to return the object through a function
                title: function () {
                  return {
                    inner: this.meta.meta_title,
                    separator: ' ', // Leave empty separator
                    complement: ' ' // Leave empty complement
                  }
                },
                meta: function () {
                  return [
                     { name: 'description', id: 'description', content: this.meta.meta_description },
                     { name: 'keywords',  id: 'keywords', content: this.meta.meta_keywords },
                     { property: 'og:title', id: 'og:title', content: this.meta.meta_title },
                     { property: 'og:description', id: 'og:description', content: this.meta.meta_description }
                  ]
                }
            },
            data: function() {
                return {
                    dataLoaded: false,
                    meta: {
                        meta_title: "",
                        meta_description: "",
                        meta_keywords: "",
                        meta_image: ""
                    },
                    show_popup: false,
                    popup: null,
                    slickOptions: {
                        arrows: false,
                        autoplay: true,
                        autoplaySpeed: 3000,
                        cssEase: 'linear',
                        dots: true,
                        fade: true,
                        infinite: true,
                        slidesToShow: 1,
                        speed: 1200
                    },
                    suggestionAttribute: "name",
                    storeSearch: null,
                }
            },
            created () {
                this.loadData().then(response => {
                    // this.popup = this.$store.state.popups[0];
                    
                    this.meta = this.findMetaDataByPath(this.$route.path);
                    
                    this.dataLoaded = true;
                    this.$emit('updateHead');
                });
            },
            watch : {
                dataLoaded () {
                    var viewed = Cookies.get('popup_viewed');
                    if(this.popup !== null && viewed !== "true") {
                        Cookies.set('popup_viewed', "true");
                        viewed = Cookies.get('popup_viewed');
                        this.show_popup = true;
                        this.popup.image_url = "//assets.mallmaverick.com" + this.popup.photo_url;
                        document.getElementById('popup_backdrop').style.display = "block";
                    } else {
                        document.getElementById('popup_backdrop').style.display = "none";
                    }
                }
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'findMetaDataByPath',
                    'getPropertyHours',
                    'getPropertyHolidayHours',
                    'processedStores'
                ]),
                banners () {
                    var banners = [];//this.$store.state.banners;
                    _.forEach(this.$store.state.banners, function(value, key) {
                        var today = new Date();
                        var start = new Date (value.start_date);
                        if (start <= today){
                            if (value.end_date){
                                var end = new Date (value.end_date);
                                if (end >= today){
                                    banners.push(value);  
                                }
                            } else {
                                banners.push(value);
                            }
                        }
                    })
                    return _.orderBy(banners, ['position'], ['asc']);
                },
                feature_items () {
                    var features = _.slice(this.$store.state.feature_items, 0, 6);
                    _.forEach(features, function(value, key) {
                        if ( _.includes([1], key) ) {
                            value.masonry_class = "grid-item--width2";
                        } else if ( _.includes([2], key) ){
                            value.masonry_class = "grid-item--width2";
                        } else if ( _.includes([3], key) ){
                            value.masonry_class = "grid-item--height2";
                        } else {
                            value.masonry_class = " ";
                        }
                    });
                    return features;
                },
                programs () {
                    var features = _.slice(this.$store.state.feature_items, 6, 8); 
                    _.forEach(features, function(value, key) {
                        if ( _.includes([1], key)) {
                            value.program_class = "last";
                        }
                    });
                    return features
                },
                // mobile_feature_items () {
                //     var features = _.slice(this.$store.state.feature_items, 0, 6);
                //     _.forEach(features, function(value, key) {
                //         if ( _.includes([1], key) ) {
                //             value.masonry_class = "grid-item--width2";
                //             value.text_class = " ";
                //             value.border = " ";
                //         } else if ( _.includes([2], key) ){
                //             value.masonry_class = "grid-item--width2";
                //             value.text_class = "add_black";
                //             value.border = " ";
                //         } else if ( _.includes([3], key) ){
                //             value.masonry_class = "grid-item--height2";
                //             value.text_class = " ";
                //             value.border = " ";
                //         } else if ( _.includes([4], key) ){
                //             value.text_class = " ";
                //             value.border = "full_border";
                //         } else if ( _.includes([5], key) ){
                //             value.text_class = "add_black";
                //             value.border = " ";
                //             value.last_item = true;
                //         } else {
                //             value.masonry_class = " ";
                //             value.text_class = " ";
                //             value.border = " ";
                //             value.last_item = false;
                //         }
                //     });
                //     features = _.sortBy(features, [function(o) { return o.mobile_order; }]);
                //     return features;
                // }
                allStores() {
                    var all_stores = this.processedStores;
                    _.forEach(all_stores, function(value, key) {
                        value.zoom = 2;
                    });
                    var initZoom = {};
                    initZoom.svgmap_region = "init";
                    initZoom.z_coordinate = 1;
                    initZoom.x = 0.5;
                    initZoom.y = 0.5;
                    initZoom.zoom = 1;
                    all_stores.push(initZoom)
                    return all_stores
                },
                getSVGMap() {
                    var mapURL = "https://assets.mallmaverick.com" + this.property.svgmap_url.split("?")[0];
                    return mapURL
                },
                floorList() {
                    var floor_list = [];
                    var floor_1 = {};
                    floor_1.id = "first-floor";
                    floor_1.title = "Level One";
                    floor_1.map = this.getSVGMap;
                    floor_1.z_index = 1;
                    floor_1.show = true;
                    floor_list.push(floor_1);
                    return floor_list;
                },
                todaysHours() {
                    var timezone = this.timezone
                    var regHours = this.getPropertyHours;
                    var holHours = this.getPropertyHolidayHours;
                    var hours = [];
                    // First check if there is a holiday today
                    _.forEach(holHours, function(value) {
                        var today = moment().format("YYYY-MM-DD");
                        var holiday_date = moment(value.holiday_date).tz(timezone).format("YYYY-MM-DD");
                        if (today == holiday_date) {
                            if (value.is_closed) {
                                value.is_open = false;
                            } else {
                                value.is_open = true;
                            }
                            hours.push(value);
                        }
                    });
                    // If there is no holiday today, check for today's hours
                    if (hours.length > 0) {
                        return hours;
                    } else {
                        _.forEach(regHours, function(value) {  
                            var today = moment().day();
                            if ( today == value.day_of_week ) {
                                var time = moment().tz(timezone).format('HH:mm');
                                var opens = moment(value.open_time).tz(timezone).format('HH:mm');
                                var closes = moment(value.close_time).tz(timezone).format('HH:mm');
                                if (time > opens && time < closes) {
                                    value.is_open = true;
                                } else {
                                    value.is_open = false;
                                }
                                hours.push(value);
                            }         
                        });
                        return hours;
                    }
                },
            },
            methods: {
                loadData: async function() {
                    try {
                        let results = await Promise.all([this.$store.dispatch("getData", "banners"), this.$store.dispatch("getData", "feature_items"), this.$store.dispatch("getData", "popups")]);
                        return results;
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
                onOptionSelect(option) {
                    this.$nextTick(function() {
                        this.storeSearch = ""
                    });
                    this.$refs.mapplic_ref.showLocation(option.svgmap_region);
                },
            },
            /*metaInfo () {
                return {
                    title: this.meta.meta_title,
                    meta: [
                        { name: 'description', vmid: 'description', content: this.meta.meta_description },
                        { name: 'keywords',  vmid: 'keywords', content: this.meta.meta_keywords },
                        { property: 'og:title', vmid: 'og:title', content: this.meta.meta_title },
                        { property: 'og:description', vmid: 'og:description', content: this.meta.meta_description },
                        { property: 'og:image', vmid: 'og:image', content: this.meta.meta_image }
                    ]
                }
            }*/
        })
    })
</script>