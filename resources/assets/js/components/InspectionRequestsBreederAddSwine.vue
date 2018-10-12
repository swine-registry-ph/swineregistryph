<template>
    <div class="col s12">

        <div class="col s12">
            <h4 class="title-page"> Add Swine to Inspection Request </h4>
        </div>

        <!-- Back to Viewing button container -->
        <div class="col s12">
            <a @click.prevent="hideAddSwineView"
                id="back-to-viewing-btn"
                href="#!"
                class="btn custom-secondary-btn blue-text text-darken-1 z-depth-0"
            >
                <i class="material-icons left">keyboard_arrow_left</i>
                Back To Viewing
            </a>
        </div>

        <!-- Preloader -->
        <div v-if="loading" 
            class="col s12 center-align"
        >
            <div class="preloader-wrapper active">
                <div class="spinner-layer spinner-blue-only">
                    <div class="circle-clipper left">
                        <div class="circle"></div>
                    </div>
                    <div class="gap-patch">
                        <div class="circle"></div>
                    </div>
                    <div class="circle-clipper right">
                        <div class="circle"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Inspection Request details container -->
        <div v-else class="col s12">
            <div id="inspection-container" class="card z-depth-0">
                <div class="card-content">
                    <span class="card-title">
                        <b>Inspection #{{ inspectionData.inspectionId }}</b>
                    </span>
                    <p class="grey-text">
                        {{ inspectionData.farmName }}
                    </p>

                    <div class="row">
                        <!-- Included Swines -->
                        <div id="included-swines-container" class="col s12">
                            <h6><b>Included Swines</b></h6>
                            <div class="divider"></div>

                            <!-- Empty -->
                            <div v-if="includedSwines.length < 1" class="center-align">
                                <p><br>Sorry, there are no included swines.</p>
                            </div>

                            <!-- Non-empty -->
                            <div v-else v-for="swine in includedSwines" 
                                :key="swine.id"
                                class="col s6 m3 included-swine-container"
                            >
                                <span>
                                    <i class="material-icons left">label</i>
                                    {{ swine.registrationNo }}
                                </span>
                            </div>
                        </div>

                        <!-- Available Swines -->
                        <div id="available-swines-container" class="col s12">
                            <h6><b>Available Swines</b></h6>
                            <div class="divider"></div>

                            <!-- Empty -->
                            <div v-if="availableSwines.length < 1" class="center-align">
                                <p><br>Sorry, there are no available swines.</p>
                            </div>

                            <!-- Non-empty -->
                            <div v-else v-for="swine in availableSwines"
                                :key="swine.id"
                                class="col s6 m3 checkbox-container"
                            >
                                <input v-model="swineIdsToAdd"
                                    :value="swine.id"
                                    :id="`swine-${swine.id}`"
                                    type="checkbox" 
                                    class="filled-in" 
                                />
                                <label :for="`swine-${swine.id}`" class="black-text">{{ swine.registrationNo }}</label>
                            </div>

                            <!-- Add Swines button container -->
                            <div id="add-swine-btn-container" class="col s12 center-align">
                                <button @click.prevent="addSwines($event)"
                                    class="btn z-depth-0 add-swines-btn"
                                >
                                    Add Chosen Swines
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            inspectionData: Object,
        },

        data() {
            return {
                loading: true,
                availableSwines: [],
                includedSwines: [],
                swineIdsToAdd: []
            }
        },

        watch: {
            inspectionData: {
                handler: function(newValue, oldValue) {
                    if(newValue.inspectionId !== 0) {
                        this.fetchSwinesWithInspection(newValue);
                    }
                },
                deep: true
            }
        },

        methods: {
            hideAddSwineView() {
                this.loading = true;
                this.$emit('hideAddSwineViewEvent');
            },

            fetchSwinesWithInspection(inspectionData) {
                const inspectionId = inspectionData.inspectionId;

                axios.get(`/breeder/inspections/${inspectionId}/swines`)
                .then(({data}) => {
                    this.availableSwines = data.available;
                    this.includedSwines = data.included;
                    
                    setTimeout(() => {
                        this.loading = false;
                    }, 1000);
                })
                .catch((error) => {
                    console.log(error);
                });
            },

            addSwines(event) {
                const vm = this;
                const addSwinesBtn = $('.add-swines-btn');
                const inspectionId = this.inspectionData.inspectionId;

                this.disableButtons(addSwinesBtn, event.target, 'Adding...');

                // Add to server's database
                axios.post(`/breeder/inspections/${inspectionId}/swines`, {
                    swineIds: vm.swineIdsToAdd
                })
                .then(({data}) => {
                    // Put response in local data storage
                    vm.availableSwines = data.available;
                    vm.includedSwines = data.included;

                    // Update UI after adding swines to inspection request
                    vm.$nextTick(() => {
                        this.enableButtons(addSwinesBtn, event.target, 'Add Chosen Swines');

                        Materialize.toast('Swines successfully added', 2000, 'green lighten-1');
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
        }
    }
</script>

<style scoped>
    .custom-secondary-btn {
        border: 1px solid;
        background-color: white !important;
    }

    #back-to-viewing-btn {
        margin-top: 2rem;
        margin-bottom: 2rem;
    }

    #included-swines-container, #available-swines-container {
        padding: 2rem 0 1rem 0;
    }

    .checkbox-container, .included-swine-container {
        padding: 1rem 0 0 0;
    }

    #add-swine-btn-container {
        padding: 2rem 0 0 0;
    }
</style>
