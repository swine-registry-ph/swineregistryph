<template lang="html">
    <div class="col s10 offset-s1">

        <transition name="view-fade">
        <div v-if="!showViewSwine">
            <div class="col s12">
                <h4 class="title-page"> Inspection Requests </h4>
            </div>

            <div class="col s4 m3 l3">
                <ul class="collapsible" data-collapsible="expandable">
                    <li>
                        <!-- Status filter -->
                        <div class="collapsible-header active"><b>Status</b></div>
                        <div class="collapsible-body">
                            <p class="range-field">
                                <template v-for="status in statuses">
                                    <input v-model="filterOptions.status"
                                        type="checkbox" 
                                        class="filled-in" 
                                        :value="status.value" 
                                        :id="status.value"
                                    />
                                    <label :for="status.value"> {{status.text}} </label> <br>
                                </template>
                            </p>
                        </div>
                    </li>
                </ul>
            </div>

            <div class="col s8 m9 l9">
                <ul class="collection with-header">
                    <!-- Existing Inspection Requests container -->
                    <li v-for="(inspection, index) in paginatedRequests" 
                        class="collection-item avatar"
                        :key="inspection.id"
                    >
                        <span>
                            <h5><b>Inspection #{{ inspection.id }}</b></h5>
                            <template v-if="inspection.status === 'draft'">
                                <span><b>(Draft)</b></span>
                            </template>
                            <template v-if="inspection.status === 'requested'">
                                <span>
                                    <b class="lime-text text-darken-2">Requested</b> <br>
                                    {{ inspection.dateRequested }}
                                </span>
                            </template>
                            <template v-if="inspection.status === 'for_inspection'">
                                <span>
                                    <b class="purple-text text-darken-2">For Inspection</b> <br>
                                    {{ inspection.dateInspection }}
                                </span>
                            </template>
                            <template v-if="inspection.status === 'approved'">
                                <span>
                                    <b class="green-text text-darken-2">Approved</b> <br>
                                    {{ inspection.dateApproved }}
                                </span>
                            </template> <br> <br>
                            <span class="grey-text text-darken-1">
                                <i class="material-icons left">location_on</i>
                                {{ inspection.farmName }}
                            </span>
                        </span>
                        <span v-if="inspection.status === 'requested'" 
                            class="secondary-content"
                        >
                            <a @click.prevent="showMarkInspectionModal(
                                    inspection.id,
                                    inspection.farmName
                                )"
                                href="#"
                                class="btn
                                    mark-inspection-button
                                    blue darken-1
                                    z-depth-0"
                            >
                                Mark for Inspection
                            </a>
                            <a @click.prevent="showSwineView(
                                    'view', 
                                    inspection.id, 
                                    inspection.farmName,
                                    inspection.status
                                )"
                                class="btn btn-flat 
                                    blue-text
                                    text-darken-1 
                                    custom-secondary-btn"
                            >
                                View Swine
                            </a>
                        </span>
                        <span v-if="inspection.status === 'for_inspection'"
                            class="secondary-content"
                        >
                            <a @click.prevent="showApproveInspectionModal(
                                    inspection.id,
                                    inspection.farmName
                                )"
                                href="#"
                                class="btn
                                    approve-inspection-button
                                    blue darken-1
                                    z-depth-0"
                            >
                                Approve
                            </a>
                            <a :href="`/evaluator/manage/inspections/${inspection.id}/view-pdf`" 
                                target="_blank"
                                class="btn btn-flat
                                    view-pdf-button 
                                    blue-text
                                    text-darken-1 
                                    custom-secondary-btn"
                            >
                                View PDF
                            </a>
                            <a class="btn btn-flat
                                    blue-text
                                    text-darken-1 
                                    custom-tertiary-btn"
                            >
                                Edit Data
                            </a>
                        </span>
                        <span v-if="inspection.status === 'approved'" 
                            class="secondary-content"
                        >
                            <a @click.prevent="showSwineView(
                                    'view', 
                                    inspection.id, 
                                    inspection.farmName,
                                    inspection.status
                                )"
                                class="btn
                                    blue
                                    darken-1
                                    z-depth-0"
                            >
                                View Swine
                            </a>
                        </span>
                    </li>
                    <!-- Empty Inspection Requests container -->
                    <li v-show="paginatedRequests.length === 0"
                        class="collection-item avatar center-align"
                    >
                        <p>
                            <br>
                            <b>Sorry, no inspection requests found.</b>
                        </p>
                    </li>
                </ul>

                <!-- Pagination -->
                <div class="col s12 center-align pagination-container">
                    <ul class="pagination">
                        <li :class="(pageNumber === 0) ? 'disabled' : 'waves-effect'">
                            <a @click.prevent="previousPage()">
                                <i class="material-icons">chevron_left</i>
                            </a>
                        </li>
                        <li v-for="i in pageCount"
                            class="waves-effect"
                            :class="(i === pageNumber + 1) ? 'active' : 'waves-effect'"
                        >
                            <a @click.prevent="goToPage(i)"> {{ i }} </a>
                        </li>
                        <li :class="(pageNumber >= pageCount - 1) ? 'disabled' : 'waves-effect'">
                            <a @click.prevent="nextPage()">
                                <i class="material-icons">chevron_right</i>
                            </a>
                        </li>
                    </ul>
                </div>

                <!-- Mark for Inspection Modal -->
                <div id="mark-for-inspection-modal" class="modal">
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

                <!-- Approve Inspection Modal -->
                <div id="approve-inspection-modal" class="modal">
                    <div class="modal-content">
                        <h4>
                            Approve Inspection
                            <i class="material-icons right modal-close">close</i>
                        </h4>

                        <div class="row modal-input-container">
                            <div class="col s12"><br/></div>
                            <div class="input-field col s12">
                                <p>
                                    Are you sure you want to approve 
                                    <b>Inspection #{{ approveInspectionData.inspectionId }}</b>
                                    from <b>{{ approveInspectionData.farmName }}</b>
                                    implying that its swine data are correct?
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer grey lighten-3">
                        <a href="#!" class="modal-action modal-close btn-flat">Cancel</a>
                        <a @click.prevent="approveInspection($event)" 
                            href="#!" 
                            class="modal-action btn green darken-1 z-depth-0 approve-inspection-btn"
                        >
                            Approve
                        </a>
                    </div>
                </div>
            </div>
        </div>
        </transition>

        <!-- Included Swine View -->
        <transition name="included-fade">
            <inspection-requests-evaluator-view-swine
                v-show="showViewSwine"
                v-on:hideSwineViewEvent="hideSwineView"
                v-on:markInspectionEvent="inspectionForMarking"
                :inspection-data="inspectionData"
            >
            </inspection-requests-evaluator-view-swine>
        </transition>
    </div>
