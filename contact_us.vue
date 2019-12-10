<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loader v-if="!dataLoaded"></loader>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <div class="page_header" v-if="pageBanner" v-bind:style="{ backgroundImage: 'url(' + pageBanner.image_url + ')' }">
        			<div class="site_container">
        				<div class="header_content caps">
        					<h1>Contact Us</h1>
        				</div>
        			</div>
        		</div>
        		<div class="site_container">
                    <div class="contact_container">
					    <div class="contact_map">
					        <iframe title="Map" width="100%" height="100%" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"  :src="'https://maps.google.nl/maps?q=' + getPropertyAddress + '&amp;hl=en&amp;ie=UTF8&amp;t=v&amp;hnear=' + getPropertyAddress + '&amp;z=16&amp;output=embed'"></iframe>
					    </div>
					    <div class="contact_content">
					        <span v-if="property.address1 && property.city && property.province_state && property.postal_code">
					            <h3>{{ $t("contact_page.location") }}:</h3>
					            <p>{{ property.address1 }} {{ property.city }}, {{property.province_state }} {{property.postal_code }}</p>
					       </span>
					        <div class="margin_40"></div>
					        <span v-if="property.contact_phone || property.contact_fax">
					            <h3>{{ $t("contact_page.phone_title") }}:</h3>
					            <p>{{ $t("contact_page.phone1") }}: {{ property.contact_phone }}</p>
					            <p>{{ $t("contact_page.phone2") }}: {{ property.contact_fax }}</p>
					       </span>
					        <div class="margin_40"></div>
					        <span v-if="property.contact_email">
					            <h3>{{ $t("contact_page.email") }}:</h3>
					            <p>{{ property.contact_email }}</p>
					       </span>
					    </div>
					    <div class="contact_form_container">
					        <div class="row">
					            <div class="col-md-12">
					                <h3>{{ $t("contact_page.form_header") }}</h3>    
					            </div>
					        </div>
					        <form id="contact_form" class="form-horizontal" action="form-submit" @submit.prevent="validateBeforeSubmit">
                                <div class="form-group ">
                                    <div class="col-sm-12 col-md-6">
                                        <div class="position_relative" :class="{'has-error': errors.has('name')}">
                                            <label class="label" for="name">Name</label>
                                            <input id="name" v-model="form_data.name" v-validate="'required|alpha_spaces'" class="form-control" :class="{'input': true}" name="name" type="text" :placeholder="$t('contact_page.form_name')" data-vv-delay="500">
                                            <span v-show="errors.has('name')" class="form-control-feedback">{{ errors.first('name') }}</span>
                                        </div>
                                        <div class="position_relative" :class="{'has-error': errors.has('email')}">
                                            <label class="label" for="email">Email</label>
                                            <input id="email" v-model="form_data.email" v-validate="'required|email'" class="form-control" :class="{'input': true}" name="email" type="email" :placeholder="$t('contact_page.form_email')" data-vv-delay="500">
                                            <span v-show="errors.has('email')" class="form-control-feedback">{{ errors.first('email') }}</span>
                                        </div>
                                        <div class="position_relative" :class="{'has-error': errors.has('phone')}">
                                            <label class="label" for="phone">Phone Number</label>
                                            <input id="phone" v-model="form_data.phone" v-validate="'required:true'" class="form-control" :class="{'input': true}" name="phone" type="text" :placeholder="$t('contact_page.form_phone')" data-vv-delay="1000">
                                            <span v-show="errors.has('phone')" class="form-control-feedback">{{ errors.first('phone') }}</span>
                                        </div>
                                    </div>
                                    <div class="col-sm-12 col-md-6">
                                        <div class="position_relative" :class="{'has-error': errors.has('message')}">
                                            <label class="label" for="message">Message*</label>
                                            <textarea id="message" v-model="form_data.message" v-validate="'required:true'" class="form-control" :class="{'input': true}" name="message" type="text" :placeholder="$t('contact_page.form_message')" data-vv-delay="500"></textarea>
                                            <span v-show="errors.has('message')" class="form-control-feedback">{{ errors.first('message') }}</span>
                                        </div>
                                        <div class="pull-right">
                                            <button class="submit_btn animated_btn" type="submit" :disabled="formSuccess">
                                                {{ $t("contact_page.form_send") }}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <div id="send_contact_success" class="alert alert-success text-left" role="alert" v-show="formSuccess">
                                <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>
                                <span class="sr-only">Success</span>
                                {{ $t("contact_page.form_success_msg") }}
                            </div>
                            <div id="send_contact_error" class="alert alert-danger text-left" role="alert" v-show="formError">
                                <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
                                <span class="sr-only">Error:</span>
                                {{ $t("contact_page.form_error_msg") }}
                            </div>
					    </div>
					</div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    define(["Vue", "vuex", "vue-meta", "vee-validate", "utility"], function(Vue, Vuex, Meta, VeeValidate, Utility) {
        Vue.use(Meta);
        Vue.use(VeeValidate);
        return Vue.component("contact-us-component", {
            template: template, // the variable template will be injected
            data: function() {
                return {
                    dataLoaded: false,
                    pageBanner: null,
                    form_data : {},
                    formSuccess : false,
                    formError: false
                }
            },
            created(){
                this.loadData().then(response => {
                    var temp_repo = this.findRepoByName('Contact Us Banner');
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
            mounted () {
                // Ensuring the variables are created in this order for email
                this.form_data.name = null;
                this.form_data.email = null;
                this.form_data.phone = null;
                this.form_data.subject = this.property.name + ' Contact Us Form';
                this.form_data.message = null;
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'findRepoByName'
                ]),
                getPropertyAddress() {
                    return this.property.name + ' ' + this.property.address1 + ' ' + this.property.city + ' ' + this.property.province_state + ' ' + this.property.country;
                }
            },
            methods: {
                validateBeforeSubmit() {
                    this.$validator.validateAll().then((result) => {
                        this.validNumError = false;
                        let errors = this.errors;
                        send_data = {};
                        send_data.form_data = JSON.stringify(Utility.serializeObject(this.form_data));
                        this.$store.dispatch("CONTACT_US", send_data).then(res => {
                            this.formSuccess = true;
                        }).catch(error => {
                            try {
                                if (error.response.status == 401) {
                                    console.log("Data load error: " + error.message);
                                    this.formError = true;
                                } else {
                                    console.log("Data load error: " + error.message);
                                    this.formError = true;
                                }
                            } catch (e) {
                                console.log("Data load error: " + error.message);
                                this.formError = true;
                            }
                        });
                    });
                },
                loadData: async function() {
                    try {
                        // avoid making LOAD_META_DATA call for now as it will cause the entire Promise.all to fail since no meta data is set up.
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
