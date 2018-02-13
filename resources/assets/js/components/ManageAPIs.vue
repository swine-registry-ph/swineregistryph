<template lang="html">
    <div class="row">
        <div class="col s12">
            <h4 class="title-page"> Manage APIs </h4>
        </div>

        <div class="col s12">
            <ul class="collection with-header">
                <!-- Toggle add credentials container button -->
                <li class="collection-header">
                    <a @click.prevent=""
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
                        Client Secret: {{ client.secret }}
                    </p>


                    <a @click.prevent=""
                        href="#"
                        class="secondary-content edit-property-button"
                    >
                        <i class="material-icons">edit</i>
                    </a>

                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                clients: []
            }
        },

        methods: {

        },

        mounted() {
            // Initialize data
            axios.get('/oauth/clients')
            .then((response) => {
                this.clients = response.data;
            })
            .catch((error) => {
                console.log(error);
            });
        }
    }
</script>

<style lang="css">
    .collection-item.avatar {
        padding-left: 20px !important;
    }
</style>
