<template lang="html">
    <div class="col s12">

        <div class="col s12">
            <div class="col s12">
                <h4 class="title-page"> View Registered Swine </h4>
            </div>
        </div>

        <div class="col s12">
            <!-- Switch -->
            <div class="switch right">
                <label>
                    <i class="material-icons left">view_module</i>
                    <input type="checkbox"
                        v-model="viewLayout"
                        v-bind:true-value="'list'"
                        v-bind:false-value="'card'"
                    >
                    <span class="lever"></span>
                    <i class="material-icons right">list</i>
                </label>
            </div>
        </div>

        <!-- Card Style -->
        <div id="card-layout-container">
            <div v-show="viewLayout === 'card'"
                v-for="(swine, index) in swines"
                class="col s4"
            >
                <div class="card">
                    <div class="card-image">
                        <img :src="swinePhotosDirectory + swine.photos[0].name" class="materialboxed">
                    </div>
                    <div class="card-content">
                        <span class="card-title">{{ swine.registration_no }}</span>
                        <p class="grey-text">
                            {{ swine.farm.name }}, {{ swine.farm.province }} <br> <br>
                            {{ swine.breed.title }} ({{ swine.swine_properties[0].value }})
                        </p>
                    </div>
                    <div class="card-action">
                        <a  @click.prevent="viewCertificate(index)"
                            href="#"
                            class=""
                        >
                            Certificate
                        </a>
                        <a @click.prevent="viewPhotos(index)"
                            href="#"
                            class="right"
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
                <li v-for="(swine, index) in swines"
                    class="collection-item avatar"
                >
                    <img :src="swinePhotosDirectory + swine.photos[0].name" alt="" class="circle materialboxed">
                    <span class="title">{{ swine.registration_no }}</span>
                    <p class="grey-text">
                        {{ swine.farm.name }}, {{ swine.farm.province }} <br>
                        {{ swine.breed.title }} ({{ swine.swine_properties[0].value }})
                    </p>
                    <div class="secondary-content">
                        <a @click.prevent="viewCertificate(index)"
                            href="#!"
                            class="btn-flat orange-text text-accent-2"
                        >
                            Certificate
                        </a>
                        <a @click.prevent="viewPhotos(index)"
                            href="#!"
                            class="btn-flat orange-text text-accent-2"
                        >
                            Photos
                        </a>
                    </div>
                </li>
            </ul>
        </div>

        <!-- View Certificate Modal -->
        <div id="view-certificate-modal" class="modal modal-fixed-footer">
            <div class="modal-content">
                <h4>Certificate <i class="material-icons right modal-close">close</i></h4>
                <div class="col s12">
                    <div class="card">
                        <div class="card-image">
                            <img :src="viewCertificateModal.imageSrc">
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat">Close</a>
            </div>
        </div>

        <!-- View Photos Modal -->
        <div id="view-photos-modal" class="modal bottom-sheet">
            <div class="modal-content">
                <h4>Photos <i class="material-icons right modal-close">close</i></h4>
                <div class="row">
                    <div v-for="photo in viewPhotosModal.photos"
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
        props: ['swines'],

        data() {
            return {
                swinePhotosDirectory: '/storage/images/swine/',
                certificatePhotosDirectory: '/storage/images/certificate/',
                viewLayout: 'card',
                viewCertificateModal: {
                    swineName: '',
                    imageSrc: ''
                },
                viewPhotosModal: {
                    photos: []
                }
            }
        },

        methods: {
            viewCertificate(index) {
                // Prepare needed data for modal
                this.viewCertificateModal.swineName = this.swines[index].registration_no;
                this.viewCertificateModal.imageSrc = this.certificatePhotosDirectory + this.swines[index].certificate.photos[0].name;

                $('#view-certificate-modal').modal('open');
            },

            viewPhotos(index) {
                // Prepare needed data for modal
                this.viewPhotosModal.photos = this.swines[index].photos;

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

    .switch label i {
        margin: 0;
    }

    .card-image {
        background-color: white;
    }

    .card-image img {
        margin: 0 auto;
    	width: auto;
    	padding: 0.5rem;
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
