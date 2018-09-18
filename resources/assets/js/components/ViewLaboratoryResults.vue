<template lang="html">
    <div class="col s10 offset-s1">

        <transition name="view-fade">
        <div v-show="!showEditLabResult">
            <div class="col s12">
                <h4 class="title-page"> View Laboratory Results </h4>
            </div>

            <div class="col s12">
                <p><br></p>
            </div>

            <div class="col s12">
                <!-- Search container -->
                <div class="col s8 offset-s2">
                    <nav id="search-container">
                        <div id="search-field" class="nav-wrapper white">
                            <div style="height:1px;"></div>
                            <form @submit.prevent="rewriteUrl(searchParameter)">
                                <div class="input-field">
                                    <input v-model="searchParameter"
                                        id="search" 
                                        name="q"
                                        type="search"
                                        placeholder="Type laboratory result no. and press enter to search" 
                                        autocomplete="off"
                                    >
                                    <label class="label-icon" for="search">
                                        <i class="material-icons teal-text">search</i>
                                    </label>
                                    <i class="material-icons">close</i>
                                </div>
                            </form>
                        </div>
                    </nav>
                </div>
            </div>

            <div class="col s12">
                <p><br></p>
            </div>

            <!-- List of Laboratory Results -->
            <div class="col s12">
                <table class="z-depth-1 striped white">
                    <thead>
                        <tr>
                            <th>General Information</th>
                            <th>Genetic Information</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(result, index) in paginatedLabResults"
                            :key="result.id"
                        >
                            <td>
                                <!-- General Information -->
                                <span class="title"><b>{{ result.labResultNo }}</b></span>
                                <p class="primary-details">
                                    {{ capitalizeFirstLetter(result.sex) }} • {{ result.animalId }}
                                </p>
                                <p class="secondary-details grey-text text-darken-2">
                                    <span>
                                        <i class="material-icons left tooltipped"
                                            data-position="top" 
                                            data-delay="50" 
                                            data-tooltip="Farm Name"
                                        >
                                            location_on
                                        </i> 
                                        {{ result.farm.name }}
                                    </span>
                                </p>
                                <p class="secondary-details grey-text text-darken-2">
                                    <span>
                                        <i class="material-icons left tooltipped"
                                            data-position="top" 
                                            data-delay="50" 
                                            data-tooltip="Date Submitted"
                                        >
                                            event_note
                                        </i> 
                                        {{ result.dateSubmitted }}
                                    </span>
                                </p>
                                <p class="secondary-details grey-text text-darken-2">
                                    <span>
                                        <i class="material-icons left tooltipped"
                                            data-position="top" 
                                            data-delay="50" 
                                            data-tooltip="Date of Result"
                                        >
                                            event_available
                                        </i> 
                                        {{ result.dateResult }}
                                    </span>
                                </p>
                            </td>
                            <td>
                                <p class="genetic-details">
                                    <!-- Fertility -->
                                    <span @click.prevent="showGeneticInformation(result.id, 'fertility')">
                                        <i v-show="!result.showTests.fertility" class="material-icons left">keyboard_arrow_down</i>
                                        <i v-show="result.showTests.fertility" class="material-icons left">keyboard_arrow_up</i>
                                        Fertility
                                    </span>
                                    <transition name="fade">
                                    <table v-show="result.showTests.fertility">
                                        <tbody>
                                            <tr>
                                                <td>ESR</td>
                                                <td><b>{{ (result.tests.esr) ? result.tests.esr : '---' }}</b></td>
                                            </tr>
                                            <tr>
                                                <td>PRLR</td>
                                                <td><b>{{ (result.tests.prlr) ? result.tests.prlr : '---' }}</b></td>
                                            </tr>
                                            <tr>
                                                <td>RBP4</td>
                                                <td><b>{{ (result.tests.rbp4) ? result.tests.rbp4 : '---' }}</b></td>
                                            </tr>
                                            <tr>
                                                <td>LIF</td>
                                                <td><b>{{ (result.tests.lif) ? result.tests.lif : '---'}}</b></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    </transition>
                                </p>
                                <p class="genetic-details">
                                    <!-- Meat Quality and Growth Rate -->
                                    <span @click.prevent="showGeneticInformation(result.id, 'meatAndGrowth')">
                                        <i v-show="!result.showTests.meatAndGrowth" class="material-icons left">keyboard_arrow_down</i>
                                        <i v-show="result.showTests.meatAndGrowth" class="material-icons left">keyboard_arrow_up</i>
                                        Meat Quality and Growth Rate
                                    </span>
                                    <transition name="fade">
                                    <table v-show="result.showTests.meatAndGrowth">
                                        <tbody>
                                            <tr>
                                                <td>HFABP</td>
                                                <td><b>{{ (result.tests.hfabp) ? result.tests.hfabp : '---' }}</b></td>
                                            </tr>
                                            <tr>
                                                <td>IGF2</td>
                                                <td><b>{{ (result.tests.igf2) ? result.tests.igf2 : '---' }}</b></td>
                                            </tr>
                                            <tr>
                                                <td>LEPR</td>
                                                <td><b>{{ (result.tests.lepr) ? result.tests.lepr : '---' }}</b></td>
                                            </tr>
                                            <tr>
                                                <td>MYOG</td>
                                                <td><b>{{ (result.tests.myog) ? result.tests.myog : '---' }}</b></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    </transition>
                                </p>
                                <p class="genetic-details">
                                    <!-- Genetic Defects -->
                                    <span @click.prevent="showGeneticInformation(result.id, 'defects')">
                                        <i v-show="!result.showTests.defects" class="material-icons left">keyboard_arrow_down</i>
                                        <i v-show="result.showTests.defects" class="material-icons left">keyboard_arrow_up</i>
                                        Genetic Defects
                                    </span>
                                    <transition name="fade">
                                    <table v-show="result.showTests.defects">
                                        <tbody>
                                            <tr>
                                                <td>PSS</td>
                                                <td><b>{{ (result.tests.pss) ? result.tests.pss : '---' }}</b></td>
                                            </tr>
                                            <tr>
                                                <td>RN</td>
                                                <td><b>{{ (result.tests.rn) ? result.tests.rn : '---' }}</b></td>
                                            </tr>
                                            <tr>
                                                <td>BAX</td>
                                                <td><b>{{ (result.tests.bax) ? result.tests.bax : '---' }}</b></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    </transition>
                                </p>
                                <p class="genetic-details">
                                    <!-- Diseases Resistance -->
                                    <span @click.prevent="showGeneticInformation(result.id, 'diseases')">
                                        <i v-show="!result.showTests.diseases" class="material-icons left">keyboard_arrow_down</i>
                                        <i v-show="result.showTests.diseases" class="material-icons left">keyboard_arrow_up</i>
                                        Diseases Resistance
                                    </span>
                                    <transition name="fade">
                                    <table v-show="result.showTests.diseases">
                                        <tbody>
                                            <tr>
                                                <td>FUT1</td>
                                                <td><b>{{ (result.tests.fut1) ? result.tests.fut1 : '---' }}</b></td>
                                            </tr>
                                            <tr>
                                                <td>MX1</td>
                                                <td><b>{{ (result.tests.mx1) ? result.tests.mx1 : '---' }}</b></td>
                                            </tr>
                                            <tr>
                                                <td>NRAMP</td>
                                                <td><b>{{ (result.tests.nramp) ? result.tests.nramp : '---' }}</b></td>
                                            </tr>
                                            <tr>
                                                <td>BPI</td>
                                                <td><b>{{ (result.tests.bpi) ? result.tests.bpi : '---' }}</b></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    </transition>
                                </p>
                            </td>
                            <td>
                                <!-- Action -->
                                <a @click.prevent="showEditLabResultsView(result.id)"
                                    href="#!"
                                    class="btn blue darken-1 z-depth-0"
                                >
                                    Edit
                                </a> <br> <br>
                                <a :href="`/genomics/pdf-lab-results/${result.id}`"
                                    target="_blank"
                                    class="btn custom-secondary-btn blue-text text-darken-1 z-depth-0"
                                >
                                    View PDF
                                </a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

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
        </transition>

        <!-- Edit Laboratory Result View -->
        <transition name="edit-fade">
            <view-laboratory-results-update-view
                v-show="showEditLabResult"
                v-on:hideEditLabResultsViewEvent="showEditLabResult = false"
                v-on:updateLabResultEvent="updateLabResult"
                :edit-lab-result-data="editLabResultData"
                :farmoptions="farmoptions"
            >
            </view-laboratory-results-update-view>
        </transition>

    </div>
