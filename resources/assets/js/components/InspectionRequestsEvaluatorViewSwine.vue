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
                        <a v-if="inspectionData.status === 'requested'"
                            @click.prevent="showMarkInspectionModal()"
                            href="#"
                            class="btn right 
                                blue
                                darken-1
                                z-depth-0
                                mark-inspection-btn"
                        >
                            Mark for Inspection
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

        <!-- Mark for Inspection Modal -->
        <div id="mark-for-inspection-modal-2" class="modal">
            <div class="modal-content">
                <h4>
                    Mark for Inspection
                    <i class="material-icons right modal-close">close</i>
                </h4>

                <div class="row modal-input-container">
                    <div class="col s12"><br/></div>
                    <div class="input-field col s12">
                        <p>
                            Are you sure you want to mark 
                            <b>Inspection #{{ markInspectionData.inspectionId }}</b>
                            from <b>{{ markInspectionData.farmName }}</b>
                            for inspection?
                        </p>
                    </div>
                    <div class="input-field col s12">
                        <app-input-date
                            v-model="markInspectionData.dateInspection"
                            :min="true"
                            @date-select="val => {markInspectionData.dateInspection = val}"
                        >
                        </app-input-date>
                        <label for=""> Date of Inspection </label>
                    </div>
                </div>
            </div>
            <div class="modal-footer grey lighten-3">
                <a href="#!" class="modal-action modal-close btn-flat">Cancel</a>
                <a @click.prevent="markForInspection($event)" 
                    href="#!" 
                    class="modal-action btn blue darken-1 z-depth-0 mark-for-inspection-btn"
                >
                    Mark
                </a>
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
                includedSwines: [],
                markInspectionData: {
                    inspectionId: 0,
                    farmName: '',
                    dateInspection: '',
                }
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

                axios.get(`/evaluator/inspections/${inspectionId}/swines`)
                .then(({data}) => {
                    this.includedSwines = data.included;
                    
                    setTimeout(() => {
                        this.loading = false;
                    }, 1000);
                })
                .catch((error) => {
                    console.log(error);
                });
            },

            showMarkInspectionModal() {
                this.markInspectionData.inspectionId = this.inspectionData.inspectionId;
                this.markInspectionData.farmName = this.inspectionData.farmName;

                this.$nextTick(() => {
                    // Materialize component initializations
                    $('.modal').modal();
                    $('#mark-for-inspection-modal-2').modal('open');
                });
            },

            markForInspection(event) {
                const vm = this;
                const markForInspectionBtn = $('.mark-for-inspection-btn');
                const inspectionId = this.markInspectionData.inspectionId;

                // Make sure dateInspection is filled out
                if(!vm.markInspectionData.dateInspection) return;

                this.disableButtons(markForInspectionBtn, event.target, 'Marking...');

                // Update from server's database
                axios.patch(`/evaluator/manage/inspections/${inspectionId}`, 
                    {
                        inspectionId: inspectionId,
                        dateInspection: vm.markInspectionData.dateInspection,
                        status: 'for_inspection'
                    }
                )
                .then(({data}) => {
                    if(data.marked) {
                        // Clear markInspectionData
                        vm.markInspectionData.dateInspection = '';

                        // Update UI after requesting the inspection
                        vm.$nextTick(() => {
                            $('#mark-for-inspection-modal-2').modal('close');
                            this.enableButtons(markForInspectionBtn, event.target, 'Mark');
    
                            Materialize.updateTextFields();
                            Materialize.toast(
                                `Inspection #${inspectionId} successfully marked for inspection.`, 
                                2000, 
                                'green lighten-1'
                            );

                            this.$emit('markInspectionEvent', {
                                inspectionId: inspectionId,
                                dateInspection: data.dateInspection
                            });
                            this.hideAddSwineView();
                        });
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
            },

            disableButtons(buttons, actionBtnElement, textToShow) {
                buttons.addClass('disabled');
                actionBtnElement.innerHTML = textToShow;
            },

            enableButtons(buttons, actionBtnElement, textToShow) {
                buttons.removeClass('disabled');
                actionBtnElement.innerHTML = textToShow;
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

    /* Modal customizations */
    #mark-for-inspection-modal-2 {
        width: 40rem;
    }

    #mark-for-inspection-modal-2 .modal-input-container {
        padding-bottom: 10rem;
    }

    .modal .modal-footer {
        padding-right: 2rem;
    }
</style>
