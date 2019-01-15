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
                    <!-- Toggle add certificate request container button -->
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
                                <a @click.prevent="addCertificateRequest($event)"
                                    href="#!"
                                    class="right btn z-depth-0 add-request-button"
                                >
                                    Add Certificate Request
                                </a>
                            </div>
                        </div>
                    </li>
                    <!-- Existing Certificate Requests container -->
                    <li v-for="(certificate, index) in paginatedRequests" 
                        class="collection-item avatar"
                        :key="certificate.id"
                    >
                        <span>
                            <h5><b>Request #{{ certificate.id }}</b></h5>
                            <template v-if="certificate.status === 'draft'">
                                <span>
                                    <b class="grey-text text-darken-2">Draft</b>
                                </span>
                            </template>
                            <template v-if="certificate.status === 'requested'">
                                <span>
                                    <b class="lime-text text-darken-2">Requested</b> <br>
                                    {{ certificate.dateRequested }} <br>
                                    Receipt No: {{ certificate.receiptNo }}
                                </span>
                            </template>
                            <template v-if="certificate.status === 'for_delivery'">
                                <span>
                                    <b class="purple-text text-darken-2">For Delivery</b> <br>
                                    {{ certificate.dateDelivery }} <br>
                                    Receipt No: {{ certificate.receiptNo }}
                                </span>
                            </template> <br> <br>
                            <span class="grey-text text-darken-1">
                                <i class="material-icons left">location_on</i>
                                {{ certificate.farmName }}
                            </span>
                        </span>
                        <span v-if="certificate.status === 'draft'" 
                            class="secondary-content"
                        >
                            <a @click.prevent="showSwineView(
                                    'add', 
                                    certificate.id, 
                                    certificate.farmName,
                                    certificate.status
                                )"
                                href="#"
                                class="btn
                                    add-swine-button
                                    blue darken-1
                                    z-depth-0"
                            >
                                Add Swine
                            </a>
                            <a @click.prevent="showRequestModal(certificate.id, certificate.farmName)"
                                class="btn btn-flat 
                                    blue-text
                                    text-darken-1 
                                    custom-secondary-btn"
                            >
                                Request for Approval
                            </a>
                        </span>
                        <span v-else
                            class="secondary-content"
                        >
                            <a @click.prevent="showSwineView(
                                    'view', 
                                    certificate.id, 
                                    certificate.farmName,
                                    certificate.status
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
                    <!-- Empty Certificate Requests container -->
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

                <!-- Request for Approval Modal -->
                <div id="request-for-approval-modal" class="modal">
                    <div class="modal-content">
                        <h4>
                            Request for Approval
                            <i class="material-icons right modal-close">close</i>
                        </h4>

                        <div class="row modal-input-container">
                            <div class="col s12"><br/></div>
                            <div class="input-field col s12">
                                <p>
                                    Are you sure you want to request 
                                    <b>Certificate Request #{{ requestData.certificateRequestId }}</b>
                                    from <b>{{ requestData.farmName }}</b>
                                    for approval?
                                </p>
                            </div>
                            <div class="input-field col s12">
                                <input v-model="requestData.receiptNo"
                                    id="request-data-receipt"
                                    type="text"
                                    class="validate"
                                >
                                <label for="request-data-receipt">Receipt No.</label>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer grey lighten-3">
                        <a href="#!" class="modal-action modal-close btn-flat">Cancel</a>
                        <a @click.prevent="requestForApproval($event)" 
                            href="#!" 
                            class="modal-action btn blue darken-1 z-depth-0 request-for-approval-btn"
                        >
                            Request
                        </a>
                    </div>
                </div>
            </div>
        </div>
        </transition>

        <!-- Add Swine to Certificate Request View -->
        <transition name="add-fade">
            <certificate-requests-breeder-add-swine
                v-show="showAddSwine"
                v-on:hideSwineViewEvent="hideSwineView"
                v-on:certificateForApprovalEvent="certificateForApproval"
                :certificate-data="certificateData"
            >
            </certificate-requests-breeder-add-swine>
        </transition>

        <!-- Included Swine View -->
        <transition name="included-fade">
            <certificate-requests-breeder-view-swine
                v-show="showViewSwine"
                v-on:hideSwineViewEvent="hideSwineView"
                :certificate-data="certificateData"
            >
            </certificate-requests-breeder-view-swine>
        </transition>
  
    </div>
</template>

