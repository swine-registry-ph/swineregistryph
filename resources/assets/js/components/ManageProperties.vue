<template lang="html">

    <div class="row">
        <div class="col s12">
            <h4 class="title-page"> Manage Properties </h4>
        </div>

        <div class="col s12">
            <ul class="collection with-header">
                <!-- Toggle add breed container button -->
                <li class="collection-header">
                    <a @click.prevent="toggleAddPropertyContainer()"
                        href="#!"
                        id="toggle-add-property-container-button"
                        class="btn-floating waves-effect waves-light tooltipped"
                        data-position="right"
                        data-delay="50"
                        data-tooltip="Add new property"
                    >
                        <i class="material-icons right">add</i>
                    </a>
                </li>
                <!-- Add property container -->
                <li v-show="showAddPropertyInput" class="collection-item">
                    <div class="row">
                        <div class="col s12">
                            <i @click.prevent="toggleAddPropertyContainer()"
                                id="close-add-property-container-button"
                                class="material-icons right"
                            >
                                close
                            </i>
                        </div>
                        <div class="input-field col s4 offset-s4">
                            <input v-model="addPropertyData.property"
                                id="add-property"
                                type="text"
                                class="validate"
                            >
                            <label for="add-property">Property</label>
                        </div>
                        <div class="input-field col s4 offset-s4">
                            <input v-model="addPropertyData.slug"
                                id="add-slug"
                                type="text"
                                class="validate"
                            >
                            <label for="add-slug">Slug</label>
                        </div>
                        <div class="input-field col s4 offset-s4">
                            <input v-model="addPropertyData.definition"
                                id="add-definition"
                                type="text"
                                class="validate"
                            >
                            <label for="add-definition">Definition</label>
                        </div>
                        <div class="col s4 offset-s4">
                            <a @click.prevent="addProperty()"
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
                <li v-for="(property, index) in properties"
                    class="collection-item avatar"
                >
                    <span class="title"> {{ property.property }} </span>
                    <p class="grey-text">
                        Slug: {{ property.slug }} <br>
                        Definition: {{ property.definition }}
                    </p>


                    <a @click.prevent="toggleEditPropertyModal(index)"
                        href="#"
                        class="secondary-content edit-property-button"
                    >
                        <i class="material-icons">edit</i>
                    </a>

                </li>
            </ul>
        </div>

        <!-- Edit Property Modal -->
        <div id="edit-property-modal" class="modal modal-fixed-footer">
            <div class="modal-content">
                <h4>Edit Property</h4>
                <div class="row">
                    <!-- <div class="input-field col s12">
                        <input v-model="editPropertyData.title"
                            id="edit-breed-title"
                            type="text"
                            class="validate"
                        >
                        <label for="edit-breed-title">Breed Title</label>
                    </div> -->
                </div>
            </div>
            <div class="modal-footer">
                <a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat ">Close</a>
                <a @click.prevent="updateProperty"
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
    props: ['initialProperties'],

    data() {
        return {
            properties: this.initialProperties,
            showAddPropertyInput: false,
            addPropertyData: {
                slug: '',
                property: '',
                definition: ''
            },
            editPropertyData: {
                index: -1,
                id: 0,
                slug: '',
                property: '',
                definition: ''
            }
        }
    },

    methods: {
        toggleAddPropertyContainer() {
            this.showAddPropertyInput = !this.showAddPropertyInput;
        },

        addProperty() {
            const vm = this;

            // Add to server's database
            axios.post('/admin/manage/properties', {
                slug: vm.addPropertyData.slug,
                property: vm.addPropertyData.property,
                definition: vm.addPropertyData.definition,
            })
            .then((response) => {
                // Put response in local data storage and erase adding of property data
                vm.properties.push(response.data);
                vm.addPropertyData = {
                    slug: '',
                    property: '',
                    definition: ''
                };

                // Update UI after adding breed
                vm.$nextTick(() => {
                    $('#add-property').removeClass('valid');
                    $('#add-slug').removeClass('valid');
                    $('#add-definition').removeClass('valid');
                    Materialize.updateTextFields();
                    Materialize.toast('Property added', 2000, 'green lighten-1');
                });
            })
            .catch((error) => {
                console.log(error);
            });
        },

        toggleEditPropertyModal(index) {
            console.log(index);
        },

        updateProperty() {
            console.log('Update!');
        }

    },

    mounted() {
        // Materialize component initializations
        $('.modal').modal();
    }
}
</script>

<style lang="css">
    .collection-header a, .edit-property-button, #close-add-property-container-button {
        cursor: pointer;
    }

    .collection-item .row {
        margin-bottom: 0;
    }

    .collection-item.avatar {
        padding-left: 20px !important;
    }

    #edit-property-button-modal {
        width: 30rem;
    }

</style>
