<template lang="html">
    <div class="row">
        <div class="col s12">
            <h4 class="title-page"> Manage Breeders </h4>
        </div>

        <div class="col s12">
            <div id="toggle-register-breeder-btn-container" class="col s12"> 
                <!-- Register breeder button -->
                <a @click.prevent="showAddBreederModal" 
                    id="toggle-register-breeder-btn" 
                    class="btn" 
                    href="#!"
                >
                    <i class="material-icons left">add</i> Register Breeder
                </a>
            </div>
            <!-- Card displays for Breeder -->
            <template v-for="(breeder, index) in paginatedBreeders"
            >
                <div v-if="breeder.userId !== -1"
                    :key="breeder.userId"
                    class="col s6"
                >
                    <div class="card" :class="(manageFarmsData.breederIndex === index) ? 'card-chosen-breeder' : ''">
                        <div class="card-content">
                            <span class="card-title"
                                :class="(manageFarmsData.breederIndex === index) ? 'name-chosen-breeder' : ''"
                            > 
                                <b>{{ breeder.name }}</b> 
                            </span>
                            <p class="grey-text text-darken-2"> 
                                {{ breeder.status }} • {{ breeder.email }}
                            </p>
                            <p>
                                <br/>
                                <a @click.prevent="showFarms(index)"
                                    href="#!"
                                    class="black-text"
                                >
                                    <i class="material-icons left view-farm-btn"> store </i>
                                    Manage Farms
                                </a>
                            </p>
                        </div>
                        <div class="card-action grey lighten-3">
                            <a @click.prevent="showEditBreederModal(index)" 
                                href="#!" 
                                class="btn blue darken-1 toggle-edit-breeder-btn z-depth-0"
                            >
                                Edit
                            </a>
                        </div>
                    </div>
                </div>

                <div v-else
                    class="col s12"
                >
                    <manage-farms 
                        :manage-farms-data="manageFarmsData"
                        :province-options="provinceOptions"
                        @close-manage-farms-event="closeManageFarmsContainer"
                        @add-breeder-farm-event="addBreederFarm"
                        @update-breeder-farm-event="updateBreederFarm"
                        @renew-breeder-farm-event="renewBreederFarm"
                    >
                    </manage-farms>
                </div>

            </template>

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
        </div>

        <!-- Add Breeder Modal -->
        <div id="add-breeder-modal" class="modal">
            <div class="modal-content">
                <h4>
                    Register Breeder
                    <i class="material-icons right modal-close">close</i>
                </h4>

                <div class="row modal-input-container">
                    <div class="col s12"><br/></div>
                    <div class="input-field col s12">
                        <input v-model="addBreederData.name"
                            id="add-breeder-name"
                            type="text"
                            class="validate"
                        >
                        <label for="add-breeder-name">Name</label>
                    </div>
                    <div class="input-field col s12">
                        <input v-model="addBreederData.email"
                            id="add-breeder-email"
                            type="text"
                            class="validate"
                        >
                        <label for="add-breeder-email">Email</label>
                    </div>
                </div>
            </div>
            <div class="modal-footer grey lighten-3">
                <a href="#!" class="modal-action modal-close btn-flat">Cancel</a>
                <a @click.prevent="registerBreeder($event)" 
                    href="#!" 
                    class="modal-action btn z-depth-0 register-breeder-btn"
                >
                    Register
                </a>
            </div>
        </div>
        
        <!-- Edit Breeder Modal -->
        <div id="edit-breeder-modal" class="modal">
            <div class="modal-content">
                <h4>
                    Edit Breeder
                    <i class="material-icons right modal-close">close</i>
                </h4>

                <div class="row modal-input-container">
                    <div class="col s12"><br/></div>
                    <div class="input-field col s12">
                        <input v-model="editBreederData.name"
                            id="edit-breeder-name"
                            type="text"
                            class="validate"
                        >
                        <label for="edit-breeder-name">Name</label>
                    </div>
                    <div class="input-field col s12">
                        <input v-model="editBreederData.email"
                            id="edit-breeder-email"
                            type="text"
                            class="validate"
                        >
                        <label for="edit-breeder-email">Email</label>
                    </div>
                </div>
            </div>
            <div class="modal-footer grey lighten-3">
                <a href="#!" class="modal-action modal-close btn-flat">Cancel</a>
                <a @click.prevent="updateBreeder($event)" 
                    href="#!" 
                    class="modal-action btn blue darken-1 z-depth-0 update-breeder-btn"
                >
                    Update
                </a>
            </div>
        </div>

        
    </div>
</template>

