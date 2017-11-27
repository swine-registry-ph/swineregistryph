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
                <li v-show="showAddBreedInput" class="collection-item">
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
                        <div class="col s4 offset-s4">
                            <a @click.prevent="addBreed()"
                                href="#!"
                                class="right btn"
                            >
                                Submit
                                <i class="material-icons right">send</i>
                            </a>
                        </div>
                    </div>
                </li>
                <!-- Exising breeds list -->
                <li v-for="(breed, index) in breeds"
                    class="collection-item"
                >
                    {{ breed.title }}
                    <span >
                        <a @click.prevent="toggleEditBreedModal(index)"
                            href="#"
                            class="secondary-content edit-breed-button"
                        >
                            <i class="material-icons">edit</i>
                        </a>
                    </span>
                </li>
            </ul>
        </div>

        <!-- Modal Structure -->
        <div id="edit-breed-modal" class="modal modal-fixed-footer">
            <div class="modal-content">
                <h4>Edit Breed</h4>
                <div class="row">
                    <div class="input-field col s12">
                        <input v-model="editBreedData.title"
                            id="edit-breed-title"
                            type="text"
                            class="validate"
                        >
                        <label for="edit-breed-title">Breed Title</label>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat ">Close</a>
                <a @click.prevent="updateBreed"
                    href="#!"
                    class="modal-action waves-effect waves-green btn-flat"
                >
                    Update
                </a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['initialBreeds'],

    data() {
        return {
            breeds: this.initialBreeds,
            showAddBreedInput: false,
            addBreedData: {
                title: ''
            },
            editBreedData: {
                index: -1,
                id: 0,
                title: ''
            }
        }
    },

    methods: {
        toggleAddBreedContainer() {
            this.showAddBreedInput = !this.showAddBreedInput;
        },

        addBreed() {
            const vm = this;

            // Add to server's database
            axios.post('/admin/manage/breeds', {
                title: vm.addBreedData.title
            })
            .then((response) => {
                // Put response in local data storage and erase adding of breed data
                vm.breeds.push(response.data);
                vm.addBreedData.title = '';

                // Update UI after adding breed
                vm.$nextTick(() => {
                    $('#breed-title').removeClass('valid');
                    Materialize.updateTextFields();
                    Materialize.toast('Breed added', 2000, 'green lighten-1');
                });
            })
            .catch((error) => {
                console.log(error);
            });
        },

        toggleEditBreedModal(index) {
            this.editBreedData.index = index;
            this.editBreedData.id = this.breeds[index].id;
            this.editBreedData.title = this.breeds[index].title;

            $('#edit-breed-modal').modal('open');
            this.$nextTick(() => {
                Materialize.updateTextFields();
            });
        },

        updateBreed() {
            const vm = this;
            const index = this.editBreedData.index;

            axios.patch('/admin/manage/breeds', {
                breedId: vm.editBreedData.id,
                title: vm.editBreedData.title
            })
            .then((response) => {
                // Update local data storage and erase editing of breed data
                if(response.data === 'OK'){
                    vm.breeds[index].title = vm.editBreedData.title;
                    vm.editBreedData = {
                        index: -1,
                        id: 0,
                        title: ''
                    };
                }

                // Update UI after updating breed
                vm.$nextTick(() => {
                    $('#edit-breed-modal').modal('close');
                    $('#edit-breed-title').removeClass('valid');
                    Materialize.updateTextFields();
                    Materialize.toast('Breed updated', 2000, 'green lighten-1');
                });
            })
            .catch((error) => {
                console.log(error);
            });
        }

    },

    mounted() {
        // Materialize component initializations
        $('.modal').modal();
    }
}
</script>

<style lang="css">
    .collection-header a, .edit-breed-button, #close-add-breed-container-button {
        cursor: pointer;
    }

    .collection-item .row {
        margin-bottom: 0;
    }

    #edit-breed-modal {
        width: 30rem;
        height: 20rem;
    }

</style>
