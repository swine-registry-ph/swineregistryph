<template lang="html">
    <div class="col s10 offset-s1">

        <transition name="view-fade">
        <div v-if="!showViewSwine">
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
                    <!-- Existing Certificate Requests container -->
                    <li v-for="(certificate, index) in paginatedRequests" 
                        class="collection-item avatar"
                        :key="certificate.id"
                    >
                        <span>
                            <h5><b>Certificate #{{ certificate.id }}</b></h5>
                            <template v-if="certificate.status === 'requested'">
                                <span>
                                    <b class="lime-text text-darken-2">Requested</b> <br>
                                    {{ certificate.dateRequested }} <br>
                                    <a :href="`${photoUrl}/${certificate.paymentPhotoName}`" 
                                        target="_blank"
                                        class="teal-text"
                                    >
                                        Payment Photo
                                    </a>
                                </span>
                            </template>
                            <template v-if="certificate.status === 'on_delivery'">
                                <span>
                                    <b class="purple-text text-darken-2">On Delivery</b> <br>
                                    {{ certificate.dateDelivery }} <br>
                                    Receipt No: {{ certificate.receiptNo }} <br>
                                    <a :href="`${photoUrl}/${certificate.paymentPhotoName}`" 
                                        target="_blank"
                                        class="teal-text"
                                    >
                                        Payment Photo
                                    </a>
                                </span>
                            </template> <br> <br>
                            <span class="grey-text text-darken-1">
                                <i class="material-icons left">location_on</i>
                                {{ certificate.farmName }}
                            </span>
                        </span>
                        <span v-if="certificate.status === 'requested'" 
                            class="secondary-content"
                        >
                            <a @click.prevent="showMarkDeliveryModal(
                                    certificate.id,
                                    certificate.farmName
                                )"
                                href="#"
                                class="btn
                                    mark-delivery-button
                                    blue darken-1
                                    z-depth-0"
                            >
                                Mark for Delivery
                            </a>
                            <a @click.prevent="showSwineView(
                                    'view', 
                                    certificate.id, 
                                    certificate.farmName,
                                    certificate.status
                                )"
                                class="btn btn-flat 
                                    blue-text
                                    text-darken-1 
                                    custom-secondary-btn"
                            >
                                View Swine
                            </a>
                        </span>
                        <span v-if="certificate.status === 'on_delivery'" 
                            class="secondary-content"
                        >
                            <a :href="`/admin/certificates/${certificate.id}/view-pdf`" 
                                target="_blank"
                                class="btn
                                    view-pdf-button 
                                    blue
                                    darken-1
                                    z-depth-0"
                            >
                                View PDF
                            </a>
                            <a @click.prevent="showSwineView(
                                    'view', 
                                    certificate.id, 
                                    certificate.farmName,
                                    certificate.status
                                )"
                                class="btn btn-flat
                                    blue-text
                                    text-darken-1
                                    custom-secondary-btn"
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
                            <br>
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

                <!-- Mark for Delivery Modal -->
                <div id="mark-for-delivery-modal" class="modal">
                    <div class="modal-content">
                        <h4>
                            Mark for Delivery
                            <i class="material-icons right modal-close">close</i>
                        </h4>

                        <div class="row modal-input-container">
                            <div class="col s12"><br/></div>
                            <div class="input-field col s12">
                                <p>
                                    Are you sure you want to mark 
                                    <b>Certificate Request #{{ markDeliveryData.certificateRequestId }}</b>
                                    from <b>{{ markDeliveryData.farmName }}</b>
                                    for delivery?
                                </p>
                            </div>
                            <div class="input-field col s12">
                                <input v-model="markDeliveryData.receiptNo"
                                    type="text"
                                    id="delivery-receipt"
                                    class="validate"
                                >
                                <label for="delivery-receipt"> Receipt No. </label>
                            </div>
                            <div class="input-field col s12">
                                <app-input-date
                                    v-model="markDeliveryData.dateDelivery"
                                    :min="true"
                                    @date-select="val => {markDeliveryData.dateDelivery = val}"
                                >
                                </app-input-date>
                                <label for=""> Date of Delivery </label>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer grey lighten-3">
                        <a href="#!" class="modal-action modal-close btn-flat">Cancel</a>
                        <a @click.prevent="markForDelivery($event)" 
                            href="#!" 
                            class="modal-action btn blue darken-1 z-depth-0 mark-for-delivery-btn"
                        >
                            Mark
                        </a>
                    </div>
                </div>

            </div>
        </div>
        </transition>

        <!-- Included Swine View -->
        <transition name="included-fade">
            <certificate-requests-admin-view-swine
                v-show="showViewSwine"
                v-on:hideSwineViewEvent="hideSwineView"
                v-on:markDeliveryEvent="certificateForMarking"
                :certificate-data="certificateData"
            >
            </certificate-requests-admin-view-swine>
        </transition>
    </div>
