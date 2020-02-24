<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loader v-if="!dataLoaded"></loader>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <div class="page_header" v-if="pageBanner" v-bind:style="{ background: '#000 url(' + pageBanner.image_url + ')' }">
        			<div class="site_container">
        				<div class="header_content caps">
        					<h1 class="banner-content">{{ $t("programs_page.programs_header") }}</h1>
        				</div>
        			</div>
        		</div>
        		<div class="site_container">
                    <div class="program_header_container hidden_phone">
                        <router-link to="/southland-scoop">
        				    <div class="program_button_container animated_btn">
        				        {{ $t("programs_page.scoop_title") }}
        				    </div>
        				</router-link>
        				<div class="program_button_container active">
        				    {{ $t("programs_page.kids_club_title") }}
        				</div>
        			</div>
        			<div class="visible_phone margin_20">
        			    <label style="display: none;" for="pageSelect">Select a Page</label>
        				<v-select v-model="selected" :options="pageOptions" :searchable="false" :on-change="selectPage" class="category-select" inputId="pageSelect"></v-select>
        			</div>
        			<div v-if="pageHeader" class="row">
        			    <div class="col-md-12">
        			        <div class="margin_40 center bold h4" v-html="pageHeader.body"></div>
        			    </div>
        			</div>
        			<div class="row">
        			    <div class="col-md-8">
        			    <div class="visuallyhidden">
        			        <h3>Kids Club Page content</h3>
        			    </div>
        			        <div class="" v-html="pageBody.body"></div>
        			    </div>
        			   <div class="col-md-4">
        			       <img class="max_width" :src="pageImage" alt="" />
        			   </div>
        		    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    define(["Vue", "vuex"], function(Vue, Vuex) {
        return Vue.component("kids-club-component", {
            template: template, // the variable template will be injected
            data: function() {
                return {
                    dataLoaded: false,
                    pageBanner: null,
                    pageHeader: null,
                    pageBody: null,
                    pageImage: null,
                    pageOptions: [
                        { 'label': 'Kids Club', 'value': 'club', 'disabled': true },
                        { 'label': 'Southland Scoop', 'value': 'scoop', 'disabled': false }
                    ],
                    selected: { 'label': 'Kids Club', 'value': 'club', 'disabled': true },
                }
            },
            created(){
                this.loadData().then(response => {
                    var temp_repo = this.findRepoByName('Kids Club Banner');
                    if (temp_repo) {
                        try {
                            this.pageBanner = temp_repo.images[0];
                        } catch(e) {
                            
                        }
                    } else {
                        this.pageBanner = { "image_url": "https://via.placeholder.com/1920x300" }
                    }
                    
                    if (response[1]) {
                        try {
                            this.pageHeader = response[1].data
                            this.pageBody = response[1].data.subpages[0]
                            this.pageImage = response[1].data.image_url
                        } catch (e) {
                            
                        }
                    }

                    this.dataLoaded = true;
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'findRepoByName'
                ])
            },
            methods: {
                loadData: async function() {
                    try {
                        let results = await Promise.all([this.$store.dispatch("getData", "repos"), this.$store.dispatch('LOAD_PAGE_DATA', {url: this.property.mm_host + "/pages/southland-kids-club.json"})]);
                        return results;
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
                selectPage(item) {
                    var item = item.value
                    if (_.includes(item, "scoop")) {
                        this.$router.push("/southland-scoop");
                    }
                    
                }
            }
        });
    });
</script>
