<template lang="html">
    <div id="manage-farms-container" class="card">
        <div class="card-content">
            <h5> 
                <b class="name-chosen-breeder">{{ manageFarmsData.name }}</b>
                <i @click.prevent="toggleCloseFarmsDataContainerEvent" 
                    class="material-icons right"
                >
                    close
                </i>
            </h5>
            <br/>
            <h5 class="center-align"> Manage Farms </h5>
            <!-- Add Farm button -->
            <a @click.prevent="showAddFarmModal" 
                id="toggle-add-farm-btn" 
                class="btn z-depth-0" 
                href="#!"
            >
                <i class="material-icons left">add</i> Add Farm
            </a>
            <!-- Collection of Farms -->
            <ul class="collection">
                <li v-for="(farm, index) in manageFarmsData.farms"
                    :key="farm.id"
                    class="collection-item avatar"
                >
                    <span class="farm-title"> <b>{{ farm.name }} ({{ farm.farm_code }})</b> </span>
                    <p class="">
                        Accreditation No. : {{ farm.farm_accreditation_no }} <br/>
                        Accreditation Date. : {{ convertToReadableDate(farm.farm_accreditation_date) }}  <br/>
                    </p>
                    <p class="grey-text address-line">
                        <i class="material-icons left">location_on</i>
                        {{ farm.address_line1 }}, {{ farm.address_line2 }},
                        {{ farm.province }} ({{ farm.province_code }})
                    </p>
                    <a @click.prevent="showEditFarmModal(index)"
                        href="#!" 
                        class="secondary-content btn z-depth-0 custom-secondary-btn blue-text text-darken-1"
                    > 
                        Edit 
                    </a>
                </li>
            </ul>
        </div>

        <!-- Add Farm Modal -->
        <div id="add-farm-modal" class="modal modal-fixed-footer">
            <div class="modal-content">
                <h4>
                    Add Farm
                    <i class="material-icons right modal-close">close</i>
                </h4>
                <h5 class="grey-text text-darken-2"> {{ manageFarmsData.name }} </h5>

                <div class="row modal-input-container">
                    <div class="col s12"><br/></div>
                    <div class="input-field col s8">
                        <input v-model="addFarmData.name"
                            id="add-farm-name"
                            type="text"
                            class="validate"
                        >
                        <label for="add-farm-name">Name</label>
                    </div>
                    <div class="input-field col s4">
                        <input v-model="addFarmData.farmCode"
                            id="add-farm-code"
                            type="text"
                            class="validate"
                        >
                        <label for="add-farm-code">Farm Code</label>
                    </div>
                    <div class="col s12">
                        <br/>
                        <h6>
                            <b>Accreditation</b>
                        </h6>
                    </div>
                    <div class="input-field col s8">
                        <app-input-date
                            v-model="addFarmData.accreditationDate"
                            @date-select="val => {addFarmData.accreditationDate = val}"
                        >
                        </app-input-date>
                        <label for=""> Accreditation Date </label>
                    </div>
                    <div class="input-field col s4">
                        <input v-model="addFarmData.accreditationNo"
                            id="add-farm-accreditation-no"
                            type="text"
                            class="validate"
                        >
                        <label for="add-farm-accreditation-no">Accreditation No.</label>
                    </div>
                    <div class="col s12">
                        <br/>
                        <h6>
                            <b>Farm Address</b>
                        </h6>
                    </div>
                    <div class="input-field col s6">
                        <input v-model="addFarmData.addressLine1"
                            id="add-farm-address-one"
                            type="text"
                            class="validate"
                        >
                        <label for="add-farm-address-one">Address Line 1</label>
                    </div>
                    <div class="input-field col s6">
                        <input v-model="addFarmData.addressLine2"
                            id="add-farm-address-two"
                            type="text"
                            class="validate"
                        >
                        <label for="add-farm-address-two">Address Line 2</label>
                    </div>
                    <div class="input-field col s6">
                        <app-input-select
                            labelDescription="Province"
                            v-model="addFarmData.province"
                            :options="provinceOptions"
                            @select="val => {addFarmData.province = val}"
                        >
                        </app-input-select>
                    </div>
                </div>
            </div>
            <div class="modal-footer grey lighten-3">
                <a href="#!" class="modal-action modal-close btn-flat">Cancel</a>
                <a @click.prevent="addFarm($event)" 
                    href="#!" 
                    class="modal-action btn z-depth-0 add-farm-btn"
                >
                    Add
                </a>
            </div>
        </div>

        <!-- Edit Farm Modal -->
        <div id="edit-farm-modal" class="modal modal-fixed-footer">
            <div class="modal-content">
                <h4>
                    Edit Farm
                    <i class="material-icons right modal-close">close</i>
                </h4>
                <h5 class="grey-text text-darken-2"> {{ manageFarmsData.name }} </h5>

                <div class="row modal-input-container">
                    <div class="col s12"><br/></div>
                    <div class="input-field col s8">
                        <input v-model="editFarmData.name"
                            id="edit-farm-name"
                            type="text"
                            class="validate"
                        >
                        <label for="edit-farm-name">Name</label>
                    </div>
                    <div class="input-field col s4">
                        <input v-model="editFarmData.farmCode"
                            id="edit-farm-code"
                            type="text"
                            class="validate"
                        >
                        <label for="edit-farm-code">Farm Code</label>
                    </div>
                    <div class="col s12">
                        <br/>
                        <h6>
                            <b>Accreditation</b>
                        </h6>
                    </div>
                    <div class="input-field col s8">
                        <app-input-date
                            v-model="editFarmData.accreditationDate"
                            @date-select="val => {editFarmData.accreditationDate = val}"
                        >
                        </app-input-date>
                        <label for=""> Accreditation Date </label>
                    </div>
                    <div class="input-field col s4">
                        <input v-model="editFarmData.accreditationNo"
                            id="edit-farm-accreditation-no"
                            type="text"
                            class="validate"
                        >
                        <label for="edit-farm-accreditation-no">Accreditation No.</label>
                    </div>
                    <div class="col s12">
                        <br/>
                        <h6>
                            <b>Farm Address</b>
                        </h6>
                    </div>
                    <div class="input-field col s6">
                        <input v-model="editFarmData.addressLine1"
                            id="edit-farm-address-one"
                            type="text"
                            class="validate"
                        >
                        <label for="edit-farm-address-one">Address Line 1</label>
                    </div>
                    <div class="input-field col s6">
                        <input v-model="editFarmData.addressLine2"
                            id="edit-farm-address-two"
                            type="text"
                            class="validate"
                        >
                        <label for="edit-farm-address-two">Address Line 2</label>
                    </div>
                    <div class="input-field col s6">
                        <app-input-select
                            labelDescription="Province"
                            v-model="editFarmData.province"
                            :options="provinceOptions"
                            @select="val => {editFarmData.province = val}"
                        >
                        </app-input-select>
                    </div>
                </div>
            </div>
            <div class="modal-footer grey lighten-3">
                <a href="#!" class="modal-action modal-close btn-flat">Cancel</a>
                <a @click.prevent="updateFarm($event)" 
                    href="#!" 
                    class="modal-action btn blue darken-1 z-depth-0 update-farm-btn"
                >
                    Update
                </a>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            manageFarmsData: Object,
            provinceOptions: Array
        },

        data() {
            return {
                addFarmData: {
                    breederId: this.manageFarmsData.breederId,
                    name: '',
                    farmCode: '',
                    accreditationDate: '',
                    accreditationNo: '',
                    addressLine1: '',
                    addressLine2: '',
                    province: '',
                    provinceCode: ''
                },
                editFarmData: {
                    farmId: 0,
                    farmIndex: -1,
                    name: '',
                    farmCode: '',
                    accreditationDate: '',
                    accreditationNo: '',
                    addressLine1: '',
                    addressLine2: '',
                    province: '',
                    provinceCode: ''
                }
            }
        },

        methods: {
            convertToReadableDate(date) {
                const dateObject = new Date(date);
                const monthConversion = {
                    '0': 'January',
                    '1': 'February',
                    '2': 'March',
                    '3': 'April',
                    '4': 'May', 
                    '5': 'June',
                    '6': 'July',
                    '7': 'August',
                    '8': 'September',
                    '9': 'October',
                    '10': 'November',
                    '11': 'December'
                };
                
                return `${monthConversion[dateObject.getMonth()]} ${dateObject.getDate()}, ${dateObject.getFullYear()}`;
            },

            toggleCloseFarmsDataContainerEvent() {
                // Trigger event to ManageBreeders component
                this.$emit('close-manage-farms-event', 
                    { 'containerIndex': this.manageFarmsData.containerIndex }
                );
            },

            showAddFarmModal() {
                $('#add-farm-modal').modal('open');
            },

            addFarm(event) {
                const vm = this;
                const addFarmButton = $('.add-farm-btn');
                // Parse input-date-select to get province and province code
                let provinceWithItsCode = vm.addFarmData.province.split(';')
                                            .map(x => x.trim());

                this.disableButtons(addFarmButton, event.target, 'Adding...');
                
                // Add to server's database
                axios.post('/admin/manage/farms', {
                    breederId: vm.addFarmData.breederId,
                    name: vm.addFarmData.name,
                    farmCode: vm.addFarmData.farmCode,
                    accreditationDate: vm.addFarmData.accreditationDate,
                    accreditationNo: vm.addFarmData.accreditationNo,
                    addressLine1: vm.addFarmData.addressLine1,
                    addressLine2: vm.addFarmData.addressLine2,
                    province: provinceWithItsCode[0],
                    provinceCode: provinceWithItsCode[1]
                })
                .then((response) => {
                    // Put response in local data storage by emitting an event 
                    // to ManageBreeders component
                    vm.$emit('add-breeder-farm-event', 
                        {
                            'breederIndex': vm.manageFarmsData.breederIndex,
                            'farm': response.data
                        }
                    );

                    // Erase adding of breeder farm data
                    vm.addFarmData =  {
                        breederId: vm.manageFarmsData.breederId,
                        name: '',
                        farmCode: '',
                        accreditationDate: '',
                        accreditationNo: '',
                        addressLine1: '',
                        addressLine2: '',
                        province: '',
                        provinceCode: ''
                    };

                    // Update UI after adding breeder
                    vm.$nextTick(() => {
                        $('#add-farm-modal').modal('close');
                        $('#add-farm-name').removeClass('valid');
                        $('#add-farm-code').removeClass('valid');
                        $('#add-farm-accreditation-no').removeClass('valid');
                        $('#add-farm-address-one').removeClass('valid');
                        $('#add-farm-address-two').removeClass('valid');

                        this.enableButtons(addFarmButton, event.target, 'Add');

                        Materialize.updateTextFields();
                        Materialize.toast(`${response.data.name} farm added`, 3000, 'green lighten-1');
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
            },

            showEditFarmModal(index) {
                // Initialize data for editing
                const farm = this.manageFarmsData.farms[index];
                this.editFarmData.farmId = farm.id;
                this.editFarmData.farmIndex = index;
                this.editFarmData.name = farm.name;                
                this.editFarmData.farmCode = farm.farm_code;
                this.editFarmData.accreditationDate = this.convertToReadableDate(farm.farm_accreditation_date);
                this.editFarmData.accreditationNo = farm.farm_accreditation_no;
                this.editFarmData.addressLine1 = farm.address_line1;
                this.editFarmData.addressLine2 = farm.address_line2;
                this.editFarmData.province = `${farm.province} ; ${farm.province_code}`;
                this.editFarmData.provinceCode = farm.province_code;

                $('#edit-farm-modal').modal('open');
                this.$nextTick(() => {
                    Materialize.updateTextFields();
                    $('#edit-farm-modal select').material_select();
                }); 
            },

            updateFarm(event) {
                const vm = this;
                const updateFarmButton = $('.update-farm-btn');
                // Parse input-date-select to get province and province code
                let provinceWithItsCode = vm.editFarmData.province.split(';')
                                            .map(x => x.trim());

                this.disableButtons(updateFarmButton, event.target, 'Updating...');
                
                // Add to server's database
                axios.patch('/admin/manage/farms', {
                    farmId: vm.editFarmData.farmId,
                    name: vm.editFarmData.name,
                    farmCode: vm.editFarmData.farmCode,
                    accreditationDate: vm.editFarmData.accreditationDate,
                    accreditationNo: vm.editFarmData.accreditationNo,
                    addressLine1: vm.editFarmData.addressLine1,
                    addressLine2: vm.editFarmData.addressLine2,
                    province: provinceWithItsCode[0],
                    provinceCode: provinceWithItsCode[1]
                })
                .then((response) => {
                    // Edit farm in local data storage by emitting an event 
                    // to ManageBreeders component
                    vm.editFarmData.province = provinceWithItsCode[0];
                    vm.editFarmData.provinceCode = provinceWithItsCode[1];
                    vm.$emit('update-breeder-farm-event', 
                        {
                            'breederIndex': vm.manageFarmsData.breederIndex,
                            'farmIndex': vm.editFarmData.farmIndex,
                            'farm': vm.editFarmData
                        }
                    );

                    // Update UI after adding breeder
                    vm.$nextTick(() => {
                        $('#edit-farm-modal').modal('close');
                        $('#edit-farm-name').removeClass('valid');
                        $('#edit-farm-code').removeClass('valid');
                        $('#edit-farm-accreditation-no').removeClass('valid');
                        $('#edit-farm-address-one').removeClass('valid');
                        $('#edit-farm-address-two').removeClass('valid');

                        this.enableButtons(updateFarmButton, event.target, 'Add');

                        Materialize.updateTextFields();
                        Materialize.toast(`${vm.editFarmData.name} farm updated`, 3000, 'green lighten-1');
                    });
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
            
        },

        mounted() {
            // Materialize component initializations
            $('.modal').modal();
        }

    }
</script>

<style lang="css" scoped>
    h5 i {
        cursor: pointer;
    }

    span.farm-title {
        font-size: 18px;
    }

    #toggle-add-farm-btn {
        margin-top: 1rem;
        margin-left: 72px;
        border-radius: 20px;
    }

    .custom-secondary-btn {
        border: 1px solid #1E88E5;
        background-color: white;
    }

    p.address-line {
        padding-top: 10px;
    }

    /* Modal customizations */
    #add-farm-modal, #edit-farm-modal {
        width: 50rem;
    }

    .modal.modal-fixed-footer .modal-footer{
        border: 0;
    }

    .modal .modal-footer {
        padding-right: 2rem;
    }

    div.modal-input-container {
        padding-left: 2rem;
        padding-right: 2rem;
    }

    /* Override MaterializeCSS' collection styles */
    ul.collection {
        border: 0;
        margin-top: 1rem;
    }

    li.collection-item {
        border: 0;
        padding-bottom: 2rem;
        padding-left: 0px !important;
        margin-right: 72px;
        margin-left: 72px;
    }

    /* 
    * Card highlights for chosen breeder 
    * upon managing of farms
    */
    #manage-farms-container.card {
        border-top: 8px solid #26a65a;
    }

    .name-chosen-breeder {
        color: #26a65a;
    }

</style>

