<template lang="html">

    <div class="row">
        <div class="col s12">
            <h4 class="title-page"> Manage Breeds </h4>
        </div>

        <div class="col s12">
            <ul class="collection with-header">
                <!-- Toggle add breed container button -->
                <li class="collection-header">
                    <a @click.prevent="toggleAddBreedContainer()"
                        href="#!"
                        id="toggle-add-breed-container-button"
                        class="btn-floating waves-effect waves-light tooltipped"
                        data-position="right"
                        data-delay="50"
                        data-tooltip="Add new breed"
                    >
                        <i class="material-icons right">add</i>
                    </a>
                </li>
                <!-- Add breed container -->
                <li v-show="showAddBreedInput" id="add-breed-container" class="collection-item">
                    <div class="row">
                        <div class="col s12">
                            <i @click.prevent="toggleAddBreedContainer()"
                                id="close-add-breed-container-button"
                                class="material-icons right"
                            >
                                close
                            </i>
                        </div>
                        <div class="input-field col s4 offset-s4">
                            <input v-model="addBreedData.title"
                                id="breed-title"
                                type="text"
                                class="validate"
                            >
                            <label for="breed-title">Breed Title</label>
                        </div>
                        <div class="input-field col s4 offset-s4">
                            <input v-model="addBreedData.code"
                                id="breed-code"
                                type="text"
                                class="validate"
                            >
                            <label for="breed-code">Breed Code</label>
                        </div>
                        <div class="col s4 offset-s4">
                            <a @click.prevent="addBreed($event)"
                                href="#!"
                                class="right btn z-depth-0 add-breed-button"
                            >
                                Add Breed
                            </a>
                        </div>
                    </div>
                </li>
                <!-- Exising breeds list -->
                <li v-for="(breed, index) in breeds"
                    :key="breed.id"
                    class="collection-item"
                >
                    <b>{{ breed.title }}</b> ({{ breed.code }})
                    <span>
                        <a @click.prevent="toggleEditBreedModal(index)"
                            href="#"
                            class="secondary-content 
                                btn custom-secondary-btn 
                                edit-breed-button 
                                blue-text 
                                text-darken-1
                                z-depth-0"
                        >
                            Edit
                        </a>
                    </span>
                </li>
            </ul>
        </div>

        <!-- Edit Breed Modal -->
        <div id="edit-breed-modal" class="modal modal-fixed-footer">
            <div class="modal-content">
                <h4>
                    Edit Breed
                    <i class="material-icons right modal-close">close</i>
                </h4>
                <div class="row modal-input-container">
                    <div class="col s12"> <br/> </div>
                    <div class="input-field col s12">
                        <input v-model="editBreedData.title"
                            id="edit-breed-title"
                            type="text"
                            class="validate"
                        >
                        <label for="edit-breed-title">Breed Title</label>
                    </div>
                    <div class="input-field col s12">
                        <input v-model="editBreedData.code"
                            id="edit-breed-code"
                            type="text"
                            class="validate"
                        >
                        <label for="edit-breed-code">Breed Code</label>
                    </div>
                </div>
            </div>
            <div class="modal-footer grey lighten-3">
                <a href="#!" class="modal-action modal-close waves-effect btn-flat ">Close</a>
                <a @click.prevent="updateBreed($event)"
                    href="#!"
                    class="modal-action waves-effect btn blue darken-1 z-depth-0 update-breed-btn"
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
            initialBreeds: Array
        },

        data() {
            return {
                breeds: this.initialBreeds,
                showAddBreedInput: false,
                addBreedData: {
                    title: '',
                    code: ''
                },
                editBreedData: {
                    index: -1,
                    id: 0,
                    title: '',
                    code: ''
                }
            }
        },

        methods: {
            toggleAddBreedContainer() {
                this.showAddBreedInput = !this.showAddBreedInput;
            },

            addBreed(event) {
                const vm = this;
                const addBreedButton = $('.add-breed-button');

                this.disableButtons(addBreedButton, event.target, 'Adding...');

                // Add to server's database
                axios.post('/admin/manage/breeds', {
                    title: vm.addBreedData.title,
                    code: vm.addBreedData.code
                })
                .then((response) => {
                    // Put response in local data storage and erase adding of breed data
                    vm.breeds.push(response.data);
                    vm.addBreedData.title = '';
                    vm.addBreedData.code = '';

                    // Update UI after adding breed
                    vm.$nextTick(() => {
                        $('#breed-title').removeClass('valid');
                        $('#breed-code').removeClass('valid');

                        this.enableButtons(addBreedButton, event.target, 'Add Breed');

                        Materialize.updateTextFields();
                        Materialize.toast('Breed added', 2000, 'green lighten-1');
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
            },

            toggleEditBreedModal(index) {
                // Initialize data for editing
                this.editBreedData.index = index;
                this.editBreedData.id = this.breeds[index].id;
                this.editBreedData.title = this.breeds[index].title;
                this.editBreedData.code = this.breeds[index].code;

                $('#edit-breed-modal').modal('open');
                this.$nextTick(() => {
                    Materialize.updateTextFields();
                });
            },

            updateBreed(event) {
                const vm = this;
                const index = this.editBreedData.index;
                const updateBreedButton = $('.update-breed-btn');

                this.disableButtons(updateBreedButton, event.target, 'Updating...');

                // Update to server's database
                axios.patch('/admin/manage/breeds', {
                    breedId: vm.editBreedData.id,
                    title: vm.editBreedData.title,
                    code: vm.editBreedData.code
                })
                .then((response) => {
                    // Update local data storage and erase editing of breed data
                    if(response.data === 'OK'){
                        vm.breeds[index].title = vm.editBreedData.title;
                        vm.breeds[index].code = vm.editBreedData.code;
                        vm.editBreedData = {
                            index: -1,
                            id: 0,
                            title: '',
                            code: ''
                        };
                    }

                    // Update UI after updating breed
                    vm.$nextTick(() => {
                        $('#edit-breed-modal').modal('close');
                        $('#edit-breed-title').removeClass('valid');
                        $('#edit-breed-code').removeClass('valid');

                        this.enableButtons(updateBreedButton, event.target, 'Update');

                        Materialize.updateTextFields();
                        Materialize.toast('Breed updated', 2000, 'green lighten-1');
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

<style scoped lang="css">
    .collection-header a, .edit-breed-button, #close-add-breed-container-button {
        cursor: pointer;
    }

    .collection-item {
        overflow: auto;
    }

    .collection-item .row {
        margin-bottom: 0;
    }

    #add-breed-container {
        padding-top: 2rem;
        padding-bottom: 2rem;
    }

    #edit-breed-modal {
        width: 30rem;
        height: 30rem;
    }

    .custom-secondary-btn {
        border: 1px solid;
        background-color: white;
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
