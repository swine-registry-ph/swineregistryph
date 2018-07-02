<template lang="html">
    <div class="row">
        <div class="col s12">
            <h4 class="title-page"> Manage Breeders </h4>
        </div>

        <div class="col s12">
            <div id="toggle-register-breeder-btn-container" class="col s12"> 
                <a @click.prevent="showAddBreedersModal" 
                    id="toggle-register-breeder-btn" 
                    class="btn" 
                    href="#!"
                >
                    <i class="material-icons left">add</i> Register Breeder
                </a>
            </div>
            <div v-for="(breeder,index) in breeders" 
                :key="breeder.id"
                class="col s12 m6 l6"
            >
                <div class="card">
                    <div class="card-content">
                        <span class="card-title"> <b>{{ breeder.name }}</b> </span>
                        <p class="grey-text"> 
                            {{ breeder.status }} • {{ breeder.email }}
                            
                        </p>
                        <p>
                            <br/>
                            <a @click.prevent="showFarms(index)"
                                href="#!"
                                class="black-text"
                            >
                                <i class="material-icons left view-farm-btn"> store </i>
                                VIEW FARMS
                            </a>
                        </p>
                    </div>
                    <div class="card-action grey lighten-3">
                        <a href="#!" class="btn blue darken-1 toggle-edit-breeder-btn z-depth-0">Edit</a>
                        <a href="#!" class="red-text text-darken-1 toggle-delete-breeder-btn">Delete</a>
                        <a href="#!" class="grey-text text-darken-1 toggle-block-breeder-btn">Block</a>
                    </div>
                </div>
            </div>
        </div>

        <div id="show-farms-modal" class="modal">
            <div class="modal-content">
                <h4>
                    Farms
                    <i class="material-icons right modal-close">close</i>
                </h4>
            </div>
            <div class="modal-footer">

            </div>
        </div>

        <div id="add-breeder-modal" class="modal">
            <div class="modal-content">
                <h4>
                    Register Breeder
                    <i class="material-icons right modal-close">close</i>
                </h4>

                <div class="row">
                    <div class="input-field col s12">
                        <input v-model="addBreederData.name"
                            id="add-breeder-name"
                            type="text"
                            class="validate"
                        >
                        <label for="add-breeder-name">Name</label>
                    </div>
                    <div class="input-field col s12">
                        <input v-model="addBreederData.email"
                            id="add-breeder-email"
                            type="text"
                            class="validate"
                        >
                        <label for="add-breeder-email">Email</label>
                    </div>
                </div>
            </div>
            <div class="modal-footer grey lighten-3">
                <a href="#!" class="modal-action modal-close btn-flat">Cancel</a>
                <a @click.prevent="registerBreeder($event)" 
                    href="#!" 
                    class="modal-action btn z-depth-0 register-breeder-btn"
                >
                    Register
                </a>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            breeders: Array
        },

        data() {
            return {
                addBreederData: {
                    name: '',
                    email: ''
                }
            }
        },

        methods: {
            showFarms(index) {
                $('#show-farms-modal').modal('open');
            },

            showAddBreedersModal() {
                $('#add-breeder-modal').modal('open');
            },

            registerBreeder(event) {
                const vm = this;
                const registerBreederButton = $('.register-breeder-btn');

                this.disableButtons(registerBreederButton, event.target, 'Registering...');

                // Add to server's database
                axios.post('/admin/manage/breeders', {
                    name: vm.addBreederData.name,
                    email: vm.addBreederData.email
                })
                .then((response) => {
                    // Put response in local data storage and erase adding of property data
                    
                    vm.breeders.push(response.data);
                    vm.addBreederData = {
                        name: '',
                        email: ''
                    };

                    // Update UI after adding property
                    vm.$nextTick(() => {
                        $('#add-breeder-modal').modal('close');
                        $('#add-breeder-name').removeClass('valid');
                        $('#add-breeder-email').removeClass('valid');

                        this.enableButtons(registerBreederButton, event.target, 'Register');

                        Materialize.updateTextFields();
                        Materialize.toast(`${response.data.name} added`, 2500, 'green lighten-1');
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

        mounted(){
            // Materialize component initializations
            $('.modal').modal();
        }
    }
</script>

<style scoped>
    h4 i {
        cursor: pointer;
    }

    .card .card-action {
        border: 0;
    }

    #toggle-register-breeder-btn-container {
        padding: 2rem 0 1rem 0;
    }

    #toggle-register-breeder-btn {
        border-radius: 20px;
    }

    #add-breeder-modal {
        width: 40rem;
    }

    .modal .modal-footer {
        padding-right: 2rem;
    }

    .toggle-delete-breeder-btn {
        margin-left: 1.5rem;
    }

</style>