<script>
    import ManageFarms from './ManageBreedersManageFarm.vue';

    export default {
        props: {
            initialBreeders: Array,
            provinceOptions: Array
        },

        components: {
            ManageFarms
        },

        data() {
            return {
                pageNumber: 0,
                paginationSize: 6,
                breeders: this.initialBreeders,
                addBreederData: {
                    name: '',
                    email: ''
                },
                editBreederData: {
                    index: 0,
                    userId: 0,
                    name: '',
                    email: ''
                },
                manageFarmsData: {
                    containerIndex: 0,
                    breederIndex: -1,
                    breederId: 0,
                    name: '',
                    farms: []
                }
            }
        },

        computed: {
            pageCount() {
                let l = this.breeders.length;
                let s = this.paginationSize;

                return Math.ceil(l/s);
            },
            
            paginatedBreeders() {
                const start = this.pageNumber * this.paginationSize;
                const end = start + this.paginationSize;

                return this.breeders.slice(start, end);
            }
        },

        methods: {
            previousPage() {
                // For pagination
                if(this.pageNumber !== 0) this.pageNumber--;
            },

            nextPage() {
                // For pagination
                if(this.pageNumber < this.pageCount -1) this.pageNumber++;
            },

            goToPage(page) {
                // For pagination
                this.pageNumber = page - 1;
            },

            showAddBreederModal() {
                $('#add-breeder-modal').modal('open');
            },

            registerBreeder(event) {
                const vm = this;
                const registerBreederButton = $('.register-breeder-btn');

                this.disableButtons(registerBreederButton, event.target, 'Registering...');

                // Add to server's database
                axios.post('/admin/manage/breeders', {
                    name: vm.addBreederData.name,
                    email: vm.addBreederData.email
                })
                .then((response) => {
                    // Put response in local data storage and erase adding of breeder data
                    vm.breeders.push(response.data);
                    vm.addBreederData = {
                        name: '',
                        email: ''
                    };

                    // Update UI after adding breeder
                    vm.$nextTick(() => {
                        $('#add-breeder-modal').modal('close');
                        $('#add-breeder-name').removeClass('valid');
                        $('#add-breeder-email').removeClass('valid');

                        this.enableButtons(registerBreederButton, event.target, 'Register');

                        Materialize.updateTextFields();
                        Materialize.toast(`${response.data.name} added`, 2500, 'green lighten-1');
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
            },

            showEditBreederModal(index) {
                // Initialize data for editing
                const breeder = this.breeders[index];
                this.editBreederData.index = index;
                this.editBreederData.userId = breeder.userId;
                this.editBreederData.name = breeder.name;
                this.editBreederData.email = breeder.email;

                $('#edit-breeder-modal').modal('open');
                this.$nextTick(() => {
                    Materialize.updateTextFields();
                });
            },

            updateBreeder(event) {
                const vm = this;
                const updateBreederButton = $('.update-breeder-btn');

                this.disableButtons(updateBreederButton, event.target, 'Updating...');

                // Update to server's database
                axios.patch('/admin/manage/breeders', {
                    userId: vm.editBreederData.userId,
                    name: vm.editBreederData.name,
                    email: vm.editBreederData.email
                })
                .then((response) => {
                    // Put response in local data storage and erase editing of breeder data
                    if(response.data.updated){
                        const index = vm.editBreederData.index;
                        vm.breeders[index].name = vm.editBreederData.name;
                        vm.breeders[index].email = vm.editBreederData.email;
                        vm.editBreederData = {
                            index: 0,
                            userId: 0,
                            name: '',
                            email: ''
                        };

                        // Update UI after updating breeder
                        vm.$nextTick(() => {
                            $('#edit-breeder-modal').modal('close');
                            $('#edit-breeder-name').removeClass('valid');
                            $('#edit-breeder-email').removeClass('valid');

                            this.enableButtons(updateBreederButton, event.target, 'Update');

                            Materialize.updateTextFields();
                            Materialize.toast(`${vm.breeders[index].name} updated`, 2500, 'green lighten-1');
                        });
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
            },

            showFarms(breederIndex) {
                // Initialize needed variables and conditions and compute for
                // proper index placement of Manage Farms "container"
                const currentContainerIndex = this.manageFarmsData.containerIndex;
                const manageFarmsContainerIsOpen = currentContainerIndex > 0;

                let increment, newContainerIndex, breederIndexIsGreaterThanBreedersLength;

                // Check if Manage Farms "container" is open
                if(manageFarmsContainerIsOpen){
                    const breederIndexIsGreaterThanContainerIndex = breederIndex > currentContainerIndex;

                    // Check if the computed index placement is greater than the "container" index
                    if(breederIndexIsGreaterThanContainerIndex) {
                        let newBreederIndex = breederIndex - 1;
                        increment = (newBreederIndex === 0 || newBreederIndex % 2 === 0) ? 2 : 1;
                        breederIndexIsGreaterThanBreedersLength = (newBreederIndex + increment) > (this.breeders.length - 2);
                        newContainerIndex = (breederIndexIsGreaterThanBreedersLength) ? this.breeders.length - 1: newBreederIndex + increment;

                        // Remove first prior Manage Farms "container" from breeders array
                        this.breeders.splice(currentContainerIndex, 1);
                        this.initializeManageFarmsData(newBreederIndex, newContainerIndex);
                        this.insertManageFarmsContainer(newBreederIndex, newContainerIndex);
                    }
                    else {
                        increment = (breederIndex === 0 || breederIndex % 2 === 0) ? 2 : 1;
                        newContainerIndex = breederIndex + increment;

                        // If Current Manage Farms "container" is the same with the new one
                        if(currentContainerIndex === newContainerIndex) {
                            this.initializeManageFarmsData(breederIndex, currentContainerIndex);
                        }
                        else {
                            // Remove current Manage Farms "container" first then 
                            // initialize the new one
                            this.breeders.splice(currentContainerIndex, 1);
                            this.initializeManageFarmsData(breederIndex, newContainerIndex);
                            this.insertManageFarmsContainer(breederIndex, newContainerIndex);
                        }

                    }
                }
                else {  
                    increment = (breederIndex === 0 || breederIndex % 2 === 0) ? 2 : 1;
                    breederIndexIsGreaterThanBreedersLength = (breederIndex + increment) > (this.breeders.length - 1);
                    newContainerIndex = (breederIndexIsGreaterThanBreedersLength) ? this.breeders.length : breederIndex + increment;
                    
                    this.initializeManageFarmsData(breederIndex, newContainerIndex);
                    this.insertManageFarmsContainer(breederIndex, newContainerIndex);
                }
            },

            addBreederFarm(data) {
                // Insert new breeder farm data to breeders array
                this.breeders[data.breederIndex].farms.push(data.farm);
            },

            updateBreederFarm(data) {
                // Edit breeder farm
                const farm = this.breeders[data.breederIndex].farms[data.farmIndex];

                farm.name = data.farm.name;
                farm.farm_code = data.farm.farmCode;
                farm.farm_accreditation_date = data.farm.accreditationDate;
                farm.farm_accreditation_no = data.farm.accreditationNo;
                farm.address_line1 = data.farm.addressLine1;
                farm.address_line2 = data.farm.addressLine2;
                farm.province = data.farm.province;
                farm.province_code = data.farm.provinceCode;
            },

            renewBreederFarm(data) {
                // Renew breeder farm
                const farm = this.breeders[data.breederIndex].farms[data.farmIndex];

                farm.is_suspended = 0;
                farm.farm_accreditation_date = data.newAccreditationDate;
            },

            initializeManageFarmsData(breederIndex, containerIndex) {
                // Initialize data and metadata of Manage Farms "container"
                this.manageFarmsData.breederIndex = breederIndex;
                this.manageFarmsData.containerIndex = containerIndex;
                this.manageFarmsData.breederId = this.breeders[breederIndex].breederId;
                this.manageFarmsData.name = this.breeders[breederIndex].name;
                this.manageFarmsData.farms = this.breeders[breederIndex].farms;
            },

            insertManageFarmsContainer(breederIndex, containerIndex) {
                // Insert Manage Farms "container" to breeders array
                this.breeders.splice(containerIndex, 0, {
                    userId: -1,
                    breederId: -1,
                    name: this.breeders[breederIndex].name,
                    email: '',
                    farms: []
                });
            },

            closeManageFarmsContainer(data) {
                this.breeders.splice(data.containerIndex, 1);

                // Set manageFarmsData to default
                this.manageFarmsData = {
                    containerIndex: 0,
                    breederIndex: -1,
                    breederId: 0,
                    name: '',
                    farms: []
                }
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

        mounted(){
            // Materialize component initializations
            $('.modal').modal();
        }
    }
</script>

<style lang="css" scoped>
    h4 i {
        cursor: pointer;
    }

    .card .card-action {
        border: 0;
    }

    #toggle-register-breeder-btn-container {
        padding: 2rem 0 1rem 0;
    }

    #toggle-register-breeder-btn {
        border-radius: 20px;
    }

    .pagination-container {
        padding-top: 2rem;
        padding-bottom: 2rem;
    }

    /* Modal customizations */
    #add-breeder-modal, #edit-breeder-modal {
        width: 40rem;
    }

    .modal .modal-footer {
        padding-right: 2rem;
    }

    div.modal-input-container {
        padding-left: 2rem;
        padding-right: 2rem;
    }

    /* 
    * Card highlights for chosen breeder 
    * upon managing of farms
    */
    .card-chosen-breeder {
        border-top: 8px solid #26a65a;
    }

    .name-chosen-breeder {
        color: #26a65a;
    }

</style>


