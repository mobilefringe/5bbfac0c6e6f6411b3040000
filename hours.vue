<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loader v-if="!dataLoaded"></loader>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <div class="page_header" v-if="pageBanner" v-bind:style="{ backgroundImage: 'url(' + pageBanner.image_url + ')' }">
        			<div class="site_container">
        				<div class="header_content caps">
        					<h1>{{$t("hours_page.hours")}}</h1>
        				</div>
        			</div>
        		</div>  
                <div class="site_container">
                    <div class="row">
                        <div class="col-md-12">
                            <h4 class="bold">Exterior retailer's hours may differ from The {{property.name}}'s regular shopping hours.</h4>
                        </div>
                    </div>
                    <div class="row hours_row">
                        <div class="col-sm-12 col-lg-3">
                            <div class="hours_container todays_hours">
                                <p v-if="todaysHours && todaysHours.is_open" class="caps center">Open Now</p>
                                <p v-if="todaysHours && todaysHours.is_open" class="center">
                                    {{todaysHours.open_time | moment("h:mm a", timezone)}} - {{todaysHours.close_time | moment("h:mm a", timezone)}}    
                                </p>
                                <p v-else class="center">Closed</p>
                            </div>
                        </div>
                        <div class="col-sm-4 col-lg-3">
                            <div class="hours_container">
                                <p class="caps center">Monday - Friday</p>
                                <p v-for="hour in weekdayHours" class="center">
                                    {{hour.open_time | moment("h:mm a", timezone)}} - {{hour.close_time | moment("h:mm a", timezone)}}    
                                </p>
                            </div>
                        </div>
                        <div class="col-sm-4 col-lg-3">
                            <div class="hours_container">
                                <p class="caps center">Saturday</p>
                                <p v-for="hour in saturdayHours" class="center">
                                    {{hour.open_time | moment("h:mm a", timezone)}} - {{hour.close_time | moment("h:mm a", timezone)}}    
                                </p>
                            </div>
                        </div>
                        <div class="col-sm-4 col-lg-3">
                            <div class="hours_container">
                                <p class="caps center">Sunday</p>
                                <p v-for="hour in sundayHours" class="center">
                                    {{hour.open_time | moment("h:mm a", timezone)}} - {{hour.close_time | moment("h:mm a", timezone)}}    
                                </p>
                            </div>
                        </div>
                    </div>
                    <div v-if="holidayHours.length > 0" class="row">
                        <div class="col-sm-12">
                            <h4 class="margin_30 bold">Holiday Hours</h4>
                        </div>
                        <div v-for="hour in holidayHours" class="col-sm-6">
                            <div class="row holiday_hours">
                                <div class="col-md-12 col-lg-4">
                                    <p class="bold caps">{{ hour.holiday_name }}</p>
                                </div>
                                <div class="col-sm-6 col-lg-4">
                                    <p>{{ hour.holiday_date | moment("MMM D, YYYY", timezone) }}</p>    
                                </div>
                                <div class="col-sm-6 col-lg-4">
                                    <span v-if="hour.is_closed == true">Closed</span>
                                    <span v-else>
                                        {{ hour.open_time | moment("h:mm a", timezone) }} - {{ hour.close_time | moment("h:mm a", timezone) }}
                                    </span>    
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
    define(["Vue", "vuex", "moment", "moment-timezone", "vue-moment"], function(Vue, Vuex, moment, tz, VueMoment) {
        Vue.use(require('vue-moment'));
        return Vue.component("hours-component", {
            template: template, // the variable template will be injected
            props:['locale'],
            data: function() {
                return {
                    dataLoaded: false,
                    pageBanner : null
                }
            },
            created() {
                this.loadData().then(response => {
                    var temp_repo = this.findRepoByName('Hours Banner');
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
            watch : {
                locale: function(val, oldVal) {
                    console.log("locale", this.locale);
                }
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'getPropertyHours',
                    'getPropertyHolidayHours',
                    'getTodayHours',
                    'findRepoByName'
                ]),
                weekdayHours() {
                    var weekday_hours = this.getPropertyHours
                    return _.filter(weekday_hours, function(o) { return o.day_of_week == 1 });
                },
                saturdayHours() {
                    return _.filter(this.getPropertyHours, function(o) { return o.day_of_week == 6 });
                },
                sundayHours() {
                    return _.filter(this.getPropertyHours, function(o) { return o.day_of_week == 0 });
                },
                holidayHours () {
                    return _.sortBy(this.getPropertyHolidayHours, function(o) { return o.holiday_date });
                },
                todaysHours() {
                    return this.getTodayHours;
                }
            },
            methods : {
                loadData: async function() {
                    try {
                        let results = await Promise.all([this.$store.dispatch("getData", "repos")]);
                        return results;
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
            }
        });
    });
</script>
