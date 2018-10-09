<template lang="html">
    <div class="col s10 offset-s1">

        <div class="col s12">
            <h4 class="title-page"> Inspection Requests </h4>
        </div>

        <div class="col s4 m3 l2">
            <ul class="collapsible" data-collapsible="expandable">
                <li>
                    <!-- Status filter -->
                    <div class="collapsible-header active"><b>Status</b></div>
                    <div class="collapsible-body">
                        <p class="range-field">
                            <template v-for="status in statuses">
                                <input v-model="filterOptions.status"
                                    type="checkbox" 
                                    class="filled-in" 
                                    :value="status.value" 
                                    :id="status.value"
                                />
                                <label :for="status.value"> {{status.text}} </label> <br>
                            </template>
                        </p>
                    </div>
                </li>
            </ul>
        </div>

        <div class="col s8 m9 l10">
            <ul class="collection with-header">
                <!-- Toggle add inspection request container button -->
                <li class="collection-header">
                    <a @click.prevent="showAddRequestInput = !showAddRequestInput"
                        href="#!"
                        id="toggle-add-request-container-button"
                        class="btn-floating waves-effect waves-light tooltipped"
                        data-position="right"
                        data-delay="50"
                        data-tooltip="Add new inspection request"
                    >
                        <i class="material-icons right">add</i>
                    </a>
                </li>
                <!-- Add inspection request container -->
                <li v-show="showAddRequestInput" id="add-request-container" class="collection-item">
                    <div class="row">
                        <div class="col s12">
                            <i @click.prevent="showAddRequestInput = !showAddRequestInput"
                                id="close-add-request-container-button"
                                class="material-icons right"
                            >
                                close
                            </i>
                        </div>
                        <div class="input-field col s4 offset-s4">
                             <app-input-select
                                labelDescription="Farm"
                                v-model="addRequestData.farmId"
                                :options="farmOptions"
                                @select="val => {addRequestData.farmId = val}"
                            >
                            </app-input-select>
                        </div>
                        <div class="col s4 offset-s4">
                            <a @click.prevent="addInspectionRequest($event)"
                                href="#!"
                                class="right btn z-depth-0 add-request-button"
                            >
                                Add Inspection Request
                            </a>
                        </div>
                    </div>
                </li>
                <!-- Existing Inspection Requests container -->
                <li v-for="(request, index) in paginatedRequests" 
                    class="collection-item avatar"
                    :key="request.id"
                >
                    <span>
                        <b>Request ID : {{ request.id }}</b> <br>
                        <template v-if="request.status === 'draft'">
                            <span><b>(Draft)</b></span>
                        </template>
                        <template v-if="request.status === 'requested'">
                            <span>
                                <b>(Requested)</b> <br>
                                {{ request.dateRequested }}
                            </span>
                        </template>
                        <template v-if="request.status === 'for_inspection'">
                            <span>
                                <b>(For Inspection)</b> <br>
                                {{ request.dateInspection }}
                            </span>
                        </template>
                        <template v-if="request.status === 'approved'">
                            <span>
                                <b>(Approved)</b> <br>
                                {{ request.dateApproved }}
                            </span>
                        </template> <br> <br>
                        <span class="grey-text text-darken-1">
                            <i class="material-icons left">location_on</i>
                            {{ request.farmName }}
                        </span>
                    </span>
                    <span v-if="request.status === 'draft'" 
                        class="secondary-content"
                    >
                        <a @click.prevent=""
                            href="#"
                            class="btn
                                add-swine-button
                                blue darken-1
                                z-depth-0"
                        >
                            Add Swine
                        </a>
                        <a @click.prevent=""
                            href="#"
                            class="btn btn-flat 
                                blue-text
                                text-darken-1 
                                custom-secondary-btn"
                        >
                            Request for Inspection
                        </a>
                    </span>
                    <span v-else
                        class="secondary-content"
                    >
                        <a @click.prevent=""
                            href="#"
                            class="btn
                                add-swine-button
                                blue darken-1
                                z-depth-0"
                        >
                            View Swine
                        </a>
                    </span>
                </li>
                <!-- Empty Inspection Requests container -->
                <li v-show="paginatedRequests.length === 0"
                    class="collection-item avatar center-align"
                >
                    <p>
                        <b>Sorry, no request inspections found.</b>
                    </p>
                </li>
            </ul>

            <!-- Pagination -->
            <div class="col s12 center-align pagination-container">
                <ul class="pagination">
                    <li :class="(pageNumber === 0) ? 'disabled' : 'waves-effect'">
                        <a @click.prevent="previousPage()">
                            <i class="material-icons">chevron_left</i>
                        </a>
                    </li>
                    <li v-for="i in pageCount"
                        class="waves-effect"
                        :class="(i === pageNumber + 1) ? 'active' : 'waves-effect'"
                    >
                        <a @click.prevent="goToPage(i)"> {{ i }} </a>
                    </li>
                    <li :class="(pageNumber >= pageCount - 1) ? 'disabled' : 'waves-effect'">
                        <a @click.prevent="nextPage()">
                            <i class="material-icons">chevron_right</i>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
  
    </div>
