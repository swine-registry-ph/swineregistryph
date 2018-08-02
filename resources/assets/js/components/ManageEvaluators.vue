<template>
    <div class="row">
        <div class="col s12">
            <h4 class="title-page"> Manage Evaluators </h4>
        </div>

        <div class="col s12">
            <ul class="collection with-header">
                <!-- Toggle add evaluator container button -->
                <li class="collection-header">
                    <a @click.prevent="showAddEvaluatorContainer = !showAddEvaluatorContainer"
                        href="#!"
                        id="toggle-add-evaluator-container-button"
                        class="btn-floating waves-effect waves-light tooltipped"
                        data-position="right"
                        data-delay="50"
                        data-tooltip="Add new evaluator"
                    >
                        <i class="material-icons right">add</i>
                    </a>
                </li>
                <!-- Add evaluator container -->
                <li v-show="showAddEvaluatorContainer" id="add-evaluator-container" class="collection-item">
                    <div class="row">
                        <div class="col s12">
                            <i @click.prevent="showAddEvaluatorContainer = !showAddEvaluatorContainer"
                                id="close-add-evaluator-container-button"
                                class="material-icons right"
                            >
                                close
                            </i>
                        </div>
                        <div class="input-field col s4 offset-s4">
                            <input v-model="addEvaluatorData.name"
                                id="add-name"
                                type="text"
                                class="validate"
                            >
                            <label for="add-name">Name</label>
                        </div>
                        <div class="input-field col s4 offset-s4">
                            <input v-model="addEvaluatorData.email"
                                id="add-email"
                                type="text"
                                class="validate"
                            >
                            <label for="add-email">Email</label>
                        </div>
                        <div class="col s4 offset-s4">
                            <a @click.prevent="addEvaluator($event)"
                                href="#!"
                                class="right btn z-depth-0 add-evaluator-btn"
                            >
                                Add Evaluator
                            </a>
                        </div>
                    </div>
                </li>
                <!-- Existing evaluators list -->
                <li v-for="(evaluator, index) in sortedEvaluators"
                    class="collection-item avatar"
                    :key="evaluator.userId"
                >
                    <span class="title"> <b>{{ evaluator.name }}</b> </span>
                    <p class="">
                        {{ evaluator.email }}
                    </p>
                    <span class="secondary-content">
                        <a @click.prevent="toggleEditEvaluatorModal(index)"
                            href="#"
                            class="btn custom-secondary-btn
                                edit-property-button
                                blue-text
                                text-darken-1
                                z-depth-0"
                        >
                            Edit
                        </a>

                        <a @click.prevent="toggleDeleteEvaluatorModal(index)"
                            href="#"
                            class="btn btn-flat delete-credentials-button custom-tertiary-btn"
                        >
                            Delete
                        </a>
                    </span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            initialEvaluators: Array
        },

        data() {
            return {
                evaluators: this.initialEvaluators,
                showAddEvaluatorContainer: false,
                addEvaluatorData: {
                    name: '',
                    email: ''
                }
            }
        },

        computed: {
            sortedEvaluators() {
                return _.sortBy(this.evaluators, ['name']);
            }
        },

        methods: {
            findEvaluatorIndexById(id) {
                for (let i = 0; i < this.evaluators.length; i++) {
                    if(this.evaluators[i].evaluatorId === id) return i;
                }

                return -1;
            },

            addEvaluator(event) {
                const vm = this;
                const addEvaluatorButton = $('.add-evaluator-btn');

                this.disableButtons(addEvaluatorButton, event.target, 'Adding...');

                // Add to server's database
                axios.post('/admin/manage/evaluators', {
                    name: vm.addEvaluatorData.name,
                    email: vm.addEvaluatorData.email
                })
                .then((response) => {
                    // Put response in local data storage and erase adding of evaluator data
                    vm.evaluators.push(response.data);
                    vm.addEvaluatorData = {
                        name: '',
                        email: ''
                    };

                    // Update UI after adding evaluator
                    vm.$nextTick(() => {
                        $('#add-name').removeClass('valid');
                        $('#add-email').removeClass('valid');
                        
                        this.enableButtons(addEvaluatorButton, event.target, 'Add Evaluator');

                        Materialize.updateTextFields();
                        Materialize.toast(`Evaluator ${response.data.name} added`, 3000, 'green lighten-1');
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
            },

            toggleEditEvaluatorModal() {

            },

            toggleDeleteEvaluatorModal() {

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
    .collection-header a, #close-add-evaluator-container-button {
        cursor: pointer;
    }

    .collection-item .row {
        margin-bottom: 0;
    }

    .collection-item.avatar {
        padding-left: 20px !important;
    }

    #add-evaluator-container {
        padding-bottom: 2rem;
    }

    .custom-secondary-btn {
        border: 1px solid;
        background-color: white;
    }

    .custom-tertiary-btn:hover {
        background-color: rgba(173, 173, 173, 0.3);
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
