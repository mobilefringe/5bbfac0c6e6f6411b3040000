<template>
    <div class="covid-page"> <!-- without an outer container div this component template will not render -->
        <loading-spinner v-if="!dataLoaded"></loading-spinner>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <!--<div class="inside_header_background covid-background"  v-if="pageBanner" :style="{ backgroundImage: 'url(' + pageBanner.image_url + ')' }">-->
                    
                <!--</div>-->
                <div class="inside_header_background covid-background"  v-if="pageBanner" :style="{ backgroundImage: 'url(' + pageBanner.image_url + ')' }">
                    <div class="main_container center_text">
                        <div class="page_container">
                            <h1><span>{{currentPage.title}} </span>Coronavirus information & Resources</h1>
                            
                        </div>
                    </div>
                </div>
                
                <div class="main_container mobile_padding margin_30">
                    <div class="">
                        <div class="details_col_12">
                            <h1>{{currentPage.title}} </h1>
                            <div class="page_body" v-html="currentPage.body"></div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    define(["Vue", "vuex"], function (Vue, Vuex) {
        return Vue.component("page-details-component", {
            template: template, // the variable template will be injected,
            props: ['id'],
            data: function data() {
                return {
                    dataLoaded: false,
                    currentPage: null,
                    sideBanner: null
                }
            },
            created() {
                this.updateCurrentPage(this.id);
                
            },
            watch: {
                $route: function () {
                    this.updateCurrentPage(this.$route.params.id);
                }
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'findRepoByName'
                ])
            },
            methods: {
                updateCurrentPage(id) {
                    var _this = this;
                    this.property.mm_host = this.property.mm_host.replace("http:", "");
                    this.$store.dispatch('LOAD_PAGE_DATA', { url: this.property.mm_host + "/pages/coralridge-covid-19-update.json" }).then(function (response) {
                        _this.currentPage = response.data;
                        _this.dataLoaded = true;
                    }, function (error) {
                        console.error( "Could not retrieve data from server. Please check internet connection and try again.");
                        _this.$router.replace({ name: '404' });
                    });
                    
                    this.loadData().then(response => {
                        var temp_repo = this.findRepoByName('COVID-19 Banner');
                        if(temp_repo) {
                            this.pageBanner = temp_repo.images[0];
                        }
                        else {
                            this.pageBanner = {};
                            this.pageBanner.image_url = "";
                        }
                    });
                    // this.loadData().then(response => {
                    //     var temp_repo1 = this.findRepoByName('Sales & Events Side Banner');
                    //     if(temp_repo1 && temp_repo1.images) {
                    //         this.sideBanner = temp_repo1.images[0];
                    //     } else {
                    //         this.sideBanner = {
                    //             "image_url": ""
                    //         }
                    //     } 
                    // });
                    
               
                },
                loadData: async function () {
                    try {
                        let results = await Promise.all([this.$store.dispatch("getData","repos")]);
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
            }
        });
    });
</script>

<style>
    .covid-background {
        height: 300px;
        margin-bottom: 60px;
        display: flex;
        align-items: center;
    }
    .covid-background h1 {
        color: #fff;
        font-weight: light;
        
       
    }
    .covid-background span {
        display: block;
        margin-bottom: 24px;
        font-size: 28px;
        font-weight: bold;
    }
    h1 {
        font-size: 26px;
        margin-bottom: 30px;
        text-transform: uppercase;
        
    }
    
    ul {
      list-style-type: none;
      padding-left: 0;
    }
    ul > li {
      text-indent: -5px;
    }
    ul > li:before {
      content: "-";
      text-indent: -5px;
    }
    ul > li a {
        margin-left: 5px;
    }
    
    .page_body p,
    h3,
    ul{
        margin-bottom: 30px;
    }
    .page_body h2 {
        padding: unset;
        background: unset;
        color: unset;
        font-size: 24px;
        margin: 60px 0;
        font-weight: bold;
        font-family: 'Maven Pro', sans-serif;
    }
    h3 {
        font-size: 26px;
        text-transform: uppercase;
    }
    .covid-page {
        font-family: 'Maven Pro', sans-serif !important;
    }
    .center_text {
        display: flex;
        align-items: center
    }

    
</style>