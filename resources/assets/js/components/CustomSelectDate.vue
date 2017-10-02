<template lang="html">
    <input type="date" id="delivery-date" name="delivery-date" class="datepicker" ref="select" :value="value"/>
</template>

<script>
    export default {
        props:['value'],
        mounted() {
            // $('.datepicker').pickadate({
            //     min: true,
            //     selectMonths: true,
            //     selectYears: 2,
            //     format: 'mmmm d, yyyy'
            // });

            var self = this;
            $('#delivery-date').on('change', function(){
                self.$emit('date-select',self.$refs.select.value);
            });
        }
    }
</script>
