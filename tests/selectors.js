export const selectors = {
    header: {
        login: "header__login",
        logout: "header__logout",
        register: "header__register",
    },
    login: {
        username: "login-form__username",
        password: "login-form__password",
        submit: "login-form__submit",
        registerSuccess: "login-form__register_success"
    },
    register: {
        username: "register-form__username",
        password: "register-form__password",
        confirmPassword: "register-form__confirm_password",
        submit: "register-form__submit",
    },
    account: {
        overview: {
            container: "account-page__overview_container",
            header: "account-page__overview_header",
            content: "account-page__overview_content",
        },
        bookings: {
            container: "account-page__bookings_container",
            booking: "account-page__bookings_booking",
            bookingDelete: "account-page__booking_delete",
            addForm: "account-page__bookings_add_form",
            addStartDate: "account-page__bookings_add_start_date",
            addEndDate: "account-page__bookings_add_end_date",
            addSubmit: "account-page__bookings_add_button"
        },
        configuration: {
            container: "account_page__configuration_container"
        }
    },
    formError: {
        container: "form-error",
        content: "form-error__content"
    }
}