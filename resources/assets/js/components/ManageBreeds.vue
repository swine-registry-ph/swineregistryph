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
                            <input v-model="breedTitle"
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
                        <a @click.prevent="editBreed(index)"
                            href="#"
                            class="secondary-content edit-breed-button"
                        >
                            <i class="material-icons">edit</i>
                        </a>
                    </span>
                </li>
            </ul>
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
            breedTitle: ''
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
                title: vm.breedTitle
            })
            .then((response) => {
                // Put response in local data storage
                vm.breeds.push(response.data);
                vm.breedTitle = '';

                // Update UI after add
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

        editBreed(index) {
            console.log(index);
        }
    },

    mounted() {

    }
}
</script>

<style lang="css">
    .collection-header a, .edit-breed-button, #close-add-breed-container-button {
        cursor: pointer;
    }

    .collection-item .row{
        margin-bottom: 0;
    }

</style>
