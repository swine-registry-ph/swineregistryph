<template lang="html">
    <div class="col s10 offset-s1">
        
        <transition name="view-fade">
        <div v-if="!showAddSwine && !showViewSwine">
            <div class="col s12">
                <h4 class="title-page"> Certificate Requests </h4>
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
                    <!-- Toggle add inspection request container button -->
                    <li class="collection-header">
                        <a @click.prevent="showAddRequestInput = !showAddRequestInput"
                            href="#!"
                            id="toggle-add-request-container-button"
                            class="btn-floating waves-effect waves-light tooltipped"
                            data-position="right"
                            data-delay="50"
                            data-tooltip="Add new certificate request"
                        >
                            <i class="material-icons right">add</i>
                        </a>
                    </li>
                    <!-- Add certificate request container -->
                    <li v-show="showAddRequestInput" id="add-request-container" class="collection-item">
                        <div class="row">
                            <div class="col s12">
                                <i @click.prevent="showAddRequestInput = !showAddRequestInput"
                                    id="close-add-request-container-button"
                                    class="material-icons right"
                                >
                                    close
                                </i>
                            </div>
                            <div class="input-field col s6 offset-s3">
                                <app-input-select
                                    labelDescription="Farm"
                                    v-model="addRequestData.farmId"
                                    :options="farmOptions"
                                    @select="val => {addRequestData.farmId = val}"
                                >
                                </app-input-select>
                            </div>
                            <div class="col s4 offset-s4">
                                <a @click.prevent="addInspectionRequest($event)"
                                    href="#!"
                                    class="right btn z-depth-0 add-request-button"
                                >
                                    Add Certificate Request
                                </a>
                            </div>
                        </div>
                    </li>
                    <!-- Existing Inspection Requests container -->
                    <li v-for="(inspection, index) in paginatedRequests" 
                        class="collection-item avatar"
                        :key="inspection.id"
                    >
                        <span>
                            <h5><b>Inspection #{{ inspection.id }}</b></h5>
                            <template v-if="inspection.status === 'draft'">
                                <span>
                                    <b class="grey-text text-darken-2">Draft</b>
                                </span>
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
                        <span v-if="inspection.status === 'draft'" 
                            class="secondary-content"
                        >
                            <a @click.prevent="showSwineView('add', inspection.id, inspection.farmName)"
                                href="#"
                                class="btn
                                    add-swine-button
                                    blue darken-1
                                    z-depth-0"
                            >
                                Add Swine
                            </a>
                            <a @click.prevent="showRequestModal(inspection.id, inspection.farmName)"
                                class="btn btn-flat 
                                    blue-text
                                    text-darken-1 
                                    custom-secondary-btn"
                            >
                                Request for Inspection
                            </a>
                        </span>
                        <span v-else
                            class="secondary-content"
                        >
                            <a @click.prevent="showSwineView(
                                    'view', 
                                    inspection.id, 
                                    inspection.farmName,
                                    inspection.status
                                )"
                                href="#"
                                class="btn
                                    add-swine-button
                                    blue darken-1
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
                            <b>Sorry, no certificate requests found.</b>
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

                <!-- Request for Inspection Modal -->
                <div id="request-for-inspection-modal" class="modal">
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
            </div>
        </div>
        </transition>

        <!-- Add Swine to Inspection Request View -->
        <!-- <transition name="add-fade">
            <inspection-requests-breeder-add-swine
                v-show="showAddSwine"
                v-on:hideSwineViewEvent="hideSwineView"
                v-on:inspectionForRequestEvent="inspectionForRequest"
                :inspection-data="inspectionData"
            >
            </inspection-requests-breeder-add-swine>
        </transition> -->

        <!-- Included Swine View -->
        <!-- <transition name="included-fade">
            <inspection-requests-breeder-view-swine
                v-show="showViewSwine"
                v-on:hideSwineViewEvent="hideSwineView"
                :inspection-data="inspectionData"
            >
            </inspection-requests-breeder-view-swine>
        </transition> -->
  
    </div>
</template>