</template>

<script>
    import InspectionRequestsEvaluatorViewSwine from './InspectionRequestsEvaluatorViewSwine.vue';
    
    export default {
        props: {
            currentFilterOptions: Object,
            customInspectionRequests: Array,
            viewUrl: String
        },

        components: {
            InspectionRequestsEvaluatorViewSwine
        },

        data() {
            return {
                showViewSwine: false,
                pageNumber: 0,
                paginationSize: 15,
                filterOptions: this.currentFilterOptions,
                inspectionRequests: this.customInspectionRequests,
                statuses: [
                    {
                        text: 'Requested',
                        value: 'requested'
                    },
                    {
                        text: 'For Inspection',
                        value: 'for_inspection'
                    },
                    {
                        text: 'Approved',
                        value: 'approved'
                    }
                ],
                inspectionData: {
                    inspectionId: 0,
                    farmName: '',
                    status: ''
                },
                markInspectionData: {
                    inspectionId: 0,
                    farmName: '',
                    dateInspection: '',
                },
                approveInspectionData: {
                    inspectionId: 0,
                    farmName: ''
                }
            }
        },

        computed: {
            pageCount() {
                let l = this.inspectionRequests.length;
                let s = this.paginationSize;

                return Math.ceil(l/s);
            },

            paginatedRequests() {
                const start = this.pageNumber * this.paginationSize;
                const end = start + this.paginationSize;

                return _.sortBy(this.inspectionRequests, ['id']).slice(start, end);
            }
        },

        watch: {
            filterOptions: {
                handler: function(oldValue, newValue) {
                    // Watch filterOptions object for url rewrite
                    this.rewriteUrl(newValue, '');
                },
                deep: true
            }
        },

        methods: {
            previousPage() {
                if(this.pageNumber !== 0) this.pageNumber--;
            },

            nextPage() {
                if(this.pageNumber < this.pageCount -1) this.pageNumber++;
            },

            goToPage(page) {
                this.pageNumber = page - 1;
            },

            rewriteUrl(filterOptions, searchParameter) {
                /**
                 *  URL rewrite syntax: 
                 *  ?q=value*
                 *  &status=value[+value]*
                 */
                let url = this.viewUrl;
                let parameters = [];

                // Put search parameter in parameters if it is non-empty
                if(searchParameter.length > 0){
                    let qParameter = `q=${searchParameter}`;

                    parameters.push(qParameter);
                }

                // Put status parameter in parameters if filter is chosen
                if(filterOptions.status.length > 0){
                    let statusParameter = 'status=';
                    statusParameter += filterOptions.status.join('+');

                    parameters.push(statusParameter);
                }

                // Redirect to new url
                if(parameters.length > 0) window.location = url + '?' + parameters.join('&');
                else window.location = url;
            },

            showMarkInspectionModal(inspectionId, farmName) {
                this.markInspectionData.inspectionId = inspectionId;
                this.markInspectionData.farmName = farmName;

                this.$nextTick(() => {
                    // Materialize component initializations
                    $('.modal').modal();
                    $('#mark-for-inspection-modal').modal('open');
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
                        // Update local data storage
                        const index = _.findIndex(vm.customInspectionRequests, 
                            ['id', inspectionId]
                        );

                        const inspectionRequest = vm.customInspectionRequests[index];
                        inspectionRequest.status = 'for_inspection';
                        inspectionRequest.dateInspection = data.dateInspection;

                        // Clear markInspectionData
                        vm.markInspectionData.dateInspection = '';

                        // Update UI after requesting the inspection
                        vm.$nextTick(() => {
                            $('#mark-for-inspection-modal').modal('close');
                            this.enableButtons(markForInspectionBtn, event.target, 'Mark');
    
                            Materialize.updateTextFields();
                            Materialize.toast(
                                `Inspection #${inspectionId} successfully marked for inspection.`, 
                                2000, 
                                'green lighten-1'
                            );
                        });
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
            },

            inspectionForMarking(data) {
                const index = _.findIndex(this.inspectionRequests, 
                    ['id', data.inspectionId]
                );

                const inspectionRequest = this.customInspectionRequests[index];
                inspectionRequest.status = 'for_inspection';
                inspectionRequest.dateInspection = data.dateInspection;
            },

            showApproveInspectionModal(inspectionId, farmName) {
                this.approveInspectionData.inspectionId = inspectionId;
                this.approveInspectionData.farmName = farmName;

                this.$nextTick(() => {
                    // Materialize component initializations
                    $('.modal').modal();
                    $('#approve-inspection-modal').modal('open');
                });
            },

            approveInspection(event) {
                const vm = this;
                const approveInspectionBtn = $('.approve-inspection-btn');
                const inspectionId = this.approveInspectionData.inspectionId;

                this.disableButtons(approveInspectionBtn, event.target, 'Approving...');

                // Update from server's database
                axios.patch(`/evaluator/manage/inspections/${inspectionId}`, 
                    {
                        inspectionId: inspectionId,
                        status: 'approved'
                    }
                )
                .then(({data}) => {
                    if(data.approved) {
                        // Update local data storage
                        const index = _.findIndex(vm.customInspectionRequests, 
                            ['id', inspectionId]
                        );

                        const inspectionRequest = vm.customInspectionRequests[index];
                        inspectionRequest.status = 'approved';
                        inspectionRequest.dateApproved = data.dateApproved;

                        // Update UI after requesting the inspection
                        vm.$nextTick(() => {
                            $('#approve-inspection-modal').modal('close');
                            this.enableButtons(approveInspectionBtn, event.target, 'Approve');

                            Materialize.toast(
                                `Inspection #${inspectionId} successfully approved.`, 
                                2000, 
                                'green lighten-1'
                            );
                        });
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
            },

            showSwineView(type, inspectionId, farmName, status) {
                if (type === 'edit') this.showEditSwine = true;
                else if (type === 'view') this.showViewSwine = true;

                this.inspectionData = {
                    inspectionId,
                    farmName,
                    status
                };
            },

            hideSwineView(type) {
                if(type === 'edit') this.showEditSwine = false;
                else if(type === 'view') this.showViewSwine = false;
            
                // Re-initialize collapsbile component
                this.$nextTick(() => {
                    $('.collapsible').collapsible();
                    $('.tooltipped').tooltip({delay: 50});
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
    .approve-inspection-button, 
    .mark-inspection-button, 
    .view-pdf-button,
    .approved-disabled-button {
        margin-right: .5rem;
    }

    .custom-secondary-btn {
        border: 1px solid;
        background-color: white;
    }

    .custom-tertiary-btn:hover {
        background-color: rgba(173, 173, 173, 0.3);
    }

    /* Collapsible customizations */
    div.collapsible-body {
        background-color: rgba(255, 255, 255, 0.7);
    }

    p.range-field {
        margin: 0;
    }

    p.range-field label {
        color: black;
    }

    /* Collection customizations */
    .collection-item.avatar {
        padding-left: 20px !important;
        padding-bottom: 1.5rem;
    }

    /* Modal customizations */
    #mark-for-inspection-modal, #approve-inspection-modal {
        width: 40rem;
    }

    #mark-for-inspection-modal .modal-input-container {
        padding-bottom: 10rem;
    }

    .modal .modal-footer {
        padding-right: 2rem;
    }

    /* Fade animations */
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }

    .view-fade-enter-active {
        transition: opacity .5s;
    }

    .view-fade-leave-active {
        transition: opacity .15s;
    }

    .included-fade-enter-active {
        transition: opacity 1.5s;
    }

    .included-fade-leave-active {
        transition: opacity .5s;
    }

    /* .fade-leave-active below version 2.1.8 */
    .fade-enter, .fade-leave-to,
    .view-fade-enter, .view-fade-leave-to,
    .included-fade-enter, .included-fade-leave-to {
        opacity: 0;
    }
</style>
