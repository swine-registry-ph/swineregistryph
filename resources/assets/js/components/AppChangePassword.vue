<template lang="html">
    <div class="col s10 offset-s1">
        <div class="col s12">
            <h4 class="title-page"> Change Password </h4>
        </div>
        
        <div class="col s12">
            <div class="collection">
                <div class="collection-item">
                    <div class="row">
                        <div class="input-field col s4 offset-s4">
                            <input v-model="currentPassword"
                                id="current-password"
                                type="password"
                                class="validate"
                            >
                            <label for="current-password">Current Password</label>
                        </div>

                        <div class="input-field col s4 offset-s4">
                            <input v-model="newPassword"
                                id="new-password"
                                type="password"
                                class="validate"
                            >
                            <label for="new-password">New Password</label>
                        </div>

                        <div class="input-field col s4 offset-s4">
                            <input v-model="reTypeNewPassword"
                                id="re-new-password"
                                type="password"
                                class="validate"
                            >
                            <label for="re-new-password">Re-Type New Password</label>
                        </div>

                        <div class="col s4 offset-s4">
                            <a @click.prevent="changePassword($event)"
                                href="#!"
                                class="right btn z-depth-0 change-password-button"
                            >
                                Change Password
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
        data() {
            return {
                currentPassword: '',
                newPassword: '',
                reTypeNewPassword: ''
            }
        },

        methods: {
            changePassword(event) {
                const changePasswordButton = $('.change-password-button');
                const currentPassword = this.currentPassword;
                const newPassword = this.newPassword;
                const reTypeNewPassword = this.reTypeNewPassword;

                if (!currentPassword && !newPassword && !reTypeNewPassword) {
                    Materialize.toast('Please enter all input details', 2000);
                    return;
                }

                this.disableButtons(changePasswordButton, event.target, 'Changing...');

                // Update to server's database
                axios.patch('/change-password', {
                    currentPassword,
                    newPassword,
                    reTypeNewPassword
                })
                .then((response) => {
                    this.currentPassword = '';
                    this.newPassword = '';
                    this.reTypeNewPassword = '';

                    // Update UI after
                    this.$nextTick(() => {
                        $('#current-password').removeClass('valid');
                        $('#new-password').removeClass('valid');
                        $('#re-new-password').removeClass('valid');

                        this.enableButtons(changePasswordButton, event.target, 'Change Password');

                        Materialize.updateTextFields();
                        Materialize.toast(response.data, 2000, 'green lighten-1');
                    });
                })
                .catch((error) => {
                    this.currentPassword = '';
                    this.newPassword = '';
                    this.reTypeNewPassword = '';

                    // Update UI after
                    this.$nextTick(() => {
                        $('#current-password').removeClass('valid');
                        $('#new-password').removeClass('valid');
                        $('#re-new-password').removeClass('valid');

                        this.enableButtons(changePasswordButton, event.target, 'Change Password');

                        Materialize.updateTextFields();
                        Materialize.toast(error.response.data, 2500);
                    });
                });
            },

            disableButtons(buttons, actionBtnElement, textToShow) {
                buttons.addClass('disabled');
                actionBtnElement.innerHTML = textToShow;
            },

            enableButtons(buttons, actionBtnElement, textToShow) {
                buttons.removeClass('disabled');
                actionBtnElement.innerHTML = textToShow;
            }
        }
    }
</script>

<style scoped>
    .collection-item {
        overflow: auto;
        padding-top: 2rem;
    }
</style>
