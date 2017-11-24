<template lang="html">

    <div class="row">
        <div class="col s12">
            <h4 class="title-page"> Manage Breeds </h4>
        </div>

        <div class="col s12">
            <ul class="collection with-header">
                <li class="collection-header right-align">
                    <a @click.prevent="toggleAddBreedContainer()"
                        href="#!"
                        class="title-page"
                    >
                        Add New
                        <i class="material-icons right">add</i>
                    </a>
                </li>
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
    props: ['breeds'],

    data() {
        return {
            addBreedDetails: {
                title: ''
            }
        }
    },

    methods: {
        toggleAddBreedContainer() {
            console.log('toggle!');
        },

        addBreed() {
            console.log('add!');
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
    .collection-header {
        cursor: pointer;
    }

    .edit-breed-button {
        cursor: pointer;
    }

</style>
