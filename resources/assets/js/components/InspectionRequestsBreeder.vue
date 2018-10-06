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
                    <a @click.prevent="toggleAddRequestContainer()"
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
                <!-- Existing Inspection Requests container -->
                <li v-for="(request, index) in paginatedRequests" 
                    class="collection-item avatar"
                    :key=""
                >
                    <span>
                        <b>Request ID : {{ request.id }}</b> 
                        <i class="material-icons"></i> <br>
                        {{ request.farmName }} <br>
                        <template v-if="request.status === 'draft'">
                            <span>Draft</span>
                        </template>
                        <template v-if="request.status === 'requested'">
                            <span>Requested</span>
                        </template>
                        <template v-if="request.status === 'for_inspection'">
                            <span>For Inspection</span>
                        </template>
                        <template v-if="request.status === 'approved'">
                            <span>Approved</span>
                        </template>
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
                    <span v-if="request.status === 'requested'"
                        class="secondary-content"
                    >
                        {{ request.dateRequested }}
                    </span>
                    <span v-if="request.status === 'for_inspection'"
                        class="secondary-content"
                    >
                        {{ request.dateInspection }}
                    </span>
                </li>
                <!-- Empty Inspection Requests container -->
                <li v-show="paginatedRequests.length === 0">
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
            currentFilterOptions: Object,
            inspectionRequests: Array,
            viewUrl: String
        },

        data() {
            return {
                pageNumber: 0,
                paginationSize: 15,
                filterOptions: this.currentFilterOptions,
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
                ]
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

        }
    }
</script>

<style scoped lang="css">
    .add-swine-button {
        margin-right: .5rem;
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
