<template lang="html">
    <div id="summary" class="row">
        <div class="card col s12">
            <div class="card-content">
                <span class="card-title center-align">Summary</span>

                <div class="row">
                    <div class="col s12">
                        <br>
                    </div>

                    <!-- Swine Information -->
                    <div id="swineinfo-container" class="col s12 m12 l6 offset-l3">
                        <div class="card">
                            <div class="card-content">
                                <h6 class="center-align">
                                    <b> Swine Information </b>
                                </h6>

                                <p> <br> </p>

                                <table class="striped summary-table">
                                    <tbody>
                                        <tr>
                                            <td> Genetic Information ID (optional) </td>
                                            <td> {{ gpOneData.geneticInfoId }} </td>
                                        </tr>
                                        <tr>
                                            <td> Farm Of Origin </td>
                                            <td> {{ transformFarmId(gpOneData.farmFromId) }} </td>
                                        </tr>
                                        <tr>
                                            <td> Farm Swine ID / Earmark </td>
                                            <td> {{ gpOneData.farmSwineId }} </td>
                                        </tr>
                                        <tr>
                                            <td> Breed </td>
                                            <td> {{ transformBreedId(gpOneData.breedId) }} </td>
                                        </tr>
                                        <tr>
                                            <td> Sex </td>
                                            <td> {{ capitalize(gpOneData.sex) }} </td>
                                        </tr>
                                        <tr>
                                            <td> Number of Teats </td>
                                            <td> {{ gpOneData.teatNo }} </td>
                                        </tr>
                                        <tr>
                                            <td> Birth Date </td>
                                            <td> {{ gpOneData.birthDate }} </td>
                                        </tr>
                                        <tr>
                                            <td> Birth Weight </td>
                                            <td> {{ gpOneData.birthWeight }} kg</td>
                                        </tr>
                                        <tr>
                                            <td> Parity </td>
                                            <td> {{ gpOneData.parity }} </td>
                                        </tr>
                                        <tr>
                                            <td> Total (M) born alive </td>
                                            <td> {{ gpOneData.littersizeAliveMale }} </td>
                                        </tr>
                                        <tr>
                                            <td> Total (F) born alive </td>
                                            <td> {{ gpOneData.littersizeAliveFemale }} </td>
                                        </tr>
                                        <tr>
                                            <td> Littersize at Weaning </td>
                                            <td> {{ gpOneData.littersizeWeaning }} </td>
                                        </tr>
                                        <tr>
                                            <td> Total litterweight at weaning </td>
                                            <td> {{ gpOneData.litterweightWeaning }} </td>
                                        </tr>
                                        <tr>
                                            <td> Date at Weaning </td>
                                            <td> {{ gpOneData.dateWeaning }} </td>
                                        </tr>
                                        <tr>
                                            <td> Adjusted ADG from Birth (180 days) </td>
                                            <td> {{ gpOneComputedAdgFromBirth }} kg/day</td>
                                        </tr>
                                        <tr>
                                            <td> Adjusted ADG on Test (90-150 days) </td>
                                            <td> {{ gpOneComputedAdgOnTest }} kg/day</td>
                                        </tr>
                                        <tr>
                                            <td> Feed Efficiency </td>
                                            <td> {{ gpOneComputedFeedEfficiency }} </td>
                                        </tr>
                                        <tr>
                                            <td> Backfat Thickness (BFT) </td>
                                            <td> {{ gpOneData.bft }} mm</td>
                                        </tr>
                                        <tr>
                                            <td> Date of BFT Collection </td>
                                            <td> {{ gpOneData.bftCollected }} </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>

                <div class="row">
                    <!-- GP Sire Information -->
                    <div id="gp-sire-container" class="col s12 m12 l6">
                        <div class="card">
                            <div class="card-content">
                                <h6 class="center-align">
                                    <b>
                                        GP Sire Information
                                        <template v-if="gpSireData.existingRegNo">
                                            (Registered)
                                        </template>
                                        <template v-else-if="gpSireData.imported.regNo">
                                            (Imported)
                                        </template>
                                        <template v-else>
                                            (New)
                                        </template>
                                    </b>
                                </h6>

                                <p> <br> </p>

                                <table class="striped summary-table">
                                    <tbody>
                                        <template v-if="gpSireData.imported.regNo">
                                            <!-- For imported GP Sire -->
                                            <tr>
                                                <td> Registration Number </td>
                                                <td> {{ gpSireData.imported.regNo }} </td>
                                            </tr>
                                            <tr>
                                                <td> Farm Of Origin </td>
                                                <td> {{ gpSireData.imported.farmOfOrigin }} </td>
                                            </tr>
                                            <tr>
                                                <td> Country of Origin </td>
                                                <td> {{ gpSireData.imported.countryOfOrigin }} </td>
                                            </tr>
                                        </template>
                                        <template v-else>
                                            <template v-if="gpSireData.existingRegNo">
                                                <!-- For existing GP Sire -->
                                                <tr>
                                                    <td> Registration Number </td>
                                                    <td> {{ gpSireData.existingRegNo }} </td>
                                                </tr>
                                            </template>
                                            <!-- For new GP Sire -->
                                            <tr>
                                                <td> Genetic Information ID (optional) </td>
                                                <td> {{ gpSireData.geneticInfoId }} </td>
                                            </tr>
                                            <tr>
                                                <td> Farm Of Origin </td>
                                                <td> {{ transformFarmId(gpSireData.farmFromId) }} </td>
                                            </tr>
                                            <tr>
                                                <td> Farm Swine ID / Earmark </td>
                                                <td> {{ gpSireData.farmSwineId }} </td>
                                            </tr>
                                            <tr>
                                                <td> Number of Teats </td>
                                                <td> {{ gpSireData.teatNo }} </td>
                                            </tr>
                                            <tr>
                                                <td> Birth Date </td>
                                                <td> {{ gpSireData.birthDate }} </td>
                                            </tr>
                                            <tr>
                                                <td> Birth Weight </td>
                                                <td> {{ gpSireData.birthWeight }} kg</td>
                                            </tr>
                                            <tr>
                                                <td> Parity </td>
                                                <td> {{ gpSireData.parity }} </td>
                                            </tr>
                                            <tr>
                                                <td> Total (M) born alive </td>
                                                <td> {{ gpSireData.littersizeAliveMale }} </td>
                                            </tr>
                                            <tr>
                                                <td> Total (F) born alive </td>
                                                <td> {{ gpSireData.littersizeAliveFemale }} </td>
                                            </tr>
                                            <tr>
                                                <td> Littersize at Weaning </td>
                                                <td> {{ gpSireData.littersizeWeaning }} </td>
                                            </tr>
                                            <tr>
                                                <td> Total litterweight at weaning </td>
                                                <td> {{ gpSireData.litterweightWeaning }} </td>
                                            </tr>
                                            <tr>
                                                <td> Date at Weaning </td>
                                                <td> {{ gpSireData.dateWeaning }} </td>
                                            </tr>
                                            <tr>
                                                <td> Adjusted ADG from Birth (180 days) </td>
                                                <td> {{ gpSireComputedAdgFromBirth }} kg/day</td>
                                            </tr>
                                            <tr>
                                                <td> Adjusted ADG on Test (90-150 days) </td>
                                                <td> {{ gpSireComputedAdgOnTest }} kg/day</td>
                                            </tr>
                                            <tr>
                                                <td> Feed Efficiency </td>
                                                <td> {{ gpSireComputedFeedEfficiency }} </td>
                                            </tr>
                                            <tr>
                                                <td> Backfat Thickness (BFT) </td>
                                                <td> {{ gpSireData.bft }} mm</td>
                                            </tr>
                                            <tr>
                                                <td> Date of BFT Collection </td>
                                                <td> {{ gpSireData.bftCollected }} </td>
                                            </tr>
                                        </template>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <!-- GP Dam Information -->
                    <div id="gp-dam-container" class="col s12 m12 l6">
                        <div class="card">
                            <div class="card-content">
                                <h6 class="center-align">
                                    <b>
                                        GP Dam Information
                                        <template v-if="gpDamData.existingRegNo">
                                            (Registered)
                                        </template>
                                        <template v-else-if="gpDamData.imported.regNo">
                                            (Imported)
                                        </template>
                                        <template v-else>
                                            (New)
                                        </template>
                                    </b>
                                </h6>

                                <p> <br> </p>

                                <table class="striped summary-table">
                                    <tbody>
                                        <template v-if="gpDamData.imported.regNo">
                                            <!-- For imported GP Dam -->
                                            <tr>
                                                <td> Registration Number </td>
                                                <td> {{ gpDamData.imported.regNo }} </td>
                                            </tr>
                                            <tr>
                                                <td> Farm of Origin </td>
                                                <td> {{ gpDamData.imported.farmOfOrigin }} </td>
                                            </tr>
                                            <tr>
                                                <td> Country of Origin </td>
                                                <td> {{ gpDamData.imported.countryOfOrigin }} </td>
                                            </tr>
                                        </template>
                                        <template v-else>
                                            <template v-if="gpDamData.existingRegNo">
                                                <!-- For existing GP Dam -->
                                                <tr>
                                                    <td> Registration Number </td>
                                                    <td> {{ gpDamData.existingRegNo }} </td>
                                                </tr>
                                            </template>
                                            <!-- For new GP Dam -->
                                            <tr>
                                                <td> Genetic Information ID (optional) </td>
                                                <td> {{ gpDamData.geneticInfoId }} </td>
                                            </tr>
                                            <tr>
                                                <td> Farm Of Origin </td>
                                                <td> {{ transformFarmId(gpDamData.farmFromId) }} </td>
                                            </tr>
                                            <tr>
                                                <td> Farm Swine ID / Earmark </td>
                                                <td> {{ gpDamData.farmSwineId }} </td>
                                            </tr>
                                            <tr>
                                                <td> Number of Teats </td>
                                                <td> {{ gpDamData.teatNo }} </td>
                                            </tr>
                                            <tr>
                                                <td> Birth Date </td>
                                                <td> {{ gpDamData.birthDate }} </td>
                                            </tr>
                                            <tr>
                                                <td> Birth Weight </td>
                                                <td> {{ gpDamData.birthWeight }} kg</td>
                                            </tr>
                                            <tr>
                                                <td> Parity </td>
                                                <td> {{ gpDamData.parity }} </td>
                                            </tr>
                                            <tr>
                                                <td> Total (M) born alive </td>
                                                <td> {{ gpDamData.littersizeAliveMale }} </td>
                                            </tr>
                                            <tr>
                                                <td> Total (F) born alive </td>
                                                <td> {{ gpDamData.littersizeAliveFemale }} </td>
                                            </tr>
                                            <tr>
                                                <td> Littersize at Weaning </td>
                                                <td> {{ gpDamData.littersizeWeaning }} </td>
                                            </tr>
                                            <tr>
                                                <td> Total litterweight at weaning </td>
                                                <td> {{ gpDamData.litterweightWeaning }} </td>
                                            </tr>
                                            <tr>
                                                <td> Date at Weaning </td>
                                                <td> {{ gpDamData.dateWeaning }} </td>
                                            </tr>
                                            <tr>
                                                <td> Adjusted ADG from Birth (180 days) </td>
                                                <td> {{ gpDamComputedAdgFromBirth }} kg/day</td>
                                            </tr>
                                            <tr>
                                                <td> Adjusted ADG on Test (90-150 days) </td>
                                                <td> {{ gpDamComputedAdgOnTest }} kg/day</td>
                                            </tr>
                                            <tr>
                                                <td> Feed Efficiency </td>
                                                <td> {{ gpDamComputedFeedEfficiency}} </td>
                                            </tr>
                                            <tr>
                                                <td> Backfat Thickness (BFT) </td>
                                                <td> {{ gpDamData.bft }} mm</td>
                                            </tr>
                                            <tr>
                                                <td> Date of BFT Collection </td>
                                                <td> {{ gpDamData.bftCollected }} </td>
                                            </tr>
                                        </template>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <!-- SwineCart -->
                    <div id="swinecart-container"class="col s12 m12 l6 offset-l3">
                        <div class="card">
                            <div class="card-content">
                                <h6 class="center-align">
                                    <b>SwineCart</b>
                                </h6>
                                <div class="row">
                                    <div class="col s12">
                                        <input v-model="gpOneSwinecart"
                                            type="checkbox"
                                            id="check-swinecart"
                                            class="filled-in"
                                        />
                                        <label for="check-swinecart">Include this swine in SwineCart?</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div id="summary-card-action" class="card-action center-align">
                <!-- For Breed Registry certificate -->
                <a  v-if="!successfullyRegistered"
                    :href="tempRegistryCertificateLink"
                    target="_blank"
                    class="btn-flat waves-effect waves-light preview-cert black-text"
                    name="action"
                >
                    Preview Certificate
                </a>
                <button v-if="!successfullyRegistered"
                    href="#!"
                    class="btn waves-effect waves-light register-and-generate-cert"
                    type="submit"
                    name="action"
                    @click.prevent="registerSwine($event)"
                >
                    Register Swine and Generate Certificate
                </button>
                <a  v-if="successfullyRegistered"
                    :href="registryCertificateLink"
                    target="_blank"
                    class="btn-flat waves-effect waves-light view-generated-cert black-text"
                    name="action"
                >
                    View Generated Certificate
                </a>
                <a v-if="successfullyRegistered"
                    href="#!"
                    class="btn waves-effect waves-light"
                    @click.prevent="triggerGoToTabEvent('photos')"
                >
                    Upload Swine Photos
                </a>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            breeds: Array,
            farmoptions: Array
        },

        data() {
            return {
                successfullyRegistered: false
            }
        },

        computed: {
            tempRegistryCertificateLink() {
                return '/breeder/temp-registry-certificate';
            },
            registryCertificateLink() {
                const certificateLink = '/breeder/registry-certificate';
                const gpOneId = this.gpOneData.id;
                return `${certificateLink}/${gpOneId}`;
            },
            gpOneData() {
                return this.$store.getters.gpOneData;
            },
            gpOneComputedAdgFromBirth() {
                return this.$store.getters.computedAdgFromBirth('gpOne');
            },
            gpOneComputedAdgOnTest() {
                return this.$store.getters.computedAdgOnTest('gpOne');
            },
            gpOneComputedFeedEfficiency() {
                return this.$store.getters.computedFeedEfficiency('gpOne');
            },
            gpSireData() {
                return this.$store.getters.gpSireData;
            },
            gpSireComputedAdgFromBirth() {
                return this.$store.getters.computedAdgFromBirth('gpSire');
            },
            gpSireComputedAdgOnTest() {
                return this.$store.getters.computedAdgOnTest('gpSire');
            },
            gpSireComputedFeedEfficiency() {
                return this.$store.getters.computedFeedEfficiency('gpSire');
            },
            gpDamData() {
                return this.$store.getters.gpDamData;
            },
            gpDamComputedAdgFromBirth() {
                return this.$store.getters.computedAdgFromBirth('gpDam');
            },
            gpDamComputedAdgOnTest() {
                return this.$store.getters.computedAdgOnTest('gpDam');
            },
            gpDamComputedFeedEfficiency() {
                return this.$store.getters.computedFeedEfficiency('gpDam');
            },
            gpOneSwinecart: {
                // get and set value from vuex store
                get() { return this.$store.state.registerSwine.gpOne.swinecart; },
                set(value) {
                    this.$store.commit('updateValue', {
                        instance: 'gpOne',
                        property: 'swinecart',
                        value: value
                    });
                }
            }
        },

        methods: {
            transformFarmId(id) {
                return (id > 0) ? this.farmoptions[id-1].text : '';
            },

            transformBreedId(id) {
                return (id > 0) ? this.breeds[id-1].text : '';
            },

            capitalize(string) {
                return _.capitalize(string);
            },

            registerSwine(event) {
                const gpOneData = this.gpOneData;
                const gpSireData = this.gpSireData;
                const gpDamData = this.gpDamData;
                const submitButton = $('.register-and-generate-cert');

                this.disableButtons(submitButton, event.target, 'Registering...')

                // Attach derived values such as ADG, FE, and breedId
                // for parents to original object before submit
                gpOneData.adgBirth = this.gpOneComputedAdgFromBirth;
                gpOneData.adgTest = this.gpOneComputedAdgOnTest;
                gpOneData.feedEfficiency = this.gpOneComputedFeedEfficiency;
                gpSireData.adgBirth = this.gpSireComputedAdgFromBirth;
                gpSireData.adgTest = this.gpSireComputedAdgOnTest;
                gpSireData.feedEfficiency = this.gpSireComputedFeedEfficiency;
                gpSireData.breedId = gpOneData.breedId;
                gpSireData.status = this.determineStatus(gpSireData);
                gpDamData.adgBirth = this.gpDamComputedAdgFromBirth;
                gpDamData.adgTest = this.gpDamComputedAdgOnTest;
                gpDamData.feedEfficiency = this.gpDamComputedFeedEfficiency;
                gpDamData.breedId = this.gpOneData.breedId;
                gpDamData.status = this.determineStatus(gpDamData);

                // Add to server's database
                axios.post('/breeder/manage-swine/register', {
                    gpOne: gpOneData,
                    gpSire: gpSireData,
                    gpDam: gpDamData
                })
                .then((response) => {
                    const data = response.data;

                    // Mutate state of gpOne
                    this.$store.commit('updateValue', {
                        instance: 'gpOne',
                        property: 'id',
                        value: data.id
                    });

                    this.$store.commit('updateValue', {
                        instance: 'gpOne',
                        property: 'regNo',
                        value: data.registration_no
                    });

                    this.successfullyRegistered = true;
                    // this.enableButtons(submitButton, event.target, 'Register Swine and Generate Certificate');
                    Materialize.toast('Registration Successful! You can now upload swine photos', 4000, 'green lighten-1');
                })
                .catch((error) => {
                    console.log(error);
                });
            },

            determineStatus(parentData) {
                // Help determine if parent to be added is
                // registered, imported, or new
                let status = '';

                if(parentData.existingRegNo) status = 'registered';
                else if (parentData.imported.regNo) status = 'imported';
                else status = 'new';

                return status;
            },

            disableButtons(buttons, actionBtnElement, textToShow) {
                buttons.addClass('disabled');
                actionBtnElement.innerHTML = textToShow;
            },

            enableButtons(buttons, actionBtnElement, textToShow) {
                buttons.removeClass('disabled');
                actionBtnElement.innerHTML = textToShow;
            },

            triggerGoToTabEvent(tabId) {
                this.$emit('goToTabEvent', tabId);
            }
        },

        mounted() {
            console.log('Component mounted.');
        }
    }
</script>

<style scoped lang="css">
    .summary-table td {
        padding: 0;
    }

    .summary-table tr td:first-child {
        color: #757575;
    }

    .summary-table tr td:last-child {
        color: black;
    }

    #summary > .card {
        padding: 0;
    }

    #summary-card-action {
        border-top: 0;
        background-color: rgba(236, 239, 241, 0.7);
    }

    #swinecart-container div.row {
        margin-bottom: 0px;
    }

    #swinecart-container div.row {
        padding-top: 1rem;
    }

    /* Accent highlights on cards */
    #swineinfo-container > .card {
        border-top: 4px solid #2672a6;
    }

    #swinecart-container > .card {
        border-top: 4px solid #26a69a;
    }

    #gp-sire-container > .card {
        border-top: 4px solid #9a26a6;
    }

    #gp-dam-container > .card {
        border-top: 4px solid #a69a26;
    }
</style>
