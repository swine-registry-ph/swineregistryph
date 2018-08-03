<template>
    <div class="row">
        <div class="col s12">
            <h4 class="title-page"> Manage Evaluators </h4>
        </div>

        <div class="col s12">
            <ul class="collection with-header">
                <!-- Toggle add evaluator container button -->
                <li class="collection-header">
                    <a @click.prevent="showAddEvaluatorContainer = !showAddEvaluatorContainer"
                        href="#!"
                        id="toggle-add-evaluator-container-button"
                        class="btn-floating waves-effect waves-light tooltipped"
                        data-position="right"
                        data-delay="50"
                        data-tooltip="Add new evaluator"
                    >
                        <i class="material-icons right">add</i>
                    </a>
                </li>
                <!-- Add evaluator container -->
                <li v-show="showAddEvaluatorContainer" id="add-evaluator-container" class="collection-item">
                    <div class="row">
                        <div class="col s12">
                            <i @click.prevent="showAddEvaluatorContainer = !showAddEvaluatorContainer"
                                id="close-add-evaluator-container-button"
                                class="material-icons right"
                            >
                                close
                            </i>
                        </div>
                        <div class="input-field col s4 offset-s4">
                            <input v-model="addEvaluatorData.name"
                                id="add-name"
                                type="text"
                                class="validate"
                            >
                            <label for="add-name">Name</label>
                        </div>
                        <div class="input-field col s4 offset-s4">
                            <input v-model="addEvaluatorData.email"
                                id="add-email"
                                type="text"
                                class="validate"
                            >
                            <label for="add-email">Email</label>
                        </div>
                        <div class="col s4 offset-s4">
                            <a @click.prevent="addEvaluator($event)"
                                href="#!"
                                class="right btn z-depth-0 add-evaluator-btn"
                            >
                                Add Evaluator
                            </a>
                        </div>
                    </div>
                </li>
                <!-- Existing evaluators list -->
                <li v-for="(evaluator) in sortedEvaluators"
                    class="collection-item avatar"
                    :key="evaluator.userId"
                >
                    <span class="title"> <b>{{ evaluator.name }}</b> </span>
                    <p class="">
                        {{ evaluator.email }}
                    </p>
                    <span class="secondary-content">
                        <a @click.prevent="showEditEvaluatorModal(evaluator.evaluatorId)"
                            href="#"
                            class="btn custom-secondary-btn
                                edit-evaluator-button
                                blue-text
                                text-darken-1
                                z-depth-0"
                        >
                            Edit
                        </a>

                        <a @click.prevent="showDeleteEvaluatorModal(evaluator.evaluatorId)"
                            href="#"
                            class="btn btn-flat delete-evaluator-button custom-tertiary-btn"
                        >
                            Delete
                        </a>
                    </span>
                </li>
            </ul>
        </div>

        <!-- Edit Evaluator Modal -->
        <div id="edit-evaluator-modal" class="modal">
            <div class="modal-content">
                <h4>
                    Edit Evaluator
                    <i class="material-icons right modal-close">close</i>
                </h4>

                <div class="row modal-input-container">
                    <div class="col s12"><br/></div>
                    <div class="input-field col s12">
                        <input v-model="editEvaluatorData.name"
                            id="edit-name"
                            type="text"
                            class="validate"
                        >
                        <label for="edit-name">Name</label>
                    </div>
                    <div class="input-field col s12">
                        <input v-model="editEvaluatorData.email"
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
                <a @click.prevent="updateEvaluator($event)" 
                    href="#!" 
                    class="modal-action btn blue darken-1 z-depth-0 update-evaluator-btn"
                >
                    Update
                </a>
            </div>
        </div>

        <!-- Delete Evaluator Modal -->
        <div id="delete-evaluator-modal" class="modal">
            <div class="modal-content">
                <h4>
                    Delete Evaluator
                    <i class="material-icons right modal-close">close</i>
                </h4>

                <div class="row modal-input-container">
                    <div class="col s12"><br/></div>
                    <div class="input-field col s12">
                        <p>
                            Are you sure you want to delete <b>{{ deleteEvaluatorData.name }}</b> ?
                        </p>
                    </div>
                </div>
            </div>
            <div class="modal-footer grey lighten-3">
                <a href="#!" class="modal-action modal-close btn-flat">Cancel</a>
                <a @click.prevent="deleteEvaluator($event)" 
                    href="#!" 
                    class="modal-action btn red lighten-2 z-depth-0 delete-evaluator-btn"
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
            initialEvaluators: Array
        },

        data() {
            return {
                evaluators: this.initialEvaluators,
                showAddEvaluatorContainer: false,
                addEvaluatorData: {
                    name: '',
                    email: ''
                },
                editEvaluatorData: {
                    index: 0,
                    userId: 0,
                    name: '',
                    email: ''
                },
                deleteEvaluatorData: {
                    index: 0,
                    userId: 0,
                    name: ''
                }
            }
        },

        computed: {
            sortedEvaluators() {
                return _.sortBy(this.evaluators, ['name']);
            }
        },

        methods: {
            findEvaluatorIndexById(id) {
                for (let i = 0; i < this.evaluators.length; i++) {
                    if(this.evaluators[i].evaluatorId === id) return i;
                }

                return -1;
            },

            addEvaluator(event) {
                const vm = this;
                const addEvaluatorButton = $('.add-evaluator-btn');

                this.disableButtons(addEvaluatorButton, event.target, 'Adding...');

                // Add to server's database
                axios.post('/admin/manage/evaluators', {
                    name: vm.addEvaluatorData.name,
                    email: vm.addEvaluatorData.email
                })
                .then((response) => {
                    // Put response in local data storage and erase adding of evaluator data
                    vm.evaluators.push(response.data);
                    vm.addEvaluatorData = {
                        name: '',
                        email: ''
                    };

                    // Update UI after adding evaluator
                    vm.$nextTick(() => {
                        $('#add-name').removeClass('valid');
                        $('#add-email').removeClass('valid');
                        
                        this.enableButtons(addEvaluatorButton, event.target, 'Add Evaluator');

                        Materialize.updateTextFields();
                        Materialize.toast(`Evaluator ${response.data.name} added`, 3000, 'green lighten-1');
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
            },

            showEditEvaluatorModal(evaluatorId) {
                // Initialize data for editing
                const index = this.findEvaluatorIndexById(evaluatorId);
                const evaluator = this.evaluators[index];
                
                this.editEvaluatorData.index = index;
                this.editEvaluatorData.userId = evaluator.userId;
                this.editEvaluatorData.name = evaluator.name;
                this.editEvaluatorData.email = evaluator.email;

                $('#edit-evaluator-modal').modal('open');
                this.$nextTick(() => {
                    Materialize.updateTextFields();
                });
            },

            updateEvaluator(event) {
                const vm = this;
                const updateEvaluatorButton = $('.update-evaluator-btn');

                this.disableButtons(updateEvaluatorButton, event.target, 'Updating...');

                // Update to server's database
                axios.patch('/admin/manage/evaluators', {
                    userId: vm.editEvaluatorData.userId,
                    name: vm.editEvaluatorData.name,
                    email: vm.editEvaluatorData.email
                })
                .then((response) => {
                    // Put response in local data storage and erase editing of evaluator data
                    if(response.data.updated){
                        const index = vm.editEvaluatorData.index;

                        vm.evaluators[index].name = vm.editEvaluatorData.name;
                        vm.evaluators[index].email = vm.editEvaluatorData.email;
                        vm.editEvaluatorData = {
                            index: 0,
                            userId: 0,
                            name: '',
                            email: ''
                        };

                        // Update UI after updating breeder
                        vm.$nextTick(() => {
                            $('#edit-evaluator-modal').modal('close');
                            $('#edit-name').removeClass('valid');
                            $('#edit-email').removeClass('valid');

                            this.enableButtons(updateEvaluatorButton, event.target, 'Update');

                            Materialize.updateTextFields();
                            Materialize.toast(`${vm.evaluators[index].name} updated`, 2500, 'green lighten-1');
                        });
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
            },

            showDeleteEvaluatorModal(evaluatorId) {
                // Initialize data for deleting
                const index = this.findEvaluatorIndexById(evaluatorId);
                const evaluator = this.evaluators[index];
                
                this.deleteEvaluatorData.index = index;
                this.deleteEvaluatorData.userId = evaluator.userId;
                this.deleteEvaluatorData.name = evaluator.name;

                $('#delete-evaluator-modal').modal('open');
            },

            deleteEvaluator(event) {
                const vm = this;
                const deleteEvaluatorButton = $('.delete-evaluator-btn');

                this.disableButtons(deleteEvaluatorButton, event.target, 'Deleting...');

                // Remove from server's database
                axios.delete(
                    `/admin/manage/evaluators/${vm.deleteEvaluatorData.userId}`
                )
                .then((response) => {
                    // Remove evaluator details on local storage and erase
                    // deleting of evaluator data
                    if(response.data.deleted){
                        const evaluatorName = vm.deleteEvaluatorData.name;

                        vm.evaluators.splice(vm.deleteEvaluatorData.index, 1);
                        vm.deleteEvaluatorData = {
                            index: 0,
                            userId: 0,
                            name: ''
                        };
    
                        // Update UI after deleting evaluator
                        vm.$nextTick(() => {
                            $('#delete-evaluator-modal').modal('close');
    
                            this.enableButtons(deleteEvaluatorButton, event.target, 'Delete');
    
                            Materialize.updateTextFields();
                            Materialize.toast(`Evaluator ${evaluatorName} deleted`, 3000, 'green lighten-1');
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
    .collection-header a, #close-add-evaluator-container-button {
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

    #add-evaluator-container {
        padding-bottom: 2rem;
    }

    #edit-evaluator-modal {
        width: 40rem;
    }

    #delete-evaluator-modal {
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
