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
                showAddEvaluatorContainer: false
            }
        },

        computed: {
            sortedEvaluators() {
                return _.sortBy(this.evaluators, ['name']);
            }
        },

        methods: {
            toggleEditEvaluatorModal() {

            },

            toggleDeleteEvaluatorModal() {

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
