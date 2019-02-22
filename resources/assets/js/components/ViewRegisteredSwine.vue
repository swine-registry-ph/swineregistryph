<template lang="html">
    <div class="col s12">

        <div class="col s12">
            <h4 class="title-page"> View Registered Swine </h4>
        </div>

        <div class="col s12">
            <p><br></p>
        </div>

        <div class="col s4 m3 l2">
            <ul class="collapsible" data-collapsible="expandable">
                <li>
                    <!-- Breed filter -->
                    <div class="collapsible-header active"><b>Breed</b></div>
                    <div class="collapsible-body">
                        <p class="range-field">
                            <template v-for="breed in breeds">
                                <input v-model="filterOptions.breed"
                                    type="checkbox" 
                                    class="filled-in" 
                                    :value="breed.value" 
                                    :id="breed.text"
                                />
                                <label :for="breed.text"> {{breed.text}} </label> <br>
                            </template>
                        </p>
                    </div>
                </li>
                <li>
                    <!-- Sex filter -->
                    <div class="collapsible-header active"><b>Sex</b></div>
                    <div class="collapsible-body">
                        <p class="range-field">
                            <input v-model="filterOptions.sex"
                                type="checkbox" 
                                class="filled-in" 
                                id="male" 
                                value="male"
                            />
                            <label for="male">Male</label> <br>

                            <input v-model="filterOptions.sex"
                                type="checkbox" 
                                class="filled-in" 
                                id="female" 
                                value="female"
                            />
                            <label for="female">Female</label>
                        </p>
                    </div>
                </li>
                <li>
                    <!-- Farm filter -->
                    <div class="collapsible-header active"><b>Farm</b></div>
                    <div class="collapsible-body">
                        <p class="range-field">
                            <template v-for="farm in farmoptions">
                                <div>
                                    <input v-model="filterOptions.farm"
                                        type="checkbox" 
                                        class="filled-in" 
                                        :value="farm.value" 
                                        :id="farm.text"
                                    />
                                    <label :for="farm.text"> {{farm.text}} </label>
                                </div>
                            </template>
                        </p>
                    </div>
                </li>
                <li>
                    <!-- SwineCart filter -->
                    <div class="collapsible-header active"><b>SwineCart</b></div>
                    <div class="collapsible-body">
                        <p class="range-field">
                            <input v-model="filterOptions.sc" 
                                true-value="1"
                                false-value="0"
                                type="checkbox" 
                                class="filled-in" 
                                id="swinecart"
                            />
                            <label for="swinecart">Included in SwineCart</label>
                        </p>
                    </div>
                </li>
            </ul>
        </div>

        <div class="col s8 m9 l10">
            <!-- Search container -->
            <div class="col s8 offset-s2">
                <nav id="search-container">
                    <div id="search-field" class="nav-wrapper white">
                        <div style="height:1px;"></div>
                        <form @submit.prevent="rewriteUrl(filterOptions, searchParameter)">
                            <div class="input-field">
                                <input v-model="searchParameter"
                                    id="search" 
                                    name="q"
                                    type="search"
                                    placeholder="Type swine registration no. and press enter to search" 
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

            <!-- Layout Options Container -->
            <div id="options-container" class="col s12">
                <div class="left">
                    <span id="view-label">
                        VIEW
                    </span>
                </div>
                <div id="view-icons-container" class="left">
                    <i @click.prevent="viewLayout = 'card'"
                        class="material-icons tooltipped"
                        :class="viewLayout === 'card' ? 'blue-text' : 'grey-text'"
                        data-position="top" 
                        data-delay="50" 
                        data-tooltip="Card"
                    >
                        view_module
                    </i>
                    <i @click.prevent="viewLayout = 'list'"
                        class="material-icons tooltipped"
                        :class="viewLayout === 'list' ? 'blue-text' : 'grey-text'"
                        data-position="top" 
                        data-delay="50" 
                        data-tooltip="List"
                    >
                        view_list
                    </i>
                </div>
            </div>

            <!-- Card Style -->
            <div id="card-layout-container">
                <div v-show="viewLayout === 'card'"
                    v-for="(swine, index) in paginatedSwines"
                    :key="swine.id"
                    class="col s12 m6 l4"
                >
                    <div class="card">
                        <div class="card-image">
                            <img v-if="swine.photos.length > 0"
                                :src="swinePhotosDirectory + swine.photos[0].name" 
                                class="materialboxed"
                            >
                            <img v-else
                                :src="swinePhotosDirectory + 'default.png'" 
                                alt="No swine photo found."
                                class="materialboxed"
                            >
                            <a v-if="swine.swinecart"
                                class="btn-floating halfway-fab red lighten-1 tooltipped"
                                data-position="top" 
                                data-delay="50" 
                                data-tooltip="Included in SwineCart"
                            >
                                <i class="material-icons">shopping_cart</i>
                            </a>
                        </div>
                        <div class="card-content">
                            <span class="card-title flow-text"><b>{{ swine.registration_no }}</b></span>
                            <p class="">
                                {{ swine.farm.name }}, {{ swine.farm.province }} <br>
                                {{ swine.breed.title }} ({{ swine.swine_properties[0].value }})
                            </p>
                        </div>
                        <div class="card-action">
                            <a :href="`/breeder/registry-certificate/${swine.id}`"
                                target="_blank"
                                class="btn blue darken-1 z-depth-0"
                            >
                                Certificate
                            </a>
                            <a @click.prevent="viewPhotos(swine.id)"
                                href="#"
                                class="btn custom-secondary-btn blue-text text-darken-1 z-depth-0"
                            >
                                Photos
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- List Style -->
            <div v-show="viewLayout === 'list'"
                id="list-layout-container"
                class="col s12"
            >
                <ul class="collection">
                    <li v-for="(swine, index) in paginatedSwines"
                        :key="swine.id"
                        class="collection-item avatar"
                    >
                        <img v-if="swine.photos.length > 0" 
                            :src="swinePhotosDirectory + swine.photos[0].name" 
                            alt="" 
                            class="circle materialboxed"
                        >
                        <img v-else 
                            :src="swinePhotosDirectory + 'default.png'" 
                            alt="No swine photo found." 
                            class="circle materialboxed"
                        >
                        <span class="title"><b>{{ swine.registration_no }}</b></span>
                        <p class="">
                            {{ swine.farm.name }}, {{ swine.farm.province }} <br>
                            {{ swine.breed.title }} ({{ swine.swine_properties[0].value }})
                        </p>
                        <div class="secondary-content">
                            <a v-if="swine.swinecart"
                                id="list-swinecart-icon"
                                class="btn-floating red lighten-1 z-depth-0 tooltipped"
                                data-position="top" 
                                data-delay="50" 
                                data-tooltip="Included in SwineCart"
                            >
                                <i class="material-icons">shopping_cart</i>
                            </a>
                            <a :href="`/breeder/registry-certificate/${swine.id}`"
                                target="_blank"
                                class="btn blue darken-1 z-depth-0"
                            >
                                Certificate
                            </a>
                            <a @click.prevent="viewPhotos(swine.id)"
                                href="#!"
                                class="btn custom-secondary-btn blue-text text-darken-1 z-depth-0"
                            >
                                Photos
                            </a>
                        </div>
                    </li>
                </ul>
            </div>

            <!-- Empty Swine Container -->
            <div v-show="paginatedSwines.length === 0" 
                id="empty-swine-container" 
                class="col s12 center-align"
            >
                <p>
                    <b>Sorry, no swine found.</b>
                </p>
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

        <!-- View Photos Modal -->
        <div id="view-photos-modal" class="modal bottom-sheet">
            <div class="modal-content">
                <h5>
                    <b>{{ viewPhotosModal.registrationNo }}</b> &nbsp; / &nbsp; Photos
                    <i class="material-icons right modal-close">close</i>
                </h5>
                <div class="row">
                    <div v-for="photo in viewPhotosModal.photos"
                        :key="photo.id"
                        class="col s4"
                    >
                        <div class="card">
                            <div class="card-image">
                                <img :src="swinePhotosDirectory + photo.name">
                            </div>
                        </div>
                    </div>

                    <div v-show="viewPhotosModal.photos.length === 0" class="col s4">
                        <p> Sorry, no photos available </p>
                    </div>

                </div>
            </div>
            <div class="modal-footer">
                <a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat">Close</a>
            </div>
        </div>


    </div>
