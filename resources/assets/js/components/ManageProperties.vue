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
                <li v-show="showAddPropertyContainer" id="add-property-container" class="collection-item">
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
                            <a @click.prevent="addProperty($event)"
                                href="#!"
                                class="right btn z-depth-0 add-property-btn"
                            >
                                Add Property
                            </a>
                        </div>
                    </div>
                </li>
                <!-- Existing properties list -->
                <li v-for="(property, index) in properties"
                    class="collection-item avatar"
                >
                    <span class="title"> <b>{{ property.property }}</b> </span>
                    <p class="grey-text">
                        Slug: {{ property.slug }} <br>
                        Definition: {{ property.definition }}
                    </p>
                    <span class="secondary-content">
                        <a @click.prevent="toggleEditPropertyModal(index)"
                            href="#"
                            class="btn custom-secondary-btn
                                edit-property-button
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

        <!-- Edit Property Modal -->
        <div id="edit-property-modal" class="modal modal-fixed-footer">
            <div class="modal-content">
                <h4>
                    Edit Property
                    <i class="material-icons right modal-close">close</i>
                </h4>
                <div class="row modal-input-container">
                    <div class="col s12"> <br/> </div>
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
            <div class="modal-footer grey lighten-3">
                <a href="#!" class="modal-action modal-close waves-effect btn-flat ">Close</a>
                <a @click.prevent="updateProperty($event)"
                    href="#!"
                    class="modal-action waves-effect btn blue darken-1 z-depth-0 update-property-btn"
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
            initialProperties: Array
        },

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
            addProperty(event) {
                const vm = this;
                const addPropertyButton = $('.add-property-btn');

                this.disableButtons(addPropertyButton, event.target, 'Adding...');

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
                        
                        this.enableButtons(addPropertyButton, event.target, 'Add Property');

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

            updateProperty(event) {
                const vm = this;
                const index = this.editPropertyData.index;
                const updatePropertyButton = $('.update-property-btn');

                this.disableButtons(updatePropertyButton, event.target, 'Updating...');

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

                        this.enableButtons(updatePropertyButton, event.target, 'Update');

                        Materialize.updateTextFields();
                        Materialize.toast('Property updated', 2000, 'green lighten-1');
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

<style scoped lang="css">
    .collection-header a, .edit-property-button, #close-add-property-container-button {
        cursor: pointer;
    }

    .collection-item .row {
        margin-bottom: 0;
    }

    .collection-item.avatar {
        padding-left: 20px !important;
    }

    #add-property-container {
        padding-bottom: 2rem;
    }

    #edit-property-modal {
        width: 30rem;
        height: 35rem;
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
