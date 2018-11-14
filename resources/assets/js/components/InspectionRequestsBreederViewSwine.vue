<template>
    <div class="col s12">

        <div class="col s12">
            <h4 class="title-page"> Inspection Request Swines </h4>
        </div>

        <!-- Back to Viewing button container -->
        <div class="col s12">
            <a @click.prevent="hideAddSwineView"
                href="#!"
                class="btn custom-secondary-btn blue-text text-darken-1 z-depth-0 back-to-viewing-btn"
            >
                <i class="material-icons left">keyboard_arrow_left</i>
                Back To Viewing
            </a>
        </div>

        <!-- Preloader -->
        <div v-if="loading" 
            class="col s12 center-align"
        >
            <div class="preloader-wrapper active">
                <div class="spinner-layer spinner-blue-only">
                    <div class="circle-clipper left">
                        <div class="circle"></div>
                    </div>
                    <div class="gap-patch">
                        <div class="circle"></div>
                    </div>
                    <div class="circle-clipper right">
                        <div class="circle"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Inspection Request details container -->
        <div v-else class="col s12">
            <div id="inspection-container" class="card z-depth-0">
                <div class="card-content">
                    <span class="card-title">
                        <b>Inspection #{{ inspectionData.inspectionId }}</b>
                        <a v-if="inspectionData.status === 'requested'" href="#"
                            class="btn right 
                                blue-text
                                text-darken-1 
                                custom-secondary-btn
                                z-depth-0
                                request-for-inspection-btn
                                disabled"
                        >
                            Requested - Waiting Confirmation
                        </a>
                        <a v-if="inspectionData.status === 'for_inspection'" href="#"
                            class="btn right 
                                blue-text
                                text-darken-1 
                                custom-secondary-btn
                                z-depth-0
                                request-for-inspection-btn
                                disabled"
                        >
                            For Inspection
                        </a>
                        <a v-if="inspectionData.status === 'approved'"
                            href="#"
                            class="btn right 
                                blue-text
                                text-darken-1 
                                custom-secondary-btn
                                z-depth-0
                                disabled"
                        >
                            Approved
                        </a>
                    </span>
                    <p class="grey-text">
                        {{ inspectionData.farmName }}
                    </p>

                    <div class="row">
                        <!-- Included Swines -->
                        <div id="included-swines-container" class="col s12">
                            <h6><b>Included Swines</b></h6>
                            <div class="divider"></div>

                            <!-- Empty -->
                            <div v-if="includedSwines.length < 1" class="center-align">
                                <p><br>Sorry, there are no included swines.</p>
                            </div>

                            <!-- Non-empty -->
                            <div v-else v-for="swine in includedSwines" 
                                :key="swine.swineId"
                                class="col s6 m3 included-swine-container"
                            >
                                <span>
                                    <i class="material-icons left">
                                        check
                                    </i>
                                    {{ swine.registrationNo }} <br>
                                    <span class="grey-text">{{ swine.breedTitle }}</span>
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            inspectionData: Object,
        },

        data() {
            return {
                loading: true,
                includedSwines: []
            }
        },

        watch: {
            inspectionData: {
                handler: function(newValue, oldValue) {
                    if(newValue.inspectionId !== 0) {
                        this.fetchIncludedSwinesWithInspection(newValue);
                    }
                },
                deep: true
            }
        },

        methods: {
            hideAddSwineView() {
                this.loading = true;
                this.$emit('hideSwineViewEvent', 'view');
            },

            fetchIncludedSwinesWithInspection(inspectionData) {
                const inspectionId = inspectionData.inspectionId;

                axios.get(`/breeder/inspections/${inspectionId}/swines`)
                .then(({data}) => {
                    this.includedSwines = data.included;
                    
                    setTimeout(() => {
                        this.loading = false;
                    }, 1000);
                })
                .catch((error) => {
                    console.log(error);
                });
            }
        }
    }
</script>

<style scoped>
    .custom-secondary-btn {
        border: 1px solid;
        background-color: white !important;
    }

    .back-to-viewing-btn {
        margin-top: 2rem;
        margin-bottom: 2rem;
    }

    #included-swines-container {
        padding: 2rem 0 1rem 0;
    }

    .checkbox-container, .included-swine-container {
        padding: 1rem 0 0 0;
    }
</style>