</template>

<script>
    export default {
        props: {
            user: Object,
            currentFilterOptions: Object,
            customInspectionRequests: Array,
            farmOptions: Array,
            viewUrl: String
        },

        data() {
            return {
                showAddRequestInput: false,
                pageNumber: 0,
                paginationSize: 15,
                filterOptions: this.currentFilterOptions,
                inspectionRequests: this.customInspectionRequests,
                statuses: [
                    {
                        text: 'Draft',
                        value: 'draft'
                    },
                    {
                        text: 'Requested',
                        value: 'requested'
                    },
                    {
                        text: 'For Inspection',
                        value: 'for_inspection'
                    },
                    {
                        text: 'Approved',
                        value: 'approved'
                    }
                ],
                addRequestData: {
                    breederId: this.user.id,
                    farmId: ''
                }
            }
        },

        computed: {
            pageCount() {
                let l = this.inspectionRequests.length;
                let s = this.paginationSize;

                return Math.ceil(l/s);
            },

            paginatedRequests() {
                const start = this.pageNumber * this.paginationSize;
                const end = start + this.paginationSize;

                return _.sortBy(this.inspectionRequests, ['id']).slice(start, end);
            }
        },

        watch: {
            filterOptions: {
                handler: function(oldValue, newValue) {
                    // Watch filterOptions object for url rewrite
                    this.rewriteUrl(newValue, '');
                },
                deep: true
            }
        },

        methods: {
            previousPage() {
                if(this.pageNumber !== 0) this.pageNumber--;
            },

            nextPage() {
                if(this.pageNumber < this.pageCount -1) this.pageNumber++;
            },

            goToPage(page) {
                this.pageNumber = page - 1;
            },

            rewriteUrl(filterOptions, searchParameter) {
                /**
                 *  URL rewrite syntax: 
                 *  ?q=value*
                 *  &status=value[+value]*
                 */
                let url = this.viewUrl;
                let parameters = [];

                // Put search parameter in parameters if it is non-empty
                if(searchParameter.length > 0){
                    let qParameter = `q=${searchParameter}`;

                    parameters.push(qParameter);
                }

                // Put status parameter in parameters if filter is chosen
                if(filterOptions.status.length > 0){
                    let statusParameter = 'status=';
                    statusParameter += filterOptions.status.join('+');

                    parameters.push(statusParameter);
                }

                // Redirect to new url
                if(parameters.length > 0) window.location = url + '?' + parameters.join('&');
                else window.location = url;
            },

            addInspectionRequest(event) {
                const vm = this;
                const addInspectionRequestBtn = $('.add-request-button');

                this.disableButtons(addInspectionRequestBtn, event.target, 'Adding...');

                // Add to server's database
                axios.post('/breeder/inspections', {
                    breederId: vm.addRequestData.breederId,
                    farmId: vm.addRequestData.farmId
                })
                .then((response) => {
                    // Put response in local data storage and erase adding of request data
                    vm.inspectionRequests.push(response.data);
                    vm.addRequestData.farmId = '';

                    // Update UI after adding inspection request
                    vm.$nextTick(() => {
                        this.enableButtons(addInspectionRequestBtn, event.target, 'Add Inspection Request');

                        Materialize.updateTextFields();
                        Materialize.toast('Inspection request added', 2000, 'green lighten-1');
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

<style scoped lang="css">
    .add-swine-button {
        margin-right: .5rem;
    }

    #add-request-container .input-field {
        margin-top: 2rem;
        margin-bottom: 2rem;
    }

    #close-add-request-container-button {
        cursor: pointer;
    }

    .custom-secondary-btn {
        border: 1px solid;
        background-color: white;
    }

    .custom-tertiary-btn:hover {
        background-color: rgba(173, 173, 173, 0.3);
    }

    /* Collection customizations */
    .collection-item.avatar {
        padding-left: 20px !important;
        padding-bottom: 1.5rem;
    }

    /* Collapsible customizations */
    div.collapsible-body {
        background-color: rgba(255, 255, 255, 0.7);
    }

    p.range-field {
        margin: 0;
    }

    p.range-field label {
        color: black;
    }

</style>