</template>

<script>
    import ViewLaboratoryResultsUpdateView from './ViewLaboratoryResultsUpdateView.vue';

    export default {
        props: {
            customLabResults: Array,
            currentSearchParameter: String,
            farmoptions: Array,
            viewUrl: String
        },

        components: {
            ViewLaboratoryResultsUpdateView
        },

        data() {
            return {
                searchParameter: this.currentSearchParameter,
                pageNumber: 0,
                paginationSize: 6,
                showEditLabResult: false,
                labResults: this.customLabResults,
                editLabResultData: {}
            }
        },

        computed: {
            pageCount() {
                let l = this.labResults.length;
                let s = this.paginationSize;

                return Math.ceil(l/s);
            },
            
            paginatedLabResults() {
                const start = this.pageNumber * this.paginationSize;
                const end = start + this.paginationSize;

                return this.labResults.slice(start, end);
            }
        },

        methods: {
            findLabResultIndexById(id) {
                for (let i = 0; i < this.labResults.length; i++) {
                    if(this.labResults[i].id === id) return i;
                }

                return -1;
            },

            previousPage() {
                // For pagination
                if(this.pageNumber !== 0) this.pageNumber--;
            },

            nextPage() {
                // For pagination
                if(this.pageNumber < this.pageCount -1) this.pageNumber++;
            },

            goToPage(page) {
                // For pagination
                this.pageNumber = page - 1;
            },

            rewriteUrl(searchParameter) {
                /**
                 *  URL rewrite syntax: ?q=value
                 */
                let url = this.viewUrl;
                let parameters = [];

                // Put search parameter in parameters if it is non-empty
                if(searchParameter.length > 0){
                    let qParameter = `q=${searchParameter}`;

                    parameters.push(qParameter);
                }

                // Redirect to new url
                if(parameters.length > 0) window.location = url + '?' + parameters.join('&');
                else window.location = url;
            },

            capitalizeFirstLetter(string) {
                return _.capitalize(string);
            },

            showGeneticInformation(id, category) {
                const index = this.findLabResultIndexById(id);

                let booleanValue = this.paginatedLabResults[index]['showTests'][category];
                this.paginatedLabResults[index]['showTests'][category] = !booleanValue;
            },

            showEditLabResultsView(id) {
                const index = this.findLabResultIndexById(id);
                const labResult = this.labResults[index];

                // Customize lab result data
                this.editLabResultData = {
                    index: index,
                    laboratoryResultId: labResult.id,
                    laboratoryResultNo: labResult.labResultNo,
                    animalId: labResult.animalId,
                    sex: labResult.sex,
                    farmId: (labResult.farm.id) ? (labResult.farm.id).toString() : '',
                    farmName: (labResult.farm.id) ? '' : labResult.farm.name,
                    dateResult: labResult.dateResult,
                    dateSubmitted: labResult.dateSubmitted,
                    tests: labResult.tests
                }

                this.showEditLabResult = true;

                this.$nextTick(() => {
                    // Make sure UI is clean
                    $('#lab-result-no').removeClass('valid');
                    $('#animal-id').removeClass('valid');
                    $('#farm-name').removeClass('valid');
                });
            },

            updateLabResult({labResult}) {
                const updatedLabResult = this.labResults[labResult.index];

                // Update local data storage
                updatedLabResult.labResultNo = labResult.laboratoryResultNo;
                updatedLabResult.animalId = labResult.animalId;
                updatedLabResult.sex = labResult.sex;
                updatedLabResult.dateResult = labResult.dateResult;
                updatedLabResult.dateSubmitted = labResult.dateSubmitted;
                updatedLabResult.tests = labResult.tests;

                // Check if farm is registered or not
                if(labResult.farmId){
                    updatedLabResult.farm.id = labResult.farmId;
                    updatedLabResult.farm.registered = true;
                    updatedLabResult.farm.name = labResult.farmName;
                }
                else {
                    updatedLabResult.farm.id = null;
                    updatedLabResult.farm.registered = false;
                    updatedLabResult.farm.name = labResult.farmName;
                }
            }

        }
    }
