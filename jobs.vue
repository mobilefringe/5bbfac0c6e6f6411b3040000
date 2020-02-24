<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loader v-if="!dataLoaded"></loader>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
        		<div class="page_header" v-if="pageBanner" v-bind:style="{ background: '#000 url(' + pageBanner.image_url + ')' }">
        			<div class="site_container">
        				<div class="header_content caps">
        					<h1 class="banner-content">{{ $t("jobs_page.jobs") }}</h1>
        				</div>
        			</div>
        		</div>
        		<div class="site_container">
        		    <div v-if="promotions.length == 0" class="row no_promos">
        				<div class="col-md-12"> 
        					<p>{{$t("jobs_page.no_job_message")}}</p>
        				</div>
        			</div>
        		    <div class="job_container" v-else v-for="promo in promotions">
    		            <div class="hidden_phone jobs_left">
    		                <h2 class="jobs_store_name">{{ promo.store_name }}</h2> 
    		            </div>
    		            <div class="jobs_right">
    		                <div class="job_detail_content">
    		                    <h2 class="visible_phone jobs_store_name">{{ promo.store_name }}</h2> 
        		                <p class="job_position bold" v-if="locale=='en-ca'">{{ $t("jobs_page.position") }}: {{ promo.name }}</p>
    					        <p class="job_position bold" v-else>{{ $t("jobs_page.position") }}: {{ promo.name_2 }}</p>
    					        <p class="job_position">{{ checkJobType(promo) }}</p>
    							<p class="job_date">{{ $t("jobs_page.end_date") }}: {{promo.end_date | moment("MMMM DD, YYYY", timezone)}}</p>
    							<router-link :to="'/jobs/'+ promo.slug" >
    							   <div class="job_learn_more animated_btn">{{ $t("jobs_page.read_more") }}</div>
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
    define(["Vue", "vuex", "moment", "moment-timezone", "vue-moment"], function(Vue, Vuex, moment, tz, VueMoment) {
        return Vue.component("promos-component", {
            template: template, // the variable template will be injected
            props:['locale'],
            data: function() {
                return {
                    dataLoaded: false,
                    pageBanner: null
                }
            },
            created() {
                this.loadData().then(response => {
                    var temp_repo = this.findRepoByName('Jobs Banner');
                    if(temp_repo) {
                        try {
                            this.pageBanner = temp_repo.images[0];
                        } catch(e) {
                            
                        }
                    } else {
                        this.pageBanner = { "image_url": "https://via.placeholder.com/1920x300" }
                    }

                    this.dataLoaded = true;
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'findRepoByName',
                    'processedJobs',
                ]),
                promotions() {
                    var property_name = this.property.name
                    var vm = this;
                    var temp_promo = [];
                    var temp_job = [];
                    _.forEach(this.processedJobs, function(value, key) {
                        if (value.store != null && value.store != undefined) {
                            value.store_name = value.store.name;
                        } else if (value.store == null || value.store == undefined) {
                            value.store = {};
                            value.store_name = property_name;
                        }
                        
                        temp_promo.push(value);
                    });
                    _.sortBy(temp_promo, [function(o) { return o.start_date; }]);
                    return temp_promo;
                }
            },
            methods: {
                loadData: async function() {
                    try {
                        let results = await Promise.all([this.$store.dispatch("getData", "repos"), this.$store.dispatch("getData", "jobs")]);
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
                checkJobType(promo) {
                    if(this.locale != "en-ca") {
                        if(promo.job_type == "Full Time"){
                            return "Plein Temps"
                        } else if (promo.job_type == "Part Time"){
                            return "Mi Temps"
                        } else if (promo.job_type == "Full Time/Part Time"){
                            return "Plein/Mi Temps"
                        } else if (promo.job_type == "Seasonal"){
                            return "Travail Saisonnier"
                        }
                    } else {
                        return promo.job_type
                    }
                }
            }
        });
    });
</script>