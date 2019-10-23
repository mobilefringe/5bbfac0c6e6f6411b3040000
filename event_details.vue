<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loader v-if="!dataLoaded"></loader>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
        		<div class="page_header" v-if="pageBanner" v-bind:style="{ background: '#000 url(' + pageBanner.image_url + ')' }">
        			<div class="site_container">
        				<div class="header_content caps">
        					<h1>{{ $t("events_page.events_header") }}</h1>
        				</div>
        			</div>
        		</div>
        		<div class="site_container page_content">
        		    <div class="promo_container promo_details_container" v-if="currentEvent">
					    <div class="promo_img" v-if="locale=='en-ca'" v-lazy:background-image="currentEvent.image_url"></div>
					    <div class="promo_img" v-else v-lazy:background-image="currentEvent.promo_image2_url_abs"></div>
					    <div class="promo_content">
					        <p class="promo_title" v-if="currentEvent.store">{{ currentEvent.store.name }}</p>
					        <p class="promo_title" v-else>{{ property.name }}</p>
					        <h3 class="hidden_phone center caps" v-if="locale=='en-ca'">{{ currentEvent.name_short }}</h3>
							<h3 class="hidden_phone center caps" v-else>{{ currentEvent.name_short_2 }}</h3>
					    </div>
					</div>
    				<div class="row">
    				    <div class="col-md-12">
            				<div class="details_store_desc">
            				    <h4 class="details_store_title" v-if="locale=='en-ca'">{{ currentEvent.name }}</h4>
							    <h4 class="details_store_title" v-else>{{ currentEvent.name_2 }}</h4>
            				    <p class="bold">
            				        <span v-if="isMultiDay(currentEvent)">{{ currentEvent.start_date | moment("MMM D", timezone)}} - {{ currentEvent.end_date | moment("MMM D", timezone)}}</span>
            				        <span v-else>{{ currentEvent.start_date | moment("MMM D", timezone)}}</span>
        				        </p>
            				    <div v-if="locale=='en-ca'" v-html="currentEvent.rich_description"></div>
				                <div v-else v-html="currentEvent.rich_description_2"></div>
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
        return Vue.component("events-details-component", {
            template: template, // the variable template will be injected,
            props:['id', 'locale'],
            data: function() {
                return {
                    dataLoaded: false,
                    pageBanner: null,
                    currentEvent: null
                }
            },
            beforeRouteUpdate(to, from, next) {
                this.updatecurrentEvent(to.params.id); 
                this.dataLoaded = true;
            },
            created(){
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
                    
                    this.updatecurrentEvent(this.id);
                    this.dataLoaded = true;
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'findRepoByName',
                    'processedEvents',
                    'findEventBySlug'
                ])
            },
            methods: {
                loadData: async function() {
                    try {
                        let results = await Promise.all([this.$store.dispatch("getData", "repos"), this.$store.dispatch("getData", "events")]);
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
                updatecurrentEvent (id) {
                    this.currentEvent = this.findEventBySlug(id);
                    if (this.currentEvent != null || this.currentEvent != undefined){
                        this.currentEvent.name_short = _.truncate(this.currentEvent.name, { 'length': 21, 'separator': ' ' });
                        this.currentEvent.name_short_2 = _.truncate(this.currentEvent.name_2, { 'length': 21, 'separator': ' ' });
            
                        if(_.includes(this.currentEvent.image_url, 'missing')) {
                            this.currentEvent.image_url = "https://codecloud.cdn.speedyrails.net/sites/5daf7e206e6f643cde010000/image/png/1546551307522/eventplaceholder2@2x.png"
                        }
                        if(_.includes(this.currentEvent.promo_image2_url_abs, 'missing')) {
                            this.currentEvent.promo_image2_url_abs = "https://codecloud.cdn.speedyrails.net/sites/5daf7e206e6f643cde010000/image/png/1546551307522/eventplaceholder2@2x.png"
                        }
                           
                    } else {
                        this.$router.replace({ path: '/'});
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
                }
            }
        });
    });
</script>