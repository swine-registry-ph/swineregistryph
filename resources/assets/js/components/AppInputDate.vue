<template lang="html">
    <input type="date" name="date" class="datepicker" ref="dateSelect" :value="value"/>
</template>

<script>
    export default {
        props: {
            value: String
        },

        mounted() {
            // Initialize datepicker
            $(this.$refs.dateSelect).pickadate({
                max: true,
                selectMonths: true,
                selectYears: 3,
                format: 'mmmm d, yyyy'
            });

            // Bind change event to emit new value
            var self = this;

            $(this.$refs.dateSelect).on('change', function(){
                self.$emit('date-select',self.$refs.dateSelect.value);
            });
        }
    }
</script>
