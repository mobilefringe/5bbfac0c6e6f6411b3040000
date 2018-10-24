<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loader v-if="!dataLoaded"></loader>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <div class="page_header" v-if="pageBanner" v-bind:style="{ backgroundImage: 'url(' + pageBanner.image_url + ')' }">
        			<div class="site_container">
        				<div class="header_content caps">
        					<h1>{{ $t("mall_info.info_header") }}</h1>
        				</div>
        			</div>
        		</div>
        		<div class="site_container">
                    <div class="program_header_container information hidden_phone">
        				<div class="program_button_container animated_btn" v-for="item in pages" @click="selectContent(item)" :class="{ active: item.isActive, last: item.isLast }">

        				    <span v-if="locale=='en-ca'">{{ item.title }}</span>
							<span v-else>{{ item.title_2 }}</span>
        				</div>
        			</div>
        			<div class="visible_phone margin_20">
        			    <label style="display: none;" for="pageSelect">Select a Page</label>
        				<v-select :options="dropDownSelect" :searchable="false" :on-change="selectPage" class="category-select" placeholder="Select a Page" inputId="pageSelect"></v-select>
        			</div>
        			<div class="row">
        			    <div :class="{'col-sm-12': !leasingSubpage && leasingContent.isActive, 'col-sm-6': leasingSubpage && leasingContent.isActive}">
        			        <div v-if="pageContent">
        			            <div v-if="locale=='en-ca'" v-html="pageContent.body"></div>
        			            <div v-else v-html="pageContent.body_2"></div>
        			        </div>
        			    </div>
        			   <div class="col-sm-6" v-if="leasingSubpage && leasingContent.isActive">
        			       <div v-if="leasingSubpage">
        			            <div v-if="locale=='en-ca'" v-html="leasingSubpage.body"></div>
        			            <div v-else v-html="leasingSubpage.body_2"></div>
        			        </div>
        			   </div>
        		    </div>
        		    <div class="row mall_info_images">
        			    <div class="col-sm-6">
        			        <img class="max_width" src="//codecloud.cdn.speedyrails.net/sites/5bbfac0c6e6f6411b3040000/image/jpeg/1540398641000/pages1.jpg" alt="" />
        			    </div>
        			   <div class="col-sm-6">
        			       <img class="max_width" src="//codecloud.cdn.speedyrails.net/sites/5bbfac0c6e6f6411b3040000/image/jpeg/1540398677000/pages2.jpg" alt="" />
        			   </div>
        		    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    define(["Vue", "vuex", "vue-select"], function(Vue, Vuex, VueSelect) {
        return Vue.component("mall-info-component", {
            template: template, // the variable template will be injected
            props:['locale'],
            data: function() {
                return {
                    dataLoaded: false,
                    pageBanner: null,
                    pageContent: null,
                    leasingSubpage: null
                }
            },
            watch: {
                selectedItem: function() {
                    console.log(this)
                },
            },
            created(){
                this.loadData().then(response => {
                    var temp_repo = this.findRepoByName('Mall Info Banner');
                    if (temp_repo) {
                        try {
                            this.pageBanner = temp_repo.images[0];
                        } catch(e) {
                            
                        }
                    } else {
                        this.pageBanner = { "image_url": "https://via.placeholder.com/1920x300" }
                    }

                    this.leasingContent = response[1].data;
                    this.leasingSubpage = response[1].data.subpages[0];
                    this.leasingContent.isActive = true;
                    this.marketingContent = response[2].data;
                    this.areaContent = response[3].data;
                    this.pageContent = this.leasingContent;
                    this.dataLoaded = true;
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'findRepoByName'
                ]),
                pages() {
                    var pages_json = [];
                    pages_json = _.concat(pages_json, this.leasingContent, this.marketingContent, this.areaContent)
                    _.forEach(pages_json, function (value, key) {
                        if ( _.includes([2], key)) {
                            value.isLast = true;
                        }
                    });
                    return pages_json
                },
                dropDownSelect() {
                    var cats = _.map(this.pages, 'title');
                    return cats;
                }
            },
            methods: {
                loadData: async function() {
                    try {
                        let results = await Promise.all([this.$store.dispatch("getData", "repos"), this.$store.dispatch('LOAD_PAGE_DATA', {url: this.property.mm_host + "/pages/southland-leasing.json"}), this.$store.dispatch('LOAD_PAGE_DATA', {url: this.property.mm_host + "/pages/southland-marketing-partners.json"}), this.$store.dispatch('LOAD_PAGE_DATA', {url: this.property.mm_host + "/pages/southland-area-info.json"})]);
                        return results;
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
                selectContent(item) {
                    _.forEach(this.pages, function (value, key) {
                        value.isActive = false;
                    });
                    
                    var selected_item = item
                    this.$nextTick(function () {
                      selected_item.isActive = true;
                    });
            
                    this.pageContent = selected_item;
                },
                selectPage(item) {
                    var _this = this
                    var item = item
                    _.forEach(this.pages, function (value, key) {
                        if (_.includes(value.title, item )) {
                            _this.$nextTick(function () {
                                this.pageContent = value;    
                            });
                        }
                    });
                }
            }
        });
    });
</script>