</template>

<script>
    import CertificateRequestsAdminViewSwine from './CertificateRequestsAdminViewSwine.vue';
    
    export default {
        props: {
            user: Object,
            currentFilterOptions: Object,
            customCertificateRequests: Array,
            viewUrl: String,
            photoUrl: String
        },

        components: {
            CertificateRequestsAdminViewSwine
        },

        data() {
            return {
                showViewSwine: false,
                pageNumber: 0,
                paginationSize: 15,
                filterOptions: this.currentFilterOptions,
                certificateRequests: this.customCertificateRequests,
                statuses: [
                    {
                        text: 'Requested',
                        value: 'requested'
                    },
                    {
                        text: 'On Delivery',
                        value: 'on_delivery'
                    }
                ],
                certificateData: {
                    certificateRequestId: 0,
                    farmName: '',
                    status: ''
                },
                markDeliveryData: {
                    certificateRequestId: 0,
                    farmName: '',
                    dateDelivery: '',
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

            showMarkDeliveryModal(certificateRequestId, farmName) {
                this.markDeliveryData.certificateRequestId = certificateRequestId;
                this.markDeliveryData.farmName = farmName;

                this.$nextTick(() => {
                    // Materialize component initializations
                    $('.modal').modal();
                    $('#mark-for-delivery-modal').modal('open');
                });
            },

            markForDelivery(event) {
                const vm = this;
                const markForDeliveryBtn = $('.mark-for-delivery-btn');
                const certificateRequestId = this.markDeliveryData.certificateRequestId;

                // Make sure dateDelivery is filled out
                if(!vm.markDeliveryData.dateDelivery) return;

                this.disableButtons(markForDeliveryBtn, event.target, 'Marking...');

                // Update from server's database
                axios.patch(`/admin/certificates/${certificateRequestId}`, 
                    {
                        certificateRequestId: certificateRequestId,
                        dateDelivery: vm.markDeliveryData.dateDelivery,
                        receiptNo: vm.markDeliveryData.receiptNo
                    }
                )
                .then(({data}) => {
                    if(data.marked) {
                        // Update local data storage
                        const index = _.findIndex(vm.customCertificateRequests, 
                            ['id', certificateRequestId]
                        );

                        const certificateRequest = vm.customCertificateRequests[index];
                        certificateRequest.status = 'on_delivery';
                        certificateRequest.dateDelivery = vm.markDeliveryData.dateDelivery;
                        certificateRequest.receiptNo = vm.markDeliveryData.receiptNo;

                        // Clear markDeliveryData
                        vm.markDeliveryData.dateDelivery = '';
                        vm.markDeliveryData.receiptNo = '';

                        // Update UI after requesting the certificate
                        vm.$nextTick(() => {
                            $('#mark-for-delivery-modal').modal('close');
                            this.enableButtons(markForDeliveryBtn, event.target, 'Mark');
    
                            Materialize.updateTextFields();
                            Materialize.toast(
                                `Certificate Request #${certificateRequestId} successfully marked for delivery.`, 
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

            certificateForMarking(data) {
                const index = _.findIndex(this.certificateRequests, 
                    ['id', data.certificateRequestId]
                );

                const certificateRequest = this.customCertificateRequests[index];
                certificateRequest.status = 'on_delivery';
                certificateRequest.dateDelivery = data.dateDelivery;
                certificateRequest.receiptNo = data.receiptNo;
            },

            showSwineView(type, certificateRequestId, farmName, status) {
                if (type === 'view') this.showViewSwine = true;

                this.certificateData = {
                    certificateRequestId,
                    farmName,
                    status
                };
            },

            hideSwineView(type) {
                if(type === 'view') this.showViewSwine = false;
            
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
    .mark-delivery-button, .view-pdf-button {
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
    #mark-for-delivery-modal {
        width: 40rem;
    }

    #mark-for-delivery-modal .modal-input-container {
        padding-bottom: 7rem;
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
