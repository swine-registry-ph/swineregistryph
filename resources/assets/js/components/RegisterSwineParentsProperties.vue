<template lang="html">
    <div id="gp-parents" class="row">
        <div class="card col s12">
            <div class="card-content">
                <span class="card-title center-align">GP Parents</span>

                <div class="row">
                    <div class="col s12">
                        <div class="col s12">
                            <br>
                        </div>

                        <div class="col s12">
                            <ul class="collapsible" data-collapsible="expandable">
                                <li>
                                    <div class="collapsible-header"
                                        @click="collapsibleStatus.sire = !collapsibleStatus.sire"
                                    >
                                        <i class="material-icons">
                                            <template v-if="collapsibleStatus.sire">
                                                label_outline
                                            </template>
                                            <template v-else>
                                                label
                                            </template>
                                        </i>
                                        GP Sire
                                    </div>
                                    <div class="collapsible-body">
                                        <!-- GP Sire -->
                                        <div id="sire-container" class="col s12 m12 l6 offset-l3">
                                            <!-- GP Sire: radio if existing or new -->
                                            <div class="col s12">
                                                <h6>
                                                    <b>Choose an option</b>
                                                </h6>
                                                <p>
                                                    <input v-model="status.sire"
                                                        name="sire-status"
                                                        type="radio"
                                                        id="sire-new"
                                                        value="new"
                                                    >
                                                    <label for="sire-new">Sire is not yet registered in the system</label>
                                                </p>
                                                <p>
                                                    <input v-model="status.sire"
                                                        name="sire-status"
                                                        type="radio"
                                                        id="sire-existing"
                                                        value="existing"
                                                    >
                                                    <label for="sire-existing">Sire is currently registered in the system</label>
                                                </p>
                                            </div>

                                            <div class="col s12">
                                                <br>
                                            </div>

                                            <!-- GP Sire: existing -->
                                            <template v-if="status.sire === 'existing'">
                                                <div class="col s8 offset-s2 input-field">
                                                    <input v-model="existingParents.sireRegNo"
                                                        :id="gpSireIdPrefix + 'existing'"
                                                        type="text"
                                                        class="validate"
                                                    >
                                                    <label :for="gpSireIdPrefix + 'gpSire'">GP Sire Registration #</label>
                                                </div>
                                            </template>

                                            <!-- GP Sire: new -->
                                            <template v-else-if="status.sire === 'new'">
                                                <!-- GP Sire: properties -->
                                                <div class="col s12 input-field">
                                                    <input v-model="gpSire.importedRegNo"
                                                        :id="gpSireIdPrefix + 'imported-reg-no'"
                                                        type="text"
                                                        class="validate"
                                                    >
                                                    <label :for="gpSireIdPrefix + 'imported-reg-no'">Imported Animal/Semen Registration # (optional)</label>
                                                </div>
                                                <div class="col s12 input-field">
                                                    <input v-model="gpSire.geneticInfoId"
                                                        :id="gpSireIdPrefix + 'genetic-info-id'"
                                                        type="text"
                                                        class="validate"
                                                    >
                                                    <label :for="gpSireIdPrefix + 'genetic-info-id'">Genetic Information ID (optional)</label>
                                                </div>
                                                <div class="input-field col s12">
                                                    <app-input-select
                                                        labelDescription="Farm From"
                                                        v-model="gpSire.farmFrom"
                                                        :options="farmoptions"
                                                        @select="val => {gpSire.farmFrom = val}"
                                                    >
                                                    </app-input-select>
                                                </div>
                                                <div class="col s6 input-field">
                                                    <app-input-date
                                                        v-model="gpSire.birthDate"
                                                        @date-select="val => {gpSire.birthDate = val}"
                                                    >
                                                    </app-input-date>
                                                    <label for=""> Birth Date </label>
                                                </div>
                                                <div class="col s6 input-field">
                                                    <input v-model="gpSire.birth_weight"
                                                        :id="gpSireIdPrefix + 'birth-weight'"
                                                        type="text"
                                                        class="validate"
                                                    >
                                                    <label :for="gpSireIdPrefix + 'birth-weight'">Birth Weight</label>
                                                </div>
                                                <div class="col s6 input-field">
                                                    <app-input-date
                                                        v-model="gpSire.dateCollected"
                                                        @date-select="val => {gpSire.dateCollected = val}"
                                                    >
                                                    </app-input-date>
                                                    <label for=""> Date when data was collected </label>
                                                </div>
                                                <div class="col s6 input-field">
                                                    <input v-model="gpSire.weight"
                                                        :id="gpSireIdPrefix + 'weight'"
                                                        type="text"
                                                        class="validate"
                                                    >
                                                    <label :for="gpSireIdPrefix + 'weight'">Weight when data was collected</label>
                                                </div>
                                                <div class="col s6 input-field">
                                                    <input v-model="gpSire.bft"
                                                        :id="gpSireIdPrefix + 'bft'"
                                                        type="text"
                                                        class="validate"
                                                    >
                                                    <label :for="gpSireIdPrefix + 'bft'">Backfat Thickness (mm)</label>
                                                </div>
                                                <div class="col s6 input-field">
                                                    <input v-model="gpSire.fe"
                                                        :id="gpSireIdPrefix + 'feed-efficiency'"
                                                        type="text"
                                                        class="validate"
                                                    >
                                                    <label :for="gpSireIdPrefix + 'feed-efficiency'">Feed Efficiency (gain/feed)</label>
                                                </div>
                                                <div class="col s6 input-field">
                                                    <input v-model="gpSire.teatNo"
                                                        :id="gpSireIdPrefix + 'teatno'"
                                                        type="text"
                                                        class="validate"
                                                    >
                                                    <label :for="gpSireIdPrefix + 'teatno'">Teat number</label>
                                                </div>
                                                <div class="col s6 input-field">
                                                    <input v-model="gpSire.parity"
                                                        :id="gpSireIdPrefix + 'parity'"
                                                        type="text"
                                                        class="validate"
                                                    >
                                                    <label :for="gpSireIdPrefix + 'parity'">Parity</label>
                                                </div>
                                                <div class="col s6 input-field">
                                                    <input v-model="gpSire.littersizeAlive_male"
                                                        :id="gpSireIdPrefix + 'total-m'"
                                                        type="text"
                                                        class="validate"
                                                    >
                                                    <label :for="gpSireIdPrefix + 'total-m'">Total (M) born alive</label>
                                                </div>
                                                <div class="col s6 input-field">
                                                    <input v-model="gpSire.littersizeAlive_female"
                                                        :id="gpSireIdPrefix + 'total-f'"
                                                        type="text"
                                                        class="validate"
                                                    >
                                                    <label :for="gpSireIdPrefix + 'total-f'">Total (F) born alive</label>
                                                </div>
                                                <div class="col s6 input-field">
                                                    <input v-model="gpSire.littersize_weaning"
                                                        :id="gpSireIdPrefix + 'littersize-weaning'"
                                                        type="text"
                                                        class="validate"
                                                    >
                                                    <label :for="gpSireIdPrefix + 'littersize-weaning'">Littersize at weaning</label>
                                                </div>
                                                <div class="col s6 input-field">
                                                    <input v-model="gpSire.litterweight_weaning"
                                                        :id="gpSireIdPrefix + 'litterweight-weaning'"
                                                        type="text"
                                                        class="validate"
                                                    >
                                                    <label :for="gpSireIdPrefix + 'litterweight-weaning'">Litter weight at weaning</label>
                                                </div>
                                                <div class="col s6 input-field">
                                                    <app-input-date
                                                        v-model="gpSire.date_weaning"
                                                        @date-select="val => {gpSire.date_weaning = val}"
                                                    >
                                                    </app-input-date>
                                                    <label for=""> Date at weaning </label>
                                                </div>

                                                <div class="col s12">
                                                    <br>
                                                </div>

                                                <!-- GP Sire: ADG computation from Birth -->
                                                <div class="col s12">
                                                    <h6>
                                                        <b>Average Daily Gain computation from Birth</b>
                                                    </h6>
                                                </div>
                                                <div class="col s6 input-field">
                                                    <app-input-date
                                                        v-model="gpSire.adgBirth_endDate"
                                                        @date-select="val => {gpSire.adgBirth_endDate = val}"
                                                    >
                                                    </app-input-date>
                                                    <label for=""> End Date </label>
                                                </div>
                                                <div class="col s6 input-field">
                                                    <input v-model="gpSire.adgBirth_endWeight"
                                                        :id="gpSireIdPrefix + 'adg-birth-end-weight'"
                                                        type="text"
                                                        class="validate"
                                                    >
                                                    <label :for="gpSireIdPrefix + 'adg-birth-end-weight'">End Weight</label>
                                                </div>

                                                <div class="col s12">
                                                    <br>
                                                </div>

                                                <!-- GP Sire: ADG computation on Test -->
                                                <div class="col s12">
                                                    <h6>
                                                        <b>Average Daily Gain computation on Test</b>
                                                    </h6>
                                                </div>
                                                <div class="col s6 input-field">
                                                    <app-input-date
                                                        v-model="gpSire.adgTest_startDate"
                                                        @date-select="val => {gpSire.adgTest_startDate = val}"
                                                    >
                                                    </app-input-date>
                                                    <label for=""> Start Date </label>
                                                </div>
                                                <div class="col s6 input-field">
                                                    <input v-model="gpSire.adgTest_startWeight"
                                                        :id="gpSireIdPrefix + 'adg-test-start-weight'"
                                                        type="text"
                                                        class="validate"
                                                    >
                                                    <label :for="gpSireIdPrefix + 'adg-test-start-weight'">Start Weight</label>
                                                </div>
                                                <div class="col s6 input-field">
                                                    <app-input-date
                                                        v-model="gpSire.adgTest_endDate"
                                                        @date-select="val => {gpSire.adgTest_endDate = val}"
                                                    >
                                                    </app-input-date>
                                                    <label for=""> End Date </label>
                                                </div>
                                                <div class="col s6 input-field">
                                                    <input v-model="gpSire.adgTest_endWeight"
                                                        :id="gpSireIdPrefix + 'adg-test-end-weight'"
                                                        type="text"
                                                        class="validate"
                                                    >
                                                    <label :for="gpSireIdPrefix + 'adg-test-end-weight'">End Weight</label>
                                                </div>

                                                <div class="col s12">
                                                    <br>
                                                </div>

                                                <!-- GP Sire: House Type -->
                                                <div class="col s12">
                                                    <h6>
                                                        <b>House Type</b>
                                                    </h6>
                                                    <p>
                                                        <input v-model="gpSire.houseType"
                                                            name="sire-house-type"
                                                            type="radio"
                                                            id="sire-house-type-tunnel"
                                                            value="tunnel"
                                                        >
                                                        <label for="sire-house-type-tunnel">Tunnel ventilated</label>
                                                    </p>
                                                    <p>
                                                        <input v-model="gpSire.houseType"
                                                            name="sire-house-type"
                                                            type="radio"
                                                            id="sire-house-type-open"
                                                            value="open"
                                                        >
                                                        <label for="sire-house-type-open">Open sided</label>
                                                    </p>
                                                </div>
                                            </template>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div class="collapsible-header"
                                        @click="collapsibleStatus.dam = !collapsibleStatus.dam"
                                    >
                                        <i class="material-icons">
                                            <template v-if="collapsibleStatus.dam">
                                                label_outline
                                            </template>
                                            <template v-else>
                                                label
                                            </template>
                                        </i>
                                        GP Dam
                                    </div>
                                    <div class="collapsible-body">
                                        <!-- GP Dam -->
                                        <div id="dam-container" class="col s12 m12 l6 offset-l3">
                                            <!-- GP Dam: radio if existing or new -->
                                            <div class="col s12">
                                                <h6>
                                                    <b>Choose an option</b>
                                                </h6>
                                                <p>
                                                    <input v-model="status.dam"
                                                        name="dam-status"
                                                        type="radio"
                                                        id="dam-new"
                                                        value="new"
                                                    >
                                                    <label for="dam-new">Dam is not yet registered in the system</label>
                                                </p>
                                                <p>
                                                    <input v-model="status.dam"
                                                        name="dam-status"
                                                        type="radio"
                                                        id="dam-existing"
                                                        value="existing"
                                                    >
                                                    <label for="dam-existing">Dam is currently registered in the system</label>
                                                </p>
                                            </div>

                                            <div class="col s12">
                                                <br>
                                            </div>

                                            <!-- GP Dam: existing -->
                                            <template v-if="status.dam === 'existing'">
                                                <div class="col s8 offset-s2 input-field">
                                                    <input v-model="existingParents.damRegNo"
                                                        :id="gpDamIdPrefix + 'existing'"
                                                        type="text"
                                                        class="validate"
                                                    >
                                                    <label :for="gpDamIdPrefix + 'gpDam'">GP Dam Registration #</label>
                                                </div>
                                            </template>

                                            <!-- GP Dam: new -->
                                            <template v-else-if="status.dam === 'new'">
                                                <!-- GP Dam: properties -->
                                                <div class="col s12 input-field">
                                                    <input v-model="gpDam.importedRegNo"
                                                        :id="gpDamIdPrefix + 'imported-reg-no'"
                                                        type="text"
                                                        class="validate"
                                                    >
                                                    <label :for="gpDamIdPrefix + 'imported-reg-no'">Imported Animal Registration # (optional)</label>
                                                </div>
                                                <div class="col s12 input-field">
                                                    <input v-model="gpDam.geneticInfoId"
                                                        :id="gpDamIdPrefix + 'genetic-info-id'"
                                                        type="text"
                                                        class="validate"
                                                    >
                                                    <label :for="gpDamIdPrefix + 'genetic-info-id'">Genetic Information ID (optional)</label>
                                                </div>
                                                <div class="input-field col s12">
                                                    <app-input-select
                                                        labelDescription="Farm From"
                                                        v-model="gpDam.farmFrom"
                                                        :options="farmoptions"
                                                        @select="val => {gpDam.farmFrom = val}"
                                                    >
                                                    </app-input-select>
                                                </div>
                                                <div class="col s6 input-field">
                                                    <app-input-date
                                                        v-model="gpDam.birthDate"
                                                        @date-select="val => {gpDam.birthDate = val}"
                                                    >
                                                    </app-input-date>
                                                    <label for=""> Birth Date </label>
                                                </div>
                                                <div class="col s6 input-field">
                                                    <input v-model="gpDam.birth_weight"
                                                        :id="gpDamIdPrefix + 'birth-weight'"
                                                        type="text"
                                                        class="validate"
                                                    >
                                                    <label :for="gpDamIdPrefix + 'birth-weight'">Birth Weight</label>
                                                </div>
                                                <div class="col s6 input-field">
                                                    <app-input-date
                                                        v-model="gpSire.date_weaning"
                                                        @date-select="val => {gpSire.date_weaning = val}"
                                                    >
                                                    </app-input-date>
                                                    <label for=""> Date when data was collected </label>
                                                </div>
                                                <div class="col s6 input-field">
                                                    <input v-model="gpDam.weight"
                                                        :id="gpDamIdPrefix + 'weight'"
                                                        type="text"
                                                        class="validate"
                                                    >
                                                    <label :for="gpDamIdPrefix + 'weight'">Weight when data was collected</label>
                                                </div>
                                                <div class="col s6 input-field">
                                                    <input v-model="gpDam.bft"
                                                        :id="gpDamIdPrefix + 'bft'"
                                                        type="text"
                                                        class="validate"
                                                    >
                                                    <label :for="gpDamIdPrefix + 'bft'">Backfat Thickness (mm)</label>
                                                </div>
                                                <div class="col s6 input-field">
                                                    <input v-model="gpDam.fe"
                                                        :id="gpDamIdPrefix + 'feed-efficiency'"
                                                        type="text"
                                                        class="validate"
                                                    >
                                                    <label :for="gpDamIdPrefix + 'feed-efficiency'">Feed Efficiency (gain/feed)</label>
                                                </div>
                                                <div class="col s6 input-field">
                                                    <input v-model="gpDam.teatNo"
                                                        :id="gpDamIdPrefix + 'teatno'"
                                                        type="text"
                                                        class="validate"
                                                    >
                                                    <label :for="gpDamIdPrefix + 'teatno'">Teat number</label>
                                                </div>
                                                <div class="col s6 input-field">
                                                    <input v-model="gpDam.parity"
                                                        :id="gpDamIdPrefix + 'parity'"
                                                        type="text"
                                                        class="validate"
                                                    >
                                                    <label :for="gpDamIdPrefix + 'parity'">Parity</label>
                                                </div>
                                                <div class="col s6 input-field">
                                                    <input v-model="gpDam.littersizeAlive_male"
                                                        :id="gpDamIdPrefix + 'total-m'"
                                                        type="text"
                                                        class="validate"
                                                    >
                                                    <label :for="gpDamIdPrefix + 'total-m'">Total (M) born alive</label>
                                                </div>
                                                <div class="col s6 input-field">
                                                    <input v-model="gpDam.littersizeAlive_female"
                                                        :id="gpDamIdPrefix + 'total-f'"
                                                        type="text"
                                                        class="validate"
                                                    >
                                                    <label :for="gpDamIdPrefix + 'total-f'">Total (F) born alive</label>
                                                </div>
                                                <div class="col s6 input-field">
                                                    <input v-model="gpDam.littersize_weaning"
                                                        :id="gpDamIdPrefix + 'littersize-weaning'"
                                                        type="text"
                                                        class="validate"
                                                    >
                                                    <label :for="gpDamIdPrefix + 'littersize-weaning'">Littersize at weaning</label>
                                                </div>
                                                <div class="col s6 input-field">
                                                    <input v-model="gpDam.litterweight_weaning"
                                                        :id="gpDamIdPrefix + 'litterweight-weaning'"
                                                        type="text"
                                                        class="validate"
                                                    >
                                                    <label :for="gpDamIdPrefix + 'litterweight-weaning'">Litter weight at weaning</label>
                                                </div>
                                                <div class="col s6 input-field">
                                                    <app-input-date
                                                        v-model="gpDam.date_weaning"
                                                        @date-select="val => {gpDam.date_weaning = val}"
                                                    >
                                                    </app-input-date>
                                                    <label for=""> Date at weaning </label>
                                                </div>

                                                <div class="col s12">
                                                    <br>
                                                </div>

                                                <!-- GP Dam: ADG computation from Birth -->
                                                <div class="col s12">
                                                    <h6>
                                                        <b>Average Daily Gain computation from Birth</b>
                                                    </h6>
                                                </div>
                                                <div class="col s6 input-field">
                                                    <app-input-date
                                                        v-model="gpDam.adgBirth_endDate"
                                                        @date-select="val => {gpDam.adgBirth_endDate = val}"
                                                    >
                                                    </app-input-date>
                                                    <label for=""> End Date </label>
                                                </div>
                                                <div class="col s6 input-field">
                                                    <input v-model="gpDam.adgBirth_endWeight"
                                                        :id="gpDamIdPrefix + 'adg-birth-end-weight'"
                                                        type="text"
                                                        class="validate"
                                                    >
                                                    <label :for="gpDamIdPrefix + 'adg-birth-end-weight'">End Weight</label>
                                                </div>

                                                <div class="col s12">
                                                    <br>
                                                </div>

                                                <!-- GP Dam: ADG computation from Birth -->
                                                <div class="col s12">
                                                    <h6>
                                                        <b>Average Daily Gain computation on Test</b>
                                                    </h6>
                                                </div>
                                                <div class="col s6 input-field">
                                                    <app-input-date
                                                        v-model="gpDam.adgTest_startDate"
                                                        @date-select="val => {gpDam.adgTest_startDate = val}"
                                                    >
                                                    </app-input-date>
                                                    <label for=""> Start Date </label>
                                                </div>
                                                <div class="col s6 input-field">
                                                    <input v-model="gpDam.adgTest_startWeight"
                                                        :id="gpDamIdPrefix + 'adg-test-start-weight'"
                                                        type="text"
                                                        class="validate"
                                                    >
                                                    <label :for="gpDamIdPrefix + 'adg-test-start-weight'">Start Weight</label>
                                                </div>
                                                <div class="col s6 input-field">
                                                    <app-input-date
                                                        v-model="gpDam.adgTest_endDate"
                                                        @date-select="val => {gpDam.adgTest_endDate = val}"
                                                    >
                                                    </app-input-date>
                                                    <label for=""> End Date </label>
                                                </div>
                                                <div class="col s6 input-field">
                                                    <input v-model="gpDam.adgTest_endWeight"
                                                        :id="gpDamIdPrefix + 'adg-test-end-weight'"
                                                        type="text"
                                                        class="validate"
                                                    >
                                                    <label :for="gpDamIdPrefix + 'adg-test-end-weight'">End Weight</label>
                                                </div>

                                                <div class="col s12">
                                                    <br>
                                                </div>

                                                <!-- GP Dam: House Type -->
                                                <div class="col s12">
                                                    <h6>
                                                        <b>House Type</b>
                                                    </h6>
                                                    <p>
                                                        <input v-model="gpDam.houseType"
                                                            name="dam-house-type"
                                                            type="radio"
                                                            id="dam-house-type-tunnel"
                                                            value="tunnel"
                                                        >
                                                        <label for="dam-house-type-tunnel">Tunnel ventilated</label>
                                                    </p>
                                                    <p>
                                                        <input v-model="gpSire.houseType"
                                                            name="dam-house-type"
                                                            type="radio"
                                                            id="dam-house-type-open"
                                                            value="open"
                                                        >
                                                        <label for="dam-house-type-open">Open sided</label>
                                                    </p>
                                                </div>
                                            </template>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div class="col s12">
                            <br>
                        </div>
                        <div class="col s12">
                            <br>
                        </div>

                        <!-- Tab navigation links -->
                        <div class="col s12">
                            <a class="btn-floating btn-large waves-effect waves-light grey lighten-4 left"
                                @click.prevent="triggerGoToTabEvent('gp-1')"
                            >
                                <i class="material-icons black-text">arrow_back</i>
                            </a>
                            <a class="btn-floating btn-large waves-effect waves-light green lighten-1 right"
                                @click.prevent="triggerGoToTabEvent('summary')"
                            >
                                <i class="material-icons">arrow_forward</i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            farmoptions: Array
        },

        data() {
            return {
                gpSireIdPrefix: 'gp-sire-',
                gpDamIdPrefix: 'gp-dam-',
                collapsibleStatus: {
                    sire: true,
                    dam: true
                },
                status: {
                    sire: 'existing',
                    dam: 'existing'
                },
                existingParents: {
                    sireRegNo: '',
                    damRegNo: ''
                },
                gpSire: {
                    importedRegNo: '',
                    geneticInfoId: '',
                    farmFrom: '',
                    birthDate: '',
                    dateCollected: '',
                    houseType: '',
                    teatNo: '',
                    weight: '',
                    adgBirth_endDate: '',
                    adgBirth_endWeight: '',
                    adgTest_startDate: '',
                    adgTest_endDate: '',
                    adgTest_startWeight: '',
                    adgTest_endWeight: '',
                    bft: '',
                    fe: '',
                    birth_weight: '',
                    littersizeAlive_male: '',
                    littersizeAlive_female: '',
                    parity: '',
                    littersize_weaning: '',
                    litterweight_weaning: '',
                    date_weaning: ''
                },
                gpDam: {
                    importedRegNo: '',
                    geneticInfoId: '',
                    farmFrom: '',
                    birthDate: '',
                    dateCollected: '',
                    houseType: '',
                    teatNo: '',
                    weight: '',
                    adgBirth_endDate: '',
                    adgBirth_endWeight: '',
                    adgTest_startDate: '',
                    adgTest_endDate: '',
                    adgTest_startWeight: '',
                    adgTest_endWeight: '',
                    bft: '',
                    fe: '',
                    birth_weight: '',
                    littersizeAlive_male: '',
                    littersizeAlive_female: '',
                    parity: '',
                    littersize_weaning: '',
                    litterweight_weaning: '',
                    date_weaning: ''
                }
            }
        },

        watch: {
            'status.sire': function() {
                this.$nextTick(() => {
                    Materialize.updateTextFields();
                });
            },

            'status.dam': function() {
                this.$nextTick(() => {
                    Materialize.updateTextFields();
                });
            }
        },

        methods: {
            triggerGoToTabEvent(tabId) {
                this.$emit('goToTabEvent', tabId);
            }
        },

        mounted() {
            // Open GP Sire and GP Dam collapsible by default
            $('.collapsible').collapsible('open', 0);
            $('.collapsible').collapsible('open', 1);
        }
    }
</script>

<style scoped lang="css">
    div.collapsible-body {
        overflow: auto;
    }
</style>
