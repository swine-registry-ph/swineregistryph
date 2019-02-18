<template>
    <div class="col s12">

        <div class="col s12">
            <h4 class="title-page"> Certificate Request Swines </h4>
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

        <!-- Certificate Request details container -->
        <div v-else class="col s12">
            <div id="certificate-container" class="card z-depth-0">
                <div class="card-content">
                    <span class="card-title">
                        <b>Certificate Request #{{ certificateData.certificateRequestId }}</b>
                        <a v-if="certificateData.status === 'requested'"
                            @click.prevent="showMarkDeliveryModal(
                                certificateData.certificateRequestId,
                                certificateData.farmName
                            )" 
                            href="#"
                            class="btn right 
                                blue-text
                                text-darken-1 
                                custom-secondary-btn
                                z-depth-0"
                        >
                            Mark For Delivery
                        </a>
                        <a v-if="certificateData.status === 'on_delivery'"
                            href="#"
                            class="btn right 
                                blue-text
                                text-darken-1 
                                custom-secondary-btn
                                z-depth-0
                                disabled"
                        >
                            On Delivery
                        </a>
                    </span>
                    <p class="grey-text">
                        {{ certificateData.farmName }}
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

                    <!-- Mark for Delivery Modal -->
                    <div id="mark-for-delivery-modal-2" class="modal">
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
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            certificateData: Object,
        },

        data() {
            return {
                loading: true,
                includedSwines: [],
                markDeliveryData: {
                    certificateRequestId: 0,
                    farmName: '',
                    dateDelivery: '',
                    receiptNo: ''
                }
            }
        },

        watch: {
            certificateData: {
                handler: function(newValue, oldValue) {
                    if(newValue.certificateRequestId !== 0) {
                        this.fetchSwinesWithCertificateRequest(newValue);
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

            fetchSwinesWithCertificateRequest(certificateData) {
                const certificateRequestId = certificateData.certificateRequestId;

                axios.get(`/admin/certificates/${certificateRequestId}/swines`)
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

            showMarkDeliveryModal(certificateRequestId, farmName) {
                this.markDeliveryData.certificateRequestId = certificateRequestId;
                this.markDeliveryData.farmName = farmName;

                this.$nextTick(() => {
                    // Materialize component initializations
                    $('.modal').modal();
                    $('#mark-for-delivery-modal-2').modal('open');
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
                        // Clear markDeliveryData
                        vm.markDeliveryData.dateDelivery = '';
                        vm.markDeliveryData.receiptNo = '';

                        // Update UI after requesting the certificate
                        vm.$nextTick(() => {
                            $('#mark-for-delivery-modal-2').modal('close');
                            this.enableButtons(markForDeliveryBtn, event.target, 'Mark');
    
                            Materialize.updateTextFields();
                            Materialize.toast(
                                `Certificate Request #${certificateRequestId} successfully marked for delivery.`, 
                                2000, 
                                'green lighten-1'
                            );

                            this.$emit('markDeliveryEvent', {
                                certificateRequestId: certificateRequestId,
                                dateDelivery: data.dateDelivery,
                                receiptNo: data.receiptNo
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
    #mark-for-delivery-modal-2 {
        width: 40rem;
    }

    #mark-for-delivery-modal-2 .modal-input-container {
        padding-bottom: 7rem;
    }

    .modal .modal-footer {
        padding-right: 2rem;
    }
</style>
