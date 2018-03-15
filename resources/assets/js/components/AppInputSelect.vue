<template lang="html">
    <div class="">
        <select ref="select" :value="value">
            <option value="" disabled selected> Choose {{ labelDescription }} </option>
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

        mounted() {
            // Initialize Material select
            $(this.$refs.select).material_select();

            // Bind change event to emit new value
            var self = this;

            $(this.$refs.select).on('change', function(){
                self.$emit('select',self.$refs.select.value);

                // Show label upon value change
                self.hideLabel = true;
            });
        }
    }
</script>
