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
                                <p v-if="hour.is_open" v-for="hour in todaysHours" class="caps center">Open Now</p>
                                <p v-if="hour.is_open" v-for="hour in todaysHours" class="center">
                                    {{hour.open_time | moment("h:mm a", timezone)}} - {{hour.close_time | moment("h:mm a", timezone)}}    
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
                    <div class="row">
                        <div class="col-sm-12 margin_30 text-center" >
                            <!--<img src="//codecloud.cdn.speedyrails.net/sites/5bbfac0c6e6f6411b3040000/image/gif/1543509132118/HOLIDAY HOURS - SLM POSTER.gif" class="" alt="">-->
                           
                            
                        </div>
                    </div>
                    <div class="row">
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
                },
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'getPropertyHours',
                    'getPropertyHolidayHours',
                    'getTodaysHours',
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
                todays_hours() {
                    return this.getTodaysHours
                }
                // todaysHours() {
                //     var timezone = this.timezone
                //     var regHours = this.getPropertyHours;
                //     var holHours = this.getPropertyHolidayHours;
                //     var hours = [];
                //     // First check if there is a holiday today
                //     _.forEach(holHours, function(value) {
                //         var today = moment().format("YYYY-MM-DD");
                //         var holiday_date = moment(value.holiday_date).tz(timezone).format("YYYY-MM-DD");
                //         if (today == holiday_date) {
                //             if (value.is_closed) {
                //                 value.is_open = false;
                //             } else {
                //                 value.is_open = true;
                //             }
                //             hours.push(value);
                //         }
                //     });
                //     // If there is no holiday today, check for today's hours
                //     if (hours.length > 0) {
                //         return hours;
                //     } else {
                //         _.forEach(regHours, function(value) {  
                //             var today = moment().day();
                //             if ( today == value.day_of_week ) {
                //                 var time = moment().tz(timezone).format('HH:mm');
                //                 var opens = moment(value.open_time).tz(timezone).format('HH:mm');
                //                 var closes = moment(value.close_time).tz(timezone).format('HH:mm');
                //                 if (time > opens && time < closes) {
                //                     value.is_open = true;
                //                 } else {
                //                     value.is_open = false;
                //                 }
                //                 hours.push(value);
                //             }         
                //         });
                //         return hours;
                //     }
                // },
                
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