</script>

<style scoped>
    .custom-secondary-btn {
        border: 1px solid;
        background-color: white !important;
    }

    span.title {
        font-size: 20px !important;
    }

    p.primary-details {
        margin: 0;
        padding-bottom: 1rem;
    }

    p.secondary-details {
        margin: 0;
        padding-bottom: 0.7rem;
        padding-left: 2rem;
    }

    p.genetic-details > span {
        cursor: pointer;
    }

    /* Table styles */
    table.striped > tbody > tr:nth-child(odd) {
        background-color: #f5f5f5;
    }

    td, th {
        padding-left: 1rem;
    }

    .genetic-details table {
        margin-top: 0.5rem;
        margin-left: 2rem;
    }

    .genetic-details table td {
        padding-top: 0;
        padding-right: 0;
        padding-bottom: 0;
        padding-left: 1rem;
    }

    .genetic-details table tr td:first-child {
        width: 5rem;
    }

    /* Fade animations */
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }

    .view-fade-enter-active {
        transition: opacity .5s;
    }

    .view-fade-leave-active {
        transition: opacity .15s;
    }

    .edit-fade-enter-active {
        transition: opacity 1.5s;
    }

    .edit-fade-leave-active {
        transition: opacity .5s;
    }

    /* .fade-leave-active below version 2.1.8 */
    .fade-enter, .fade-leave-to,
    .view-fade-enter, .view-fade-leave-to,
    .edit-fade-enter, .edit-fade-leave-to {
        opacity: 0;
    }


    /* Search component overrides */
    .input-field label[for='search'] {
        font-size: inherit;
        -webkit-transform: none;
        -moz-transform: none;
        -ms-transform: none;
        -o-transform: none;
        transform: none;
    }

    input#search {
        color: black;
    }
</style>
