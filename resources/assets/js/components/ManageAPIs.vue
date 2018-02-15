<template lang="html">
    <div class="row">
        <div class="col s12">
            <h4 class="title-page"> Manage API Credentials </h4>
        </div>

        <div class="col s12">
            <ul class="collection with-header">
                <!-- Toggle add credentials container button -->
                <li class="collection-header">
                    <a @click.prevent="showAddCredentialsContainer = !showAddCredentialsContainer"
                        href="#!"
                        id="toggle-add-credentials-container-button"
                        class="btn-floating waves-effect waves-light tooltipped"
                        data-position="right"
                        data-delay="50"
                        data-tooltip="Add new Credentials"
                    >
                        <i class="material-icons right">add</i>
                    </a>
                </li>
                <!-- Add credentials container -->
                <li v-show="showAddCredentialsContainer" class="collection-item">
                    <div class="row">
                        <div class="col s12">
                            <i @click.prevent="showAddCredentialsContainer = !showAddCredentialsContainer"
                                id="close-add-credentials-container-button"
                                class="material-icons right"
                            >
                                close
                            </i>
                        </div>
                        <div class="col s4 offset-s4">
                            <blockquote class="">
                                Note that the Client ID and Secret will be sent to your email as well.
                            </blockquote>
                        </div>
                        <div class="input-field col s4 offset-s4">
                            <input v-model="addCredentialsData.name"
                                id="add-credentials-name"
                                type="text"
                                class="validate"
                            >
                            <label for="add-credentials-name">Name</label>
                        </div>
                        <div class="input-field col s4 offset-s4">
                            <input v-model="addCredentialsData.redirect"
                                id="add-credentials-redirect"
                                type="text"
                                class="validate"
                            >
                            <label for="add-credentials-redirect">Redirect</label>
                        </div>
                        <div class="col s4 offset-s4">
                            <a @click.prevent="addCredentials()"
                                href="#!"
                                class="right btn"
                            >
                                Submit
                                <i class="material-icons right">send</i>
                            </a>
                        </div>
                    </div>
                </li>
                <!-- Show this list if there are not listed clients -->
                <li v-if="clients.length < 1"
                    class="collection-item avatar center-align"
                >
                    <span class="title"> No clients yet.</span>
                </li>
                <!-- Exising credentials list -->
                <li v-for="(client, index) in clients"
                    v-else
                    class="collection-item avatar"
                >
                    <span class="title"> {{ client.name }} </span>
                    <p class="grey-text">
                        Client ID: {{ client.id }} <br>
                        Client Secret: {{ client.secret }} <br>
                        Redirect: {{ client.redirect }}
                    </p>


                    <span class="secondary-content">
                        <a @click.prevent="toggleEditCredentialsModal(index)"
                            href="#"
                            class="edit-credentials-button"
                        >
                            <i class="material-icons">edit</i>
                        </a>

                        <a @click.prevent="toggleDeleteCredentialsModal(index)"
                            href="#"
                            class="delete-credentials-button red-text text-lighten-2"
                        >
                            <i class="material-icons">delete</i>
                        </a>
                    </span>

                </li>
            </ul>
        </div>

        <!-- Edit Credentials Modal -->
        <div id="edit-credentials-modal" class="modal modal-fixed-footer">
            <div class="modal-content">
                <h4>Edit Credentials</h4>
                <div class="row">
                    <div class="input-field col s12">
                        <input v-model="editCredentialsData.name"
                            id="edit-credentials-name"
                            type="text"
                        >
                        <label for="edit-credentials-name">Name</label>
                    </div>
                    <div class="input-field col s12">
                        <input v-model="editCredentialsData.redirect"
                            id="edit-credentials-redirect"
                            type="text"
                        >
                        <label for="edit-credentials-redirect">Redirect</label>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat ">Close</a>
                <a @click.prevent="updateCredentials"
                    href="#!"
                    class="modal-action waves-effect waves-green btn-flat"
                >
                    Update
                </a>
            </div>
        </div>

        <!-- Delete Credentials Modal -->
        <div id="delete-credentials-modal" class="modal modal-fixed-footer">
            <div class="modal-content">
                <h4>Delete Credentials</h4>
                <p>
                    <blockquote class="error">
                        THIS ACTION CANNOT BE UNDONE.
                    </blockquote>
                    Are you sure you want to delete credentials for <b>{{ deleteCredentialsData.name }}</b>? <br>
                </p>
            </div>
            <div class="modal-footer">
                <a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat ">Close</a>
                <a @click.prevent="deleteCredentials"
                    href="#!"
                    class="modal-action waves-effect waves-green btn-flat"
                >
                    Delete
                </a>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                clients: [],
                showAddCredentialsContainer: false,
                addCredentialsData: {
                    name: '',
                    redirect: ''
                },
                editCredentialsData: {
                    index: -1,
                    id: 0,
                    name: '',
                    redirect: ''
                },
                deleteCredentialsData: {
                    index: -1,
                    id: 0,
                    name: ''
                }
            }
        },

        methods: {
            getClients() {
                axios.get('/oauth/clients')
                .then((response) => {
                    this.clients = response.data;
                })
                .catch((error) => {
                    console.log(error);
                });
            },

            addCredentials() {
                // Add to server's database
                axios.post('/oauth/clients', {
                    name: this.addCredentialsData.name,
                    redirect: this.addCredentialsData.redirect
                })
                .then((response) => {
                    // Put response in local data storage and erase adding of property data
                    this.clients.unshift(response.data);
                    this.addCredentialsData = {
                        name: '',
                        redirect: ''
                    };

                    // Update UI after adding credentials
                    this.$nextTick(() => {
                        $('#add-credentials-name').removeClass('valid');
                        $('#add-credentials-redirect').removeClass('valid');

                        Materialize.updateTextFields();
                        Materialize.toast('Credentials added', 2000, 'green lighten-1');
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
            },

            toggleEditCredentialsModal(index) {
                // Initialize data for editing
                this.editCredentialsData.index = index;
                this.editCredentialsData.id = this.clients[index].id;
                this.editCredentialsData.name = this.clients[index].name;
                this.editCredentialsData.redirect = this.clients[index].redirect;

                $('#edit-credentials-modal').modal('open');
                this.$nextTick(() => {
                    Materialize.updateTextFields();
                });
            },

            updateCredentials() {
                const index = this.editCredentialsData.index;

                // Update to server's database
                axios.put(`/oauth/clients/${this.editCredentialsData.id}`, {
                    name: this.editCredentialsData.name,
                    redirect: this.editCredentialsData.redirect
                })
                .then((response) => {
                    const data = response.data;

                    this.clients[index].name = data.name;
                    this.clients[index].redirect = data.redirect;
                    this.editCredentialsData = {
                        index: -1,
                        id: 0,
                        name: '',
                        redirect: ''
                    };

                    // Update UI after updating credentials
                    this.$nextTick(() => {
                        $('#edit-credentials-modal').modal('close');
                        $('#add-credentials-name').removeClass('valid');
                        $('#add-credentials-redirect').removeClass('valid');

                        Materialize.updateTextFields();
                        Materialize.toast('Credentials updated', 2000, 'green lighten-1');
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
            },

            toggleDeleteCredentialsModal(index) {
                // Initialize data for deleting
                this.deleteCredentialsData.index = index;
                this.deleteCredentialsData.id = this.clients[index].id;
                this.deleteCredentialsData.name = this.clients[index].name;

                $('#delete-credentials-modal').modal('open');
            },

            deleteCredentials() {
                const index = this.deleteCredentialsData.index;

                // Delete from server's database
                axios.delete(`/oauth/clients/${this.deleteCredentialsData.id}`)
                .then((response) => {
                    // Remove from local storage
                    this.clients.splice(index,1);

                    // Update UI after deleting credentials
                    this.$nextTick(() => {
                        $('#delete-credentials-modal').modal('close');

                        Materialize.toast('Credentials deleted', 2000, 'green lighten-1');
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

            // Initialize data
            this.getClients();
        }
    }
</script>

<style lang="css">
    .collection-header a, .edit-property-button, #close-add-credentials-container-button {
        cursor: pointer;
    }

    .collection-item.avatar {
        padding-left: 20px !important;
    }

    #edit-credentials-modal {
        width: 50rem;
        height: 25rem;
    }

    #delete-credentials-modal {
        width: 40rem;
        height: 23rem;
    }

    blockquote.error{
    	border-left: 5px solid #ee6e73;
    	background-color: #fdf0f1;
    }

</style>
