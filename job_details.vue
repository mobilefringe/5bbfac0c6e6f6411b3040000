<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loader v-if="!dataLoaded"></loader>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <div class="page_header" v-if="pageBanner" v-bind:style="{ backgroundImage: 'url(' + pageBanner.image_url + ')' }">
        			<div class="site_container">
        				<div class="header_content caps">
    						<h1>{{ $t("jobs_page.jobs") }}</h1>
        				</div>
        			</div>
        		</div>
        		<div class="margin_60"></div>
                <div v-if="dataLoaded" v-cloak class="site_container">
                    <div class="row job_details_container">
                        <div class="col-md-8">
                            <div class="details_store_name">
                                <h2>{{ currentJob.store_name }}</h2>
                                <p v-if="storeCategory.length > 0" class="store_category">{{ storeCategory(currentJob) }}</p>
                                <h3 v-if="currentJob.store_phone" class="store_phone">
                                    <i class="fa fa-phone"></i><span>{{ currentJob.store_phone }}</span>
                                </h3>
                                <div v-if="Object.keys(currentJob.store).length != 0">
                                    <a v-if="currentJob.store_website" :href="currentJob.store_website" target="_blank">
                                        <div class="store_website animated_btn caps">{{ $t("stores_page.store_website") }}</div>
                                    </a>
                                    <div class="store_website animated_btn caps">{{ $t("stores_page.view_map") }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
            				<div class="details_store_image">
            				    <div v-if="currentJob.no_logo" class="store_details_image center-block">
                                    <div class="no_logo">
                                        <p class="store_details_name">{{ currentJob.store_name }}</p>
                                    </div>    
                                </div>
                                <img v-if="!currentJob.no_logo" class="store_details_image center-block" :src="currentJob.store_url" :alt="currentJob.name + ' Logo'" />
            				</div>
            			</div>
            		</div>
            		<div class="row">
            			<div class="col-md-12">
            				<div class="details_store_desc">
            				    <h4 v-if="locale=='en-ca'" class="details_store_title">{{ $t("jobs_page.position") }}: {{ currentJob.name }}</h4>
                                <h4 v-else class="details_store_title">{{ $t("jobs_page.position") }}: {{ currentJob.name_2 }}</h4>
    							<p class="job_date">{{ $t("jobs_page.end_date") }}: {{ currentJob.end_date | moment("MMM D, YYYY", timezone) }}</p>
            				    <div v-html="currentJob.description"></div>
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
        return Vue.component("job-details-component", {
            template: template, // the variable template will be injected,
            data: function() {
                return {
                    dataLoaded: false,
                    pageBanner:null,
                    currentJob: null,
                    storeJobs : null
                }
            },
            props:['id', 'locale'],
            beforeRouteUpdate(to, from, next) {
                this.updateCurrentJob(this.id);
                next();
            },
            created(){
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
                    this.updateCurrentJob(this.id);
                    this.dataLoaded = true;
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'findRepoByName',
                    'findJobBySlug',
                    'findCategoryById'
                ])
            },
            methods: {
                updateCurrentJob (id) {
                    this.currentJob = this.findJobBySlug(id);
                    if (this.currentJob != null || this.currentJob != undefined){
                        var property_name = this.property.name
                        if (this.currentJob.store != null && this.currentJob.store != undefined){
                            this.currentJob.store_name = this.currentJob.store.name;
                            this.currentJob.store_phone = this.currentJob.store.phone
                            this.currentJob.store_website = this.currentJob.store.website
                        
                            // STORE LOGO
                            if (_.includes(this.currentJob.store.store_front_url_abs, 'missing')) {
                                this.currentJob.no_logo = true
                            } else {
                                this.currentJob.no_logo = false
                                this.currentJob.store_url = this.currentJob.store.image_url;
                            }

                        } else if (this.currentJob.store == null || this.currentJob.store == undefined) {
                            this.currentJob.store = {};
                            this.currentJob.no_logo = false;
                            this.currentJob.store_url =  "https://codecloud.cdn.speedyrails.net/sites/5daf7e206e6f643cde010000/image/png/1546551307522/eventplaceholder2@2x.png"
                            this.currentJob.store_name = property_name;
                        }
                    } else {
                        this.$router.replace({ name: '404'});
                    }
                },
                loadData: async function() {
                    try {
                        let results = await Promise.all([this.$store.dispatch("getData", "repos"), this.$store.dispatch("getData", "jobs"), this.$store.dispatch("getData", "categories")]);
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
                },
                storeCategory(currentJob) {
                    if (currentJob.store.length > 0) {
                        var currentStoreCategory = currentJob.store.categories[0];
                        category = this.findCategoryById(currentStoreCategory);
                        return category.name
                    }
                }
            }
        });
    });
</script>