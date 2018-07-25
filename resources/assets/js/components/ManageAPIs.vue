<template lang="html">
    <div class="row">
        <div class="col s12">
            <h4 class="title-page">
                Manage API Credentials
                <i @click.prevent="showHelpInfo = !showHelpInfo"
                    id="show-help-info-button"
                    class="material-icons tooltipped"
                    data-position="right"
                    data-delay="50"
                    data-tooltip="Click for help"
                >
                    info_outline
                </i>
            </h4>
        </div>

        <!-- Help info -->
        <div v-if="showHelpInfo" class="col s12">
            <div class="col s12">
                <i @click.prevent="showHelpInfo = !showHelpInfo"
                    id="close-help-info-button"
                    class="material-icons right"
                >
                    close
                </i>
            </div>
            <div class="col s12">
                <blockquote class="">
                    Note that the API credentials are for machine-to-machine communication. <br>
                    See <a href="https://oauth.net/2/grant-types/client-credentials/">Client Credentials Grant</a>
                    for more information.
                </blockquote>
                <pre>
<code>
1. After the client credentials are created, get your access token
    by making a POST request to 'http://breedregistry.test/oauth/token'
    w/ the following body data:

    {
        grant_type: 'client_credentials',
        client_id: &lt;client_id&gt;,
        client_secret: &lt;client_secret&gt;
    }

2. Now when the access token is acquired, every request in our API should
    include and Authorization header with the acquired access token.
    For example, GET request to 'http://breedregistry.test/api/v1/swines'
    should include the following the Authorization header:

    {
        Authorization: Bearer &lt;access_token&gt;
    }
</code>
                </pre>
            </div>
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
                            <a @click.prevent="addCredentials($event)"
                                href="#!"
                                class="right btn add-credentials-button"
                            >
                                Submit
                                <i class="material-icons right">send</i>
                            </a>
                        </div>
                    </div>
                </li>

                <!-- Show this list if there are not listed clients -->
                <template v-if="clients.length < 1">
                    <li class="collection-item avatar center-align">
                        <span class="title"> No clients yet.</span>
                    </li>
                </template>

                <!-- Exising credentials list -->
                <li v-for="(client, index) in clients" 
                    :key="client.id"
                    v-else
                    class="collection-item avatar"
                >
                    <span class="title"> {{ client.name }} </span>
                    <p class="grey-text">
                        CLIENT_ID: {{ client.id }} <br>
                        CLIENT_SECRET: {{ client.secret }} <br>
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
                <a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat update-credentials-button">Close</a>
                <a @click.prevent="updateCredentials($event)"
                    href="#!"
                    class="modal-action waves-effect waves-green btn-flat update-credentials-button"
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
                <a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat delete-credentials-button">Close</a>
                <a @click.prevent="deleteCredentials($event)"
                    href="#!"
                    class="modal-action waves-effect waves-green btn-flat delete-credentials-button"
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
                showHelpInfo: false,
                showAddCredentialsContainer: false,
                addCredentialsData: {
                    name: '',
                    redirect: 'http://localhost/callback'
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

            addCredentials(event) {
                const addButtons = $('.add-credentials-button');

                this.disableButtons(addButtons, event.target, 'Adding...');

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

                        this.enableButtons(addButtons, event.target, 'Submit <i class="material-icons right">send</i>');

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

            updateCredentials(event) {
                const index = this.editCredentialsData.index;
                const updateButtons = $('.update-credentials-button');

                this.disableButtons(updateButtons, event.target, 'Updating...');

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
                        this.enableButtons(updateButtons, event.target, 'Update');

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

            deleteCredentials(event) {
                const index = this.deleteCredentialsData.index;
                const deleteButtons = $('.delete-credentials-button');

                this.disableButtons(deleteButtons, event.target, 'Deleting...');

                // Delete from server's database
                axios.delete(`/oauth/clients/${this.deleteCredentialsData.id}`)
                .then((response) => {
                    // Remove from local storage
                    this.clients.splice(index,1);

                    // Update UI after deleting credentials
                    this.$nextTick(() => {
                        $('#delete-credentials-modal').modal('close');
                        this.enableButtons(deleteButtons, event.target, 'Delete');

                        Materialize.toast('Credentials revoked', 2000, 'green lighten-1');
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
            $('.modal').modal({
                dismissible: false
            });

            // Initialize data
            this.getClients();
        }
    }
</script>

<style scoped lang="css">
    .collection-header a,
    .edit-property-button,
    #close-add-credentials-container-button,
    #show-help-info-button,
    #close-help-info-button {
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

</style>
