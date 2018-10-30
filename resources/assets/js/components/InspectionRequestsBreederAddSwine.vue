<template>
    <div class="col s12">

        <div class="col s12">
            <h4 class="title-page"> Add Swine to Inspection Request </h4>
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
                        <a @click.prevent="showRequestModal()"
                            href="#"
                            class="btn right 
                                blue-text
                                text-darken-1 
                                custom-secondary-btn
                                z-depth-0
                                request-for-inspection-btn"
                        >
                            Request for Inspection
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
                                    <i @click.prevent="showRemoveSwineModal({
                                            inspectionId: inspectionData.inspectionId,
                                            itemId: swine.itemId,
                                            registrationNo: swine.registrationNo
                                        })"
                                        class="material-icons left cancel-swine-icon"
                                    >
                                        cancel
                                    </i>
                                    {{ swine.registrationNo }} <br>
                                    <span class="grey-text">{{ swine.breedTitle }}</span>
                                </span>
                            </div>
                        </div>

                        <!-- Available Swines -->
                        <div id="available-swines-container" class="col s12">
                            <h6><b>Available Swines</b></h6>
                            <div class="divider"></div>

                            <!-- Empty -->
                            <div v-if="availableSwines.length < 1" class="center-align">
                                <p><br>Sorry, there are no available swines.</p>
                            </div>

                            <!-- Non-empty -->
                            <div v-else v-for="swine in availableSwines"
                                :key="swine.swineId"
                                class="col s6 m3 checkbox-container"
                            >
                                <input v-model="swineIdsToAdd"
                                    :value="swine.swineId"
                                    :id="`swine-${swine.swineId}`"
                                    type="checkbox" 
                                    class="filled-in" 
                                />
                                <label :for="`swine-${swine.swineId}`" class="black-text">
                                    {{ swine.registrationNo }} <br>
                                    <span class="grey-text">{{ swine.breedTitle }}</span>
                                </label>
                            </div>

                            <!-- Add Swines button container -->
                            <div id="add-swine-btn-container" class="col s12 center-align">
                                <button @click.prevent="addSwines($event)"
                                    class="btn z-depth-0 add-swines-btn"
                                >
                                    Add Chosen Swines
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <!-- Request for Inspection Modal -->
            <div id="request-for-inspection-modal-2" class="modal">
                <div class="modal-content">
                    <h4>
                        Request for Inspection
                        <i class="material-icons right modal-close">close</i>
                    </h4>

                    <div class="row modal-input-container">
                        <div class="col s12"><br/></div>
                        <div class="input-field col s12">
                            <p>
                                Are you sure you want to request 
                                <b>Inspection #{{ requestData.inspectionId }}</b>
                                from <b>{{ requestData.farmName }}</b>
                                for inspection?
                            </p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer grey lighten-3">
                    <a href="#!" class="modal-action modal-close btn-flat">Cancel</a>
                    <a @click.prevent="requestForInspection($event)" 
                        href="#!" 
                        class="modal-action btn blue darken-1 z-depth-0 request-for-inspection-btn"
                    >
                        Request
                    </a>
                </div>
            </div>

            <!-- Remove Swine Modal -->
            <div id="remove-swine-modal" class="modal">
                <div class="modal-content">
                    <h4>
                        Remove Swine
                        <i class="material-icons right modal-close">close</i>
                    </h4>

                    <div class="row modal-input-container">
                        <div class="col s12"><br/></div>
                        <div class="col s12">
                            <p>
                                Are you sure you want to remove <b>{{ removeSwineData.registrationNo }}</b> 
                                from <b>Inspection #{{ removeSwineData.inspectionId }}</b>?
                            </p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer grey lighten-3">
                    <a href="#!" class="modal-action modal-close btn-flat">Cancel</a>
                    <a @click.prevent="removeSwine($event)" 
                        href="#!" 
                        class="modal-action btn red lighten-2 z-depth-0 remove-swine-btn"
                    >
                        Remove
                    </a>
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
                availableSwines: [],
                includedSwines: [],
                swineIdsToAdd: [],
                removeSwineData: {
                    inspectionId: 0,
                    itemId: 0,
                    registrationNo: '',
                },
                requestData: {
                    inspectionId: 0,
                    farmName: ''
                }
            }
        },

        watch: {
            inspectionData: {
                handler: function(newValue, oldValue) {
                    if(newValue.inspectionId !== 0) {
                        this.fetchSwinesWithInspection(newValue);
                    }
                },
                deep: true
            }
        },

        methods: {
            hideAddSwineView() {
                this.loading = true;
                this.$emit('hideSwineViewEvent', 'add');
            },

            fetchSwinesWithInspection(inspectionData) {
                const inspectionId = inspectionData.inspectionId;

                axios.get(`/breeder/inspections/${inspectionId}/swines`)
                .then(({data}) => {
                    this.availableSwines = data.available;
                    this.includedSwines = data.included;
                    
                    setTimeout(() => {
                        this.loading = false;
                    }, 1000);
                })
                .catch((error) => {
                    console.log(error);
                });
            },

            addSwines(event) {
                const vm = this;
                const addSwinesBtn = $('.add-swines-btn');
                const inspectionId = this.inspectionData.inspectionId;

                this.disableButtons(addSwinesBtn, event.target, 'Adding...');

                // Add to server's database
                axios.post(`/breeder/inspections/${inspectionId}/swines`, {
                    swineIds: vm.swineIdsToAdd
                })
                .then(({data}) => {
                    // Put response in local data storage
                    vm.availableSwines = data.available;
                    vm.includedSwines = data.included;

                    // Update UI after adding swines to inspection request
                    vm.$nextTick(() => {
                        this.enableButtons(addSwinesBtn, event.target, 'Add Chosen Swines');

                        Materialize.toast('Swines successfully added', 2000, 'green lighten-1');
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
            },

            showRemoveSwineModal(removeSwineData) {
                this.removeSwineData = removeSwineData;

                // Materialize component initializations
                $('.modal').modal();
                $('#remove-swine-modal').modal('open');
            },

            removeSwine(event) {
                const vm = this;
                const removeSwineBtn = $('.remove-swine-btn');
                const inspectionId = this.removeSwineData.inspectionId;
                const itemId = this.removeSwineData.itemId;

                this.disableButtons(removeSwineBtn, event.target, 'Removing...');

                // Remove from server's database
                axios.delete(`/breeder/inspections/${inspectionId}/item/${itemId}`)
                .then(({data}) => {
                    const registrationNo = vm.removeSwineData.registrationNo;

                    // Put response in local data storage
                    vm.availableSwines = data.available;
                    vm.includedSwines = data.included;

                    vm.removeSwineData = {
                        inspectionId: 0,
                        itemId: 0,
                        registrationNo: '',
                    };

                    // Update UI after removing swine from inspection
                    vm.$nextTick(() => {
                        $('#remove-swine-modal').modal('close');

                        this.enableButtons(removeSwineBtn, event.target, 'Remove');

                        Materialize.toast(`Swine ${registrationNo} removed`, 2000, 'green lighten-1');
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
            },

            showRequestModal() {
                this.requestData.inspectionId = this.inspectionData.inspectionId;
                this.requestData.farmName = this.inspectionData.farmName;

                this.$nextTick(() => {
                    // Materialize component initializations
                    $('.modal').modal();
                    $('#request-for-inspection-modal-2').modal('open');
                });
            },

            requestForInspection(event) {
                const vm = this;
                const requestForInspectionBtn = $('.request-for-inspection-btn');
                const addSwinesBtn = $('.add-swines-btn');
                const inspectionId = this.inspectionData.inspectionId;

                this.disableButtons(requestForInspectionBtn, event.target, 'Requesting...');
                this.disableButtons(addSwinesBtn, {}, 'Add Chosen Swines');

                // Update from server's database
                axios.patch(`/breeder/inspections/${inspectionId}`, {})
                .then(({data}) => {
                    if(data.requested) {
                        // Update UI after requesting the inspection
                        vm.$nextTick(() => {
                            $('#request-for-inspection-modal-2').modal('close');

                            this.enableButtons(requestForInspectionBtn, event.target, 'Requested');
    
                            Materialize.toast(`Inspection #${inspectionId} successfully requested.`, 2000, 'green lighten-1');

                            this.$emit('inspectionForRequestEvent', {
                                inspectionId: inspectionId,
                                dateRequested: data.dateRequested
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

    #included-swines-container, #available-swines-container {
        padding: 2rem 0 1rem 0;
    }

    .checkbox-container, .included-swine-container {
        padding: 1rem 0 0 0;
    }

    #add-swine-btn-container {
        padding: 2rem 0 0 0;
    }

    .cancel-swine-icon {
        cursor: pointer;
    }

    /* Modal customizations */
    #remove-swine-modal, #request-for-inspection-modal-2 {
        width: 40rem;
    }

    .modal .modal-footer {
        padding-right: 2rem;
    }
</style>
