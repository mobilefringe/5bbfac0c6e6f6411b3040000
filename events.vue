<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loader v-if="!dataLoaded"></loader>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
        		<div class="page_header" v-if="pageBanner" v-bind:style="{ backgroundImage: 'url(' + pageBanner.image_url + ')' }">
        			<div class="site_container">
        				<div class="header_content caps">
        					<h1>{{ $t("events_page.events_header") }}</h1>
        				</div>
        			</div>
        		</div>
        		<div class="site_container page_content">
        		    <transition-group name="list" tag="div">
    					<div class="promo_container" v-if="events.length > 0" v-for="promo in events" :key="promo.id">
    					    <div class="promo_img" v-if="locale=='en-ca'" v-lazy:background-image="promo.image_url"></div>
    					    <div class="promo_img" v-else v-lazy:background-image="promo.promo_image2_url_abs"></div>
    					    <div class="promo_content">
    					        <p class="promo_title">
    					            <span v-if="isMultiDay(promo)">{{ promo.start_date | moment("MMM D", timezone)}} - {{ promo.end_date | moment("MMM D", timezone)}}</span>
    					            <span v-else>{{ promo.start_date | moment("MMM D", timezone)}}</span>
    					        </p>
    					        <h3 class="center caps" v-if="locale=='en-ca'">{{ promo.name_short }}</h3>
    							<h3 class="center caps" v-else>{{ promo.name_short_2 }}</h3>
    							<router-link :to="'/events/'+ promo.slug">
    							   <div class="promo_learn_more animated_btn">{{ $t("events_page.read_more") }}</div>
    						    </router-link>
    					    </div>
    					</div>
    					<div v-else class="blah">
                            <div class="row">
                                <div class="col-md-12">
                                    <p>{{$t("events_page.no_event_message")}}</p>    
                                </div>
                            </div>
                        </div>
    				</transition-group>
        			<div class="row" v-if="events.length > 0">
                        <div class="col-md-12">
                            <button class="animated_btn promo_load_more" v-if="!noMoreEvents" @click="handleButton">Load More</button>
                            <p v-if="noEvents">{{$t("events_page.no_more_event_message")}}</p>
                        </div>
                    </div>
        		</div>
	        </div>
	    </transition>
	</div>
</template>

<script>
    define(["Vue", "vuex", "moment", "moment-timezone", "vue-lazy-load"], function(Vue, Vuex, moment, tz, VueLazyload) {
        Vue.use(VueLazyload);
        return Vue.component("events-component", {
            template: template, // the variable template will be injected
            props:['locale'],
            data: function() {
                return {
                    dataLoaded: false,
                    pageBanner: null,
                    events: [],
                    moreEvents: [],
                    moreEventsFetched: false,
                    noMoreEvents: false,
                    noEvents: false
                }
            },
            created() {
                this.loadData().then(response => {
                    var temp_repo = this.findRepoByName('Events Banner');
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
                    'timezone',
                    'findRepoByName',
                    'processedEvents'
                ]),
                eventList() {
                    var vm = this;
                    var temp_event = [];
                    var temp_job = [];
                    _.forEach(this.processedEvents, function(value, key) {
                        var today = moment.tz(this.timezone).format();
                        var showOnWebDate = moment.tz(value.show_on_web_date, this.timezone).format();
                        if (today >= showOnWebDate) {
                            value.name_short = _.truncate(value.name, { 'length': 21, 'separator': ' ' });
                            value.name_short_2 = _.truncate(value.name_2, { 'length': 21, 'separator': ' ' });
                            value.description_short = _.truncate(value.description, { 'length': 60, 'separator': ' ' });
                            value.description_short_2 = _.truncate(value.description_2, { 'length': 60, 'separator': ' ' });
    
                            if (_.includes(value.image_url, 'missing')) {
                                value.image_url = "//codecloud.cdn.speedyrails.net/sites/5bbfac0c6e6f6411b3040000/image/png/1546551307522/eventplaceholder2@2x.png";
                            }
                            if (_.includes(value.event_image2_url_abs, 'missing')) {
                                value.event_image2_url_abs = "//codecloud.cdn.speedyrails.net/sites/5bbfac0c6e6f6411b3040000/image/png/1546551307522/eventplaceholder2@2x.png";
                            }
                            
                            temp_event.push(value);
                        }
                    });
                    _.sortBy(temp_event, [function(o) { return o.start_date; }]);
                    return temp_event;
                },
            },
            methods: {
                loadData: async function() {
                    try {
                        let results = await Promise.all([this.$store.dispatch("getData", "repos"), this.$store.dispatch("getData", "events")]);
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
                isMultiDay(promo) {
                    var timezone = this.timezone
                    var start_date = moment(promo.start_date).tz(timezone).format("MM-DD-YYYY");
                    var end_date = moment(promo.end_date).tz(timezone).format("MM-DD-YYYY");
                    if (start_date === end_date) {
                        return false
                    } else {
                        return true
                    }
                },
                handleButton: function () {
                    if(!this.moreEventsFetched){
                        this.moreEvents = this.eventList;
                        this.events = this.moreEvents.splice(0, 3);
                        this.moreEventsFetched = true;
                    } else {
                        var nextEvents = this.moreEvents.splice(0, 3);
                        // Add 3 more posts to posts array
                        var vm = this;
                        _.forEach(nextEvents, function(value, key) {
                            vm.events.push(value);
                        });
                    }
                    if(this.eventList.length === 0){
                        this.noMoreEvents = true
                        this.noEvents = true
                    } else {

                    }
                }
            }
        });
    });
</script>