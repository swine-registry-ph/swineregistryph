<template>
    <!-- Dropzone -->
    <dropzone :id="dropzoneId"
        :ref="dropzoneId"
        :url="uploadurl"
        :headers="csrfHeader"
        :use-custom-dropzone-options="true"
        :dropzone-options="customOptions"
        v-on:vdropzone-success="renameFile"
        v-on:vdropzone-removed-file="removeFile"
    >
        <!-- Optional parameters if any! -->
        <input type="hidden" name="swineId" :value="swineId">
        <input type="hidden" name="orientation" :value="orientation">
        <input type="hidden" name="token" :value="csrfToken">
    </dropzone>
    
</template>

<script>
    import Dropzone from 'vue2-dropzone';

    export default {
        props: {
            dropzoneId: String,
            orientation: String,
            swineId: Number,
            uploadurl: String
        },

        components: {
            Dropzone
        },

        data() {
            return {
                customOptions: {
                    language: {
                        dictDefaultMessage: '<br/> Drop image here to upload'
                    },
                    parallelUploads: 1,
                    maxNumberOfFiles: 1,
                    maxFileSizeInMB: 50,
                    acceptedFileTypes: 'image/png, image/jpeg, image/jpg, image/tiff, image/heif, image/heic'
                }
            }
        },

        computed: {
            csrfToken() {
                return document.head.querySelector('meta[name="csrf-token"]').content;
            },
            csrfHeader() {
                return {
                    'X-CSRF-TOKEN': document.head.querySelector('meta[name="csrf-token"]').content
                };
            }
        },

        methods: {
            renameFile(file, response) {
                let previewElement = file.previewElement;
                let imageDetails = response;

                // setAttribute is for photo id purposes. Chose not to put it
                // into vue local data storage for ease of use in
                // fetching id upon removal of file
                previewElement.setAttribute('data-photo-id', imageDetails.id);
                previewElement.getElementsByClassName('dz-filename')[0].getElementsByTagName('span')[0].innerHTML = imageDetails.name;

                // Trigger addedPhotoEvent
                this.$emit('addedPhotoEvent', 
                    {
                        data: imageDetails,
                        orientation: this.orientation
                    }
                );
            },

            removeFile(file, error, xhr) {
                const photoId = file.previewElement.getAttribute('data-photo-id');

                axios.delete(`/breeder/manage-swine/photo/${photoId}/orientation/${this.orientation}`)
                    .then((response) => { })
                    .catch((error) => { console.log(error); });

                // Trigger removedPhotoEvent
                this.$emit('removedPhotoEvent', 
                    {
                        orientation: this.orientation
                    }
                );

            },

            template() {
                return `
                    <div class="dz-preview dz-file-preview">
                        <div class="dz-image" style="width: 200px;height: 200px">
                            <img data-dz-thumbnail />
                        </div>
                        <div class="dz-details">
                            <div class="dz-size"><span data-dz-size></span></div>
                            <div class="dz-filename"><span data-dz-name></span></div>
                        </div>
                        <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
                        <div class="dz-error-message"><span data-dz-errormessage></span></div>
                        <div class="dz-success-mark"><i class="fa fa-check"></i></div>
                        <div class="dz-error-mark"><i class="fa fa-close"></i></div>
                    </div>
                `;
            }
        }
    }
</script>

<style scoped lang="scss">
    /* Custom style from vue-dropzone */
    .vue-dropzone {
        margin-top:1rem;
        margin-bottom: 1rem;
        min-height: 20rem;
        border: 2px solid #000000;
        font-family: inherit;
        letter-spacing: 0.2px;
        color: #777;
        transition: background-color .2s linear;
        &:hover {
            background-color: #F6F6F6;
        }
        i {
            color: #CCC;
        }
        .dz-preview {
            .dz-image {
                border-radius: 1;
                &:hover {
                    img {
                        transform: none;
                        filter: none;
                        -webkit-filter: none;
                    }
                }
            }
            .dz-details {
                bottom: 0;
                top: 0;
                color: white;
                background-color: rgba(33, 150, 243, 0.8);
                transition: opacity .2s linear;
                text-align: left;
                .dz-filename span, .dz-size span {
                    background-color: transparent;
                }
                .dz-filename:not(:hover) span {
                    border: none;
                }
                .dz-filename:hover span {
                    background-color: transparent;
                    border: none;
                }
            }
            .dz-progress .dz-upload {
                background: #cccccc;
            }
            .dz-remove {
                position: absolute;
                z-index: 30;
                color: white;
                margin-left: 15px;
                padding: 10px;
                top: inherit;
                bottom: 15px;
                border: 2px white solid;
                text-decoration: none;
                text-transform: uppercase;
                font-size: 0.8rem;
                font-weight: 800;
                letter-spacing: 1.1px;
                opacity: 0;
            }
            &:hover {
                .dz-remove {
                    opacity: 1;
                }
            }
            .dz-success-mark, .dz-error-mark {
                margin-left: auto !important;
                margin-top: auto !important;
                width: 100% !important;
                top: 35% !important;
                left: 0;
                i {
                    color: white !important;
                    font-size: 5rem !important;
                }
            }
        }
    }
</style>
