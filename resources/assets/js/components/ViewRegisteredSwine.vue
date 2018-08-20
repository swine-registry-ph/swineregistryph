<template lang="html">
    <div class="col s12">

        <div class="col s12">
            <h4 class="title-page"> View Registered Swine </h4>
        </div>

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
                        <img :src="swinePhotosDirectory + swine.photos[0].name" class="materialboxed">
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
                            <!-- <a :href="`/breeder/registry-certificate/${swine.id}`"
                                target="_blank"
                                class="btn blue darken-1 z-depth-0"
                            >
                                View Certificate
                            </a> <br><br>
                            <a @click.prevent="viewPhotos(index)"
                                href="#"
                                class="btn custom-secondary-btn blue-text text-darken-1 z-depth-0"
                            >
                                View Photos
                            </a> -->
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
                    <img :src="swinePhotosDirectory + swine.photos[0].name" alt="" class="circle materialboxed">
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
            swines: Array
        },

        data() {
            return {
                swinePhotosDirectory: '/storage/images/swine/',
                viewLayout: 'card',
                pageNumber: 0,
                paginationSize: 15,
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