<script>
    // import InspectionRequestsBreederAddSwine from './InspectionRequestsBreederAddSwine.vue';
    // import InspectionRequestsBreederViewSwine from './InspectionRequestsBreederViewSwine.vue';

    export default {
        props: {
            user: Object,
            currentFilterOptions: Object,
            approvedSwines: Array,
            farmOptions: Array,
            viewUrl: String
        },

        // components: {
        //     InspectionRequestsBreederAddSwine,
        //     InspectionRequestsBreederViewSwine
        // },

        data() {
            return {
                showAddRequestInput: false,
                showAddSwine: false,
                showViewSwine: false,
                pageNumber: 0,
                paginationSize: 15,
                filterOptions: this.currentFilterOptions,
                inspectionRequests: this.customInspectionRequests,
                statuses: [
                    {
                        text: 'Draft',
                        value: 'draft'
                    },
                    {
                        text: 'Requested',
                        value: 'requested'
                    },
                    {
                        text: 'For Payment',
                        value: 'for_payment'
                    },
                    {
                        text: 'On Delivery',
                        value: 'on_delivery'
                    }
                ],
                addRequestData: {
                    breederId: this.user.id,
                    farmId: ''
                },
                certificateData: {
                    certRequestId: 0,
                    farmName: ''
                },
                requestData: {
                    certRequestId: 0,
                    farmName: ''
                }
            }
        },

        computed: {
            pageCount() {
                let l = this.approvedSwines.length;
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

            // addInspectionRequest(event) {
            //     const vm = this;
            //     const addInspectionRequestBtn = $('.add-request-button');

            //     this.disableButtons(addInspectionRequestBtn, event.target, 'Adding...');

            //     // Add to server's database
            //     axios.post('/breeder/inspections', {
            //         breederId: vm.addRequestData.breederId,
            //         farmId: vm.addRequestData.farmId
            //     })
            //     .then((response) => {
            //         // Put response in local data storage and erase adding of request data
            //         vm.inspectionRequests.push(response.data);
            //         vm.addRequestData.farmId = '';

            //         // Update UI after adding inspection request
            //         vm.$nextTick(() => {
            //             this.enableButtons(addInspectionRequestBtn, event.target, 'Add Inspection Request');

            //             Materialize.updateTextFields();
            //             Materialize.toast('Inspection request added', 2000, 'green lighten-1');
            //         });
            //     })
            //     .catch((error) => {
            //         console.log(error);
            //     });
            // },

            // showSwineView(type, inspectionId, farmName, status) {
            //     if (type === 'add') this.showAddSwine = true;
            //     else if (type === 'view') this.showViewSwine = true;

            //     this.inspectionData = {
            //         inspectionId,
            //         farmName,
            //         status
            //     };
            // },

            // showRequestModal(inspectionId, farmName) {
            //     this.requestData.inspectionId = inspectionId;
            //     this.requestData.farmName = farmName;

            //     this.$nextTick(() => {
            //         // Materialize component initializations
            //         $('.modal').modal();
            //         $('#request-for-inspection-modal').modal('open');
            //     });
            // },

            // requestForInspection(event) {
            //     const vm = this;
            //     const requestForInspectionBtn = $('.request-for-inspection-btn');
            //     const inspectionId = this.requestData.inspectionId;

            //     this.disableButtons(requestForInspectionBtn, event.target, 'Requesting...');

            //     // Update from server's database
            //     axios.patch(`/breeder/inspections/${inspectionId}`, {})
            //     .then(({data}) => {
            //         if(data.requested) {
            //             // Update local data storage
            //             this.inspectionForRequest({
            //                 inspectionId: inspectionId,
            //                 dateRequested: data.dateRequested
            //             });

            //             // Update UI after requesting the inspection
            //             vm.$nextTick(() => {
            //                 $('#request-for-inspection-modal').modal('close');
            //                 this.enableButtons(requestForInspectionBtn, event.target, 'Request');
    
            //                 Materialize.toast(`Inspection #${inspectionId} successfully requested.`, 2000, 'green lighten-1');
            //             });
            //         }
            //         else {
            //             // Make sure there are included swines before requesting
            //             vm.$nextTick(() => {
            //                 $('#request-for-inspection-modal').modal('close');
            //                 this.enableButtons(requestForInspectionBtn, event.target, 'Request');
    
            //                 Materialize.toast('Please include swines to request.', 2000);
            //             });
            //         }
            //     })
            //     .catch((error) => {
            //         console.log(error);
            //     });
            // },

            // inspectionForRequest(data) {
            //     const index = _.findIndex(this.customInspectionRequests, 
            //         ['id', data.inspectionId]
            //     );

            //     const inspectionRequest = this.customInspectionRequests[index];
            //     inspectionRequest.status = 'requested';
            //     inspectionRequest.dateRequested = data.dateRequested;
            // },

            // hideSwineView(type) {
            //     if(type === 'add') this.showAddSwine = false;
            //     else if(type === 'view') this.showViewSwine = false;
            
            //     // Re-initialize collapsbile component
            //     this.$nextTick(() => {
            //         $('.collapsible').collapsible();
            //         $('.tooltipped').tooltip({delay: 50});
            //     });
            // },

            disableButtons(buttons, actionBtnElement, textToShow) {
                buttons.addClass('disabled');
                actionBtnElement.innerHTML = textToShow;
            },

            enableButtons(buttons, actionBtnElement, textToShow) {
                buttons.removeClass('disabled');
                actionBtnElement.innerHTML = textToShow;
            }

        },

        mounted() {
            // Materialize component initializations
            $('.modal').modal();
        }

    }
</script>

<style scoped lang="css">
    .add-swine-button {
        margin-right: .5rem;
    }

    #add-request-container .input-field {
        margin-top: 2rem;
        margin-bottom: 2rem;
    }

    #close-add-request-container-button {
        cursor: pointer;
    }

    .custom-secondary-btn {
        border: 1px solid;
        background-color: white;
    }

    .custom-tertiary-btn:hover {
        background-color: rgba(173, 173, 173, 0.3);
    }

    /* Modal customizations */
    #request-for-inspection-modal {
        width: 40rem;
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

    .add-fade-enter-active, .included-fade-enter-active {
        transition: opacity 1.5s;
    }

    .add-fade-leave-active, .included-fade-leave-active {
        transition: opacity .5s;
    }

    /* .fade-leave-active below version 2.1.8 */
    .fade-enter, .fade-leave-to,
    .view-fade-enter, .view-fade-leave-to,
    .add-fade-enter, .add-fade-leave-to,
    .included-fade-enter, .included-fade-leave-to {
        opacity: 0;
    }

    /* Collection customizations */
    .collection-item.avatar {
        padding-left: 20px !important;
        padding-bottom: 1.5rem;
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

</style>
