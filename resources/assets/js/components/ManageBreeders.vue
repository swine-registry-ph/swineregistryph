<template lang="html">
    <div class="row">
        <div class="col s12">
            <h4 class="title-page"> Manage Breeders </h4>
        </div>

        <div class="col s12">
            <div id="add-breeder-btn-container" class="col s12"> 
                <a id="add-breeder-btn" class="btn" href="#!">
                    <i class="material-icons left">add</i> Add Breeder
                </a>
            </div>
            <div v-for="(breeder,index) in breeders" 
                :key="breeder.id"
                class="col s12 m6 l6"
            >
                <div class="card">
                    <div class="card-content">
                        <span class="card-title"> <b>{{ breeder.name }}</b> </span>
                        <p> 
                            <i @click.prevent="showFarms(index)"
                                class="material-icons right view-farm-btn tooltipped" 
                                data-position="top" 
                                data-delay="50" 
                                data-tooltip="View Farm/s"
                            >
                                store
                            </i>
                            {{ breeder.email }} <br/>
                            {{ breeder.status_instance }}
                        </p>
                    </div>
                    <div class="card-action grey lighten-3">
                        <a href="#!" class="btn blue darken-1 edit-breeder-btn z-depth-0">Edit</a>
                        <a href="#!" class="red-text text-darken-1 delete-breeder-btn">Delete</a>
                        <a href="#!" class="grey-text text-darken-1 block-breeder-btn">Block</a>
                    </div>
                </div>
            </div>
        </div>

        <div id="show-farms-modal" class="modal">
            <div class="modal-content">
                <h4>Farms</h4>
            </div>
            <div class="modal-footer">

            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            breeders: Array
        },

        methods: {
            showFarms(index) {
                $('#show-farms-modal').modal('open');
            }
        },

        mounted(){
            // Materialize component initializations
            $('.modal').modal();
        }
    }
</script>

<style scoped>
    .card .card-action {
        border: 0;
    }

    #add-breeder-btn-container {
        padding: 2rem 0 1rem 0;
    }

    #add-breeder-btn {
        border-radius: 20px;
    }

    .delete-breeder-btn {
        margin-left: 1.5rem;
    }

    .view-farm-btn {
        font-size: 2.5rem;
        cursor: pointer;
    }
</style>