<script>
    import CertificateRequestsBreederAddSwine from './CertificateRequestsBreederAddSwine.vue';
    import CertificateRequestsBreederViewSwine from './CertificateRequestsBreederViewSwine.vue';

    export default {
        props: {
            user: Object,
            currentFilterOptions: Object,
            customCertificateRequests: Array,
            farmOptions: Array,
            viewUrl: String
        },

        components: {
            CertificateRequestsBreederAddSwine,
            CertificateRequestsBreederViewSwine
        },

        data() {
            return {
                showAddRequestInput: false,
                showAddSwine: false,
                showViewSwine: false,
                pageNumber: 0,
                paginationSize: 15,
                filterOptions: this.currentFilterOptions,
                certificateRequests: this.customCertificateRequests,
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
                        text: 'On Delivery',
                        value: 'on_delivery'
                    }
                ],
                addRequestData: {
                    breederId: this.user.id,
                    farmId: ''
                },
                certificateData: {
                    certificateRequestId: 0,
                    farmName: '',
                    status: ''
                },
                requestData: {
                    certRequestId: 0,
                    farmName: '',
                    receiptNo: ''
                }
            }
        },

        computed: {
            pageCount() {
                let l = this.certificateRequests.length;
                let s = this.paginationSize;

                return Math.ceil(l/s);
            },

            paginatedRequests() {
                const start = this.pageNumber * this.paginationSize;
                const end = start + this.paginationSize;

                return _.sortBy(this.certificateRequests, ['id']).slice(start, end);
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

            addCertificateRequest(event) {
                const vm = this;
                const addCertificateRequestBtn = $('.add-request-button');

                if (!vm.addRequestData.farmId) {
                    Materialize.toast('Please choose farm for request', 2000);
                    return;
                }

                this.disableButtons(addCertificateRequestBtn, event.target, 'Adding...');

                // Add to server's database
                axios.post('/breeder/certificates', {
                    breederId: vm.addRequestData.breederId,
                    farmId: vm.addRequestData.farmId
                })
                .then((response) => {
                    // Put response in local data storage and erase adding of request data
                    vm.certificateRequests.push(response.data);
                    vm.addRequestData.farmId = '';

                    // Update UI after adding certificate request
                    vm.$nextTick(() => {
                        this.enableButtons(addCertificateRequestBtn, event.target, 'Add Certificate Request');

                        Materialize.updateTextFields();
                        Materialize.toast('Certificate request added', 2000, 'green lighten-1');
                    });
                })
                .catch((error) => {
                    this.enableButtons(addCertificateRequestBtn, event.target, 'Add Certificate Request');

                    Materialize.updateTextFields();
                    Materialize.toast('Error occurred', 2000, 'red lighten-1');
                });
            },

            showSwineView(type, certificateRequestId, farmName, status) {
                if (type === 'add') this.showAddSwine = true;
                else if (type === 'view') this.showViewSwine = true;

                this.certificateData = {
                    certificateRequestId,
                    farmName,
                    status
                };
            },

            showRequestModal(certificateRequestId, farmName) {
                this.requestData.certificateRequestId = certificateRequestId;
                this.requestData.farmName = farmName;

                this.$nextTick(() => {
                    // Materialize component initializations
                    $('.modal').modal();
                    $('#request-for-approval-modal').modal('open');
                });
            },

            requestForApproval(event) {
                const vm = this;
                const requestForApprovalBtn = $('.request-for-approval-btn');
                const certificateRequestId = this.requestData.certificateRequestId;

                if (this.requestData.receiptNo === '') {
                    $('#request-for-approval-modal').modal('close');

                    Materialize.toast('Please input receipt no.', 2000);
                    return;
                }

                this.disableButtons(requestForApprovalBtn, event.target, 'Requesting...');

                // Update from server's database
                axios.patch(`/breeder/certificates/${certificateRequestId}`, {
                    receiptNo: vm.requestData.receiptNo
                })
                .then(({data}) => {
                    if(data.requested) {
                        // Update local data storage
                        this.certificateForApproval({
                            certificateRequestId: certificateRequestId,
                            dateRequested: data.dateRequested,
                            receiptNo: data.receiptNo
                        });

                        // Update UI after requesting the certificate request
                        vm.$nextTick(() => {
                            $('#request-for-approval-modal').modal('close');
                            this.enableButtons(requestForApprovalBtn, event.target, 'Request');
    
                            Materialize.toast(`Certificate Request #${certificateRequestId} for approval successfully requested.`, 2500, 'green lighten-1');
                        });
                    }
                    else {
                        // Make sure there are included swines before requesting
                        vm.$nextTick(() => {
                            $('#request-for-approval-modal').modal('close');
                            this.enableButtons(requestForApprovalBtn, event.target, 'Request');
    
                            Materialize.updateTextFields();
                            Materialize.toast('Please include swines to request.', 2000);
                        });
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
            },

            certificateForApproval(data) {
                const index = _.findIndex(this.customCertificateRequests, 
                    ['id', data.certificateRequestId]
                );

                const certificateRequest = this.customCertificateRequests[index];
                certificateRequest.status = 'requested';
                certificateRequest.dateRequested = data.dateRequested;
                certificateRequest.receiptNo = data.receiptNo;
            },

            hideSwineView(type) {
                if(type === 'add') this.showAddSwine = false;
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
    #request-for-approval-modal {
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
