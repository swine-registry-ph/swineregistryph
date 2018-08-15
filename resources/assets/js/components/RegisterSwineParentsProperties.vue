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
                                        <register-swine-parents-properties-inputs
                                            :farmoptions="farmoptions"
                                            :parent-gender="'Sire'"
                                            :parent-id-prefix="gpSireIdPrefix"
                                        >
                                        </register-swine-parents-properties-inputs>
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
                                        <register-swine-parents-properties-inputs
                                            :farmoptions="farmoptions"
                                            :parent-gender="'Dam'"
                                            :parent-id-prefix="gpDamIdPrefix"
                                        >
                                        </register-swine-parents-properties-inputs>
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
                            <a class="btn-floating btn-large waves-effect waves-light blue right"
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
    import RegisterSwineParentsPropertiesInputs from './RegisterSwineParentsPropertiesInputs.vue';

    export default {
        props: {
            farmoptions: Array
        },

        components: {
            RegisterSwineParentsPropertiesInputs
        },

        data() {
            return {
                gpSireIdPrefix: 'gp-sire-',
                gpDamIdPrefix: 'gp-dam-',
                collapsibleStatus: {
                    sire: true,
                    dam: true
                }
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
