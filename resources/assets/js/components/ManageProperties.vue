<template lang="html">

    <div class="row">
        <div class="col s12">
            <h4 class="title-page"> Manage Properties </h4>
        </div>

        <div class="col s12">
            <ul class="collection with-header">
                <!-- Toggle add breed container button -->
                <li class="collection-header">
                    <a @click.prevent="showAddPropertyContainer = !showAddPropertyContainer"
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
                <li v-show="showAddPropertyContainer" class="collection-item">
                    <div class="row">
                        <div class="col s12">
                            <i @click.prevent="showAddPropertyContainer = !showAddPropertyContainer"
                                id="close-add-property-container-button"
                                class="material-icons right"
                            >
                                close
                            </i>
                        </div>
                        <div class="col s4 offset-s4">
                            <blockquote class="">
                                Note that Property and Slug fields cannot be edited once
                                it has been submitted already.
                            </blockquote>
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
                    <div class="input-field col s12">
                        <input v-model="editPropertyData.property"
                            id="edit-property"
                            type="text"
                            disabled
                        >
                        <label for="edit-property">Property</label>
                    </div>
                    <div class="input-field col s12">
                        <input v-model="editPropertyData.slug"
                            id="edit-slug"
                            type="text"
                            disabled
                        >
                        <label for="edit-slug">Slug</label>
                    </div>
                    <div class="input-field col s12">
                        <input v-model="editPropertyData.definition"
                            id="edit-definition"
                            type="text"
                            class="validate"
                        >
                        <label for="edit-definition">Definition</label>
                    </div>
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
                showAddPropertyContainer: false,
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

                    // Update UI after adding property
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
                // Initialize data for editing
                this.editPropertyData.index = index;
                this.editPropertyData.id = this.properties[index].id;
                this.editPropertyData.slug = this.properties[index].slug;
                this.editPropertyData.property = this.properties[index].property;
                this.editPropertyData.definition = this.properties[index].definition;

                $('#edit-property-modal').modal('open');
                this.$nextTick(() => {
                    Materialize.updateTextFields();
                });
            },

            updateProperty() {
                const vm = this;
                const index = this.editPropertyData.index;

                // Update to server's database
                axios.patch('/admin/manage/properties', {
                    propertyId: vm.editPropertyData.id,
                    definition: vm.editPropertyData.definition
                })
                .then((response) => {
                    // Update local data storage and erase editing of property data
                    if(response.data === 'OK'){
                        vm.properties[index].definition = vm.editPropertyData.definition;
                        vm.editPropertyData = {
                            index: -1,
                            id: 0,
                            slug: '',
                            property: '',
                            definition: ''
                        };
                    }

                    // Update UI after updating property
                    vm.$nextTick(() => {
                        $('#edit-property-modal').modal('close');
                        $('#add-property').removeClass('valid');
                        $('#add-slug').removeClass('valid');
                        $('#add-definition').removeClass('valid');

                        Materialize.updateTextFields();
                        Materialize.toast('Property updated', 2000, 'green lighten-1');
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

            // Watch the respective property to produce a default slug
            this.$watch('addPropertyData.property', (newValue) => {
                this.addPropertyData.slug = _.snakeCase(newValue);
                this.$nextTick(() => {
                    Materialize.updateTextFields();
                });
            });
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

    #edit-property-modal {
        width: 30rem;
        height: 35rem;
    }

</style>
