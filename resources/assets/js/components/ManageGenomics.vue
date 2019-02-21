<template>
    <div class="row">
        <div class="col s12">
            <h4 class="title-page"> Manage Genomics </h4>
        </div>

        <div class="col s12">
            <ul class="collection with-header">
                <!-- Toggle add genomics container button -->
                <li class="collection-header">
                    <a @click.prevent="showAddGenomicsContainer = !showAddGenomicsContainer"
                        href="#!"
                        id="toggle-add-genomics-container-button"
                        class="btn-floating waves-effect waves-light tooltipped"
                        data-position="right"
                        data-delay="50"
                        data-tooltip="Add new genomics"
                    >
                        <i class="material-icons right">add</i>
                    </a>
                </li>
                <!-- Add genomics container -->
                <li v-show="showAddGenomicsContainer" id="add-genomics-container" class="collection-item">
                    <div class="row">
                        <div class="col s12">
                            <i @click.prevent="showAddGenomicsContainer = !showAddGenomicsContainer"
                                id="close-add-genomics-container-button"
                                class="material-icons right"
                            >
                                close
                            </i>
                        </div>
                        <div class="input-field col s4 offset-s4">
                            <input v-model="addGenomicsData.name"
                                id="add-name"
                                type="text"
                                class="validate"
                            >
                            <label for="add-name">Name</label>
                        </div>
                        <div class="input-field col s4 offset-s4">
                            <input v-model="addGenomicsData.email"
                                id="add-email"
                                type="text"
                                class="validate"
                            >
                            <label for="add-email">Email</label>
                        </div>
                        <div class="col s4 offset-s4">
                            <a @click.prevent="addGenomics($event)"
                                href="#!"
                                class="right btn z-depth-0 add-genomics-btn"
                            >
                                Add Genomics
                            </a>
                        </div>
                    </div>
                </li>
                <!-- Existing genomics list -->
                <li v-for="(genomics) in sortedGenomics"
                    class="collection-item avatar"
                    :key="genomics.userId"
                >
                    <span class="title"> <b>{{ genomics.name }}</b> </span>
                    <p class="">
                        {{ genomics.email }}
                    </p>
                    <span class="secondary-content">
                        <a @click.prevent="showEditGenomicsModal(genomics.genomicsId)"
                            href="#"
                            class="btn custom-secondary-btn
                                edit-genomics-button
                                blue-text
                                text-darken-1
                                z-depth-0"
                        >
                            Edit
                        </a>

                        <a @click.prevent="showDeleteGenomicsModal(genomics.genomicsId)"
                            href="#"
                            class="btn btn-flat delete-genomics-button custom-tertiary-btn"
                        >
                            Delete
                        </a>
                    </span>
                </li>
            </ul>
        </div>

        <!-- Edit Genomics Modal -->
        <div id="edit-genomics-modal" class="modal">
            <div class="modal-content">
                <h4>
                    Edit Genomics
                    <i class="material-icons right modal-close">close</i>
                </h4>

                <div class="row modal-input-container">
                    <div class="col s12"><br/></div>
                    <div class="input-field col s12">
                        <input v-model="editGenomicsData.name"
                            id="edit-name"
                            type="text"
                            class="validate"
                        >
                        <label for="edit-name">Name</label>
                    </div>
                    <div class="input-field col s12">
                        <input v-model="editGenomicsData.email"
                            id="edit-email"
                            type="text"
                            class="validate"
                        >
                        <label for="edit-email">Email</label>
                    </div>
                </div>
            </div>
            <div class="modal-footer grey lighten-3">
                <a href="#!" class="modal-action modal-close btn-flat">Cancel</a>
                <a @click.prevent="updateGenomics($event)" 
                    href="#!" 
                    class="modal-action btn blue darken-1 z-depth-0 update-genomics-btn"
                >
                    Update
                </a>
            </div>
        </div>

        <!-- Delete Genomics Modal -->
        <div id="delete-genomics-modal" class="modal">
            <div class="modal-content">
                <h4>
                    Delete Genomics
                    <i class="material-icons right modal-close">close</i>
                </h4>

                <div class="row modal-input-container">
                    <div class="col s12"><br/></div>
                    <div class="input-field col s12">
                        <p>
                            Are you sure you want to delete <b>{{ deleteGenomicsData.name }}</b>?
                        </p>
                    </div>
                </div>
            </div>
            <div class="modal-footer grey lighten-3">
                <a href="#!" class="modal-action modal-close btn-flat">Cancel</a>
                <a @click.prevent="deleteGenomics($event)" 
                    href="#!" 
                    class="modal-action btn red lighten-2 z-depth-0 delete-genomics-btn"
                >
                    Delete
                </a>
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        props: {
            initialGenomics: Array
        },

        data() {
            return {
                genomics: this.initialGenomics,
                showAddGenomicsContainer: false,
                addGenomicsData: {
                    name: '',
                    email: ''
                },
                editGenomicsData: {
                    index: 0,
                    userId: 0,
                    name: '',
                    email: ''
                },
                deleteGenomicsData: {
                    index: 0,
                    userId: 0,
                    name: ''
                }
            }
        },

        computed: {
            sortedGenomics() {
                return _.sortBy(this.genomics, ['name']);
            }
        },

        methods: {
            findGenomicsIndexById(id) {
                for (let i = 0; i < this.genomics.length; i++) {
                    if(this.genomics[i].genomicsId === id) return i;
                }

                return -1;
            },

            addGenomics(event) {
                const vm = this;
                const addGenomicsButton = $('.add-genomics-btn');

                this.disableButtons(addGenomicsButton, event.target, 'Adding...');

                // Add to server's database
                axios.post('/admin/manage/genomics', {
                    name: vm.addGenomicsData.name,
                    email: vm.addGenomicsData.email
                })
                .then((response) => {
                    // Put response in local data storage and erase adding of Genomics data
                    vm.genomics.push(response.data);
                    vm.addGenomicsData = {
                        name: '',
                        email: ''
                    };

                    // Update UI after adding Genomics
                    vm.$nextTick(() => {
                        $('#add-name').removeClass('valid');
                        $('#add-email').removeClass('valid');
                        
                        this.enableButtons(addGenomicsButton, event.target, 'Add Genomics');

                        Materialize.updateTextFields();
                        Materialize.toast(`Genomics ${response.data.name} added`, 3000, 'green lighten-1');
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
            },

            showEditGenomicsModal(genomicsId) {
                // Initialize data for editing
                const index = this.findGenomicsIndexById(genomicsId);
                const genomics = this.genomics[index];
                
                this.editGenomicsData.index = index;
                this.editGenomicsData.userId = genomics.userId;
                this.editGenomicsData.name = genomics.name;
                this.editGenomicsData.email = genomics.email;

                $('#edit-genomics-modal').modal('open');
                this.$nextTick(() => {
                    Materialize.updateTextFields();
                });
            },

            updateGenomics(event) {
                const vm = this;
                const updateGenomicsButton = $('.update-genomics-btn');

                this.disableButtons(updateGenomicsButton, event.target, 'Updating...');

                // Update to server's database
                axios.patch('/admin/manage/genomics', {
                    userId: vm.editGenomicsData.userId,
                    name: vm.editGenomicsData.name,
                    email: vm.editGenomicsData.email
                })
                .then((response) => {
                    // Put response in local data storage and erase editing of Genomics data
                    if(response.data.updated){
                        const index = vm.editGenomicsData.index;

                        vm.genomics[index].name = vm.editGenomicsData.name;
                        vm.genomics[index].email = vm.editGenomicsData.email;
                        vm.editGenomicsData = {
                            index: 0,
                            userId: 0,
                            name: '',
                            email: ''
                        };

                        // Update UI after updating Genomics
                        vm.$nextTick(() => {
                            $('#edit-genomics-modal').modal('close');
                            $('#edit-name').removeClass('valid');
                            $('#edit-email').removeClass('valid');

                            this.enableButtons(updateGenomicsButton, event.target, 'Update');

                            Materialize.updateTextFields();
                            Materialize.toast(`${vm.genomics[index].name} updated`, 2500, 'green lighten-1');
                        });
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
            },

            showDeleteGenomicsModal(genomicsId) {
                // Initialize data for deleting
                const index = this.findGenomicsIndexById(genomicsId);
                const genomics = this.genomics[index];
                
                this.deleteGenomicsData.index = index;
                this.deleteGenomicsData.userId = genomics.userId;
                this.deleteGenomicsData.name = genomics.name;

                $('#delete-genomics-modal').modal('open');
            },

            deleteGenomics(event) {
                const vm = this;
                const deleteGenomicsButton = $('.delete-genomics-btn');

                this.disableButtons(deleteGenomicsButton, event.target, 'Deleting...');

                // Remove from server's database
                axios.delete(
                    `/admin/manage/genomics/${vm.deleteGenomicsData.userId}`
                )
                .then((response) => {
                    // Remove genomics details on local storage and erase
                    // deleting of genomics data
                    if(response.data.deleted){
                        const genomicsName = vm.deleteGenomicsData.name;

                        vm.genomics.splice(vm.deleteGenomicsData.index, 1);
                        vm.deleteGenomicsData = {
                            index: 0,
                            userId: 0,
                            name: ''
                        };
    
                        // Update UI after deleting Genomics
                        vm.$nextTick(() => {
                            $('#delete-genomics-modal').modal('close');
    
                            this.enableButtons(deleteGenomicsButton, event.target, 'Delete');
    
                            Materialize.updateTextFields();
                            Materialize.toast(`Genomics ${genomicsName} deleted`, 3000, 'green lighten-1');
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
        },

        mounted() {
            // Materialize component initializations
            $('.modal').modal();
        }
    }
</script>

<style scoped>
    .collection-header a, #close-add-genomics-container-button {
        cursor: pointer;
    }

    .collection-item .row {
        margin-bottom: 0;
    }

    .collection-item.avatar {
        padding-left: 20px !important;
    }

    .custom-secondary-btn {
        border: 1px solid;
        background-color: white;
    }

    .custom-tertiary-btn:hover {
        background-color: rgba(173, 173, 173, 0.3);
    }

    #add-genomics-container {
        padding-bottom: 2rem;
    }

    #edit-genomics-modal {
        width: 40rem;
    }

    #delete-genomics-modal {
        width: 30rem;
    }

    /* Modal customizations */
    div.modal-input-container {
        padding-left: 2rem;
        padding-right: 2rem;
    }

    .modal.modal-fixed-footer .modal-footer {
        border: 0;
    }

    .modal .modal-footer {
        padding-right: 2rem;
    }
</style>
