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

            $(this.$refs.dateSelect).on('change', () => {
                this.$emit('date-select',this.$refs.dateSelect.value);
            });
        }
    }
</script>
