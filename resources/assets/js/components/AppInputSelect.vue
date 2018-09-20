<template lang="html">
    <div class="app-input-select">
        <select ref="select" :value="value">
            <option value="" disabled> Choose {{ labelDescription }} </option>
            <option v-for="option in options" :value="option.value"> {{ option.text }} </option>
        </select>
        <label v-show="hideLabel" for=""> {{ labelDescription }} </label>
    </div>
</template>

<script>
    export default {
        props: {
            labelDescription: String,
            value: String,
            options: Array
        },

        data() {
            return {
                hideLabel: false
            }
        },

        watch: {
            value(newValue, oldValue) {
                // If a new value is being passed in props, 
                // re-initialize Material select
                this.$nextTick(() => {
                    $(this.$refs.select).material_select();
                });
            }
        },

        mounted() {
            // Initialize Material select
            $(this.$refs.select).material_select();

            // Temporary way to make initial value
            // on select have gray text color
            $(this.$refs.select).parents('.select-wrapper').find('input.select-dropdown').addClass('grey-text');

            $(this.$refs.select).on('change', () => {
                this.$emit('select',this.$refs.select.value);

                // Show label upon value change
                this.hideLabel = true;

                // Make value on select have
                // black text color
                $(this.$refs.select).parents('.select-wrapper').find('input.select-dropdown').removeClass('grey-text');
            });
        }
    }
</script>
