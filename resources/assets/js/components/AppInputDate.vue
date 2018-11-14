<template lang="html">
    <input type="date" name="date" class="datepicker" ref="dateSelect" :value="value"/>
</template>

<script>
    export default {
        props: {
            value: String,
            min: Boolean
        },

        mounted() {

            const customMinimun = (this.min) ? true : false;

            // Initialize datepicker
            $(this.$refs.dateSelect).pickadate({
                min: customMinimun,
                max: (customMinimun) ? false: true,
                selectMonths: true,
                selectYears: 3,
                format: 'mmmm d, yyyy'
            });

            $(this.$refs.dateSelect).on('change', () => {
                this.$emit('date-select',this.$refs.dateSelect.value);
            });
        }
    }
</script>