</template>

<script>
    export default {
        props: {
            breeds: Array,
            currentFilterOptions: Object,
            farmoptions: Array,
            currentSearchParameter: String,
            swines: Array,
            viewUrl: String
        },

        data() {
            return {
                swinePhotosDirectory: '/storage/images/swine/',
                viewLayout: 'card',
                pageNumber: 0,
                paginationSize: 15,
                filterOptions: this.currentFilterOptions,
                searchParameter: this.currentSearchParameter,
                viewPhotosModal: {
                    registrationNo: '',
                    photos: []
                }
            }
        },

        computed: {
            pageCount() {
                let l = this.swines.length;
                let s = this.paginationSize;

                return Math.ceil(l/s);
            },

            paginatedSwines() {
                const start = this.pageNumber * this.paginationSize;
                const end = start + this.paginationSize;

                return _.sortBy(this.swines, ['registration_no']).slice(start, end);
            }
        },

        watch: {
            filterOptions: {
                handler: function(oldValue, newValue) {
                    // Watch filterOptions object for url rewrite
                    this.rewriteUrl(newValue, this.searchParameter);
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

            getIndex(id, arrayToBeSearched) {
                // Return index of object to find
                for(var i = 0; i < arrayToBeSearched.length; i++) {
                    if(arrayToBeSearched[i].id === id) return i;
                }
            },

            rewriteUrl(filterOptions, searchParameter) {
                /**
                 *  URL rewrite syntax: 
                 *  ?q=value*
                 *  &breed=value[+value]*
                 *  &sex=value[+value]
                 *  &farm=value[+value]*
                 *  &sc=[0|1]
                 */
                let url = this.viewUrl;
                let parameters = [];

                // Put search parameter in parameters if it is non-empty
                if(searchParameter.length > 0){
                    let qParameter = `q=${searchParameter}`;

                    parameters.push(qParameter);
                }

                // Put breed parameter in parameters if filter is chosen
                if(filterOptions.breed.length > 0){
                    let breedParameter = 'breed=';
                    breedParameter += filterOptions.breed.join('+');

                    parameters.push(breedParameter);
                }

                // Put sex parameter in parameters if filter is chosen
                if(filterOptions.sex.length > 0){
                    let sexParameter = 'sex=';
                    sexParameter += filterOptions.sex.join('+');

                    parameters.push(sexParameter);
                }

                // Put farm parameter in parameters if filter is chosen
                if(filterOptions.farm.length > 0){
                    let farmParameter = 'farm=';
                    farmParameter += filterOptions.farm.join('+');

                    parameters.push(farmParameter);
                }

                // Put swineCart parameter in parameters if filter is chosen
                if(filterOptions.sc){
                    let swineCartParameter = `sc=${filterOptions.sc}`;

                    parameters.push(swineCartParameter);
                }

                // Redirect to new url
                if(parameters.length > 0) window.location = url + '?' + parameters.join('&');
                else window.location = url;
            },

            viewPhotos(swineId) {
                // Prepare needed data for modal
                const index = this.getIndex(swineId, this.swines);
                const swine = this.swines[index];

                this.viewPhotosModal.registrationNo = swine.registration_no;
                this.viewPhotosModal.photos = swine.photos;

                $('#view-photos-modal').modal('open');
            }
        },

        mounted() {
            // Materialize component initializations
            $('.modal').modal();
        }
    }
</script>

<style lang="css">
    div#options-container {
        margin-top: 2rem;
        margin-bottom: 1rem;
    }

    div#view-icons-container {
        cursor: pointer;
    }

    div#empty-swine-container {
        padding-top: 1rem;
        padding-bottom: 1rem;
    }

    span#view-label {
        margin-right: 1rem;
    }

    .custom-secondary-btn {
        border: 1px solid;
        background-color: white !important;
    }

    a#list-swinecart-icon {
        margin-right: 2rem;
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

    /* Card customizations */
    .card-image {
        background-color: white;
    }

    .card-image img {
        margin: 0 auto;
    	width: auto;
    	padding: 0.5rem;
    }

    .card-action a {
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
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

    /* Medium Screen */
    @media only screen and (min-width: 601px){
        /* Image resize */
        #card-layout-container .card-image img {
            height: 160px;
        }
    }

    /* Large Screen */
    @media only screen and (min-width: 993px){
        /* Image resize */
        #card-layout-container .card-image img {
            height: 168px;
        }
    }

    /* Extra Large Screen */
    @media only screen and (min-width: 1100px){
        /* Image resize */
        #card-layout-container .card-image img {
            height: 180px;
        }
    }

    /* Super Extra Large Screen */
    @media only screen and (min-width: 1560px){
        /* Image resize */
        #card-layout-container .card-image img {
            height: 210px;
        }
    }

    /* Super Super Extra Large Screen */
    @media only screen and (min-width: 1560px){
        /* Image resize */
        #card-layout-container .card-image img {
            height: 270px;
        }
    }
</style>
