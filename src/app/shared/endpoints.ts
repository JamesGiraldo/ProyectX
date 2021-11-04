import { environment } from '../../environments/environment';

const addPagination = (page, elements) => `?pageNumber=${page}&pageElements=${elements}`;
const addPaginationWithDates = (page, elements, start, end) =>
    `${addPagination(page, elements)}&start=${start}&end=${end}`;
const addPaginationWithDatesAndState = (page, elements, start, end, state) =>
    `${addPagination(page, elements)}&start=${start}&end=${end}&state=${state}`;
const addPaginationWithDatesAndYard = (page, elements, start, end, yard) =>
    `${addPagination(page, elements)}&start=${start}&end=${end}&yard=${yard}`;

export const Endpoint = {
    AUTH: {
        LOGIN: environment.apiHost + environment.apiVersion + 'auth/login',
        REFRESH: environment.apiHost + environment.apiVersion + 'auth/refresh',
        RECOVERY_PASSWORD: environment.apiHost + environment.apiVersion + 'auth/send_reset_email',
        SET_PASSWORD: environment.apiHost + environment.apiVersion + 'auth/set_pwd',
    },
    BLACKLIST: {
        BASE: environment.apiHost + environment.apiVersion + 'blacklist',
        PAGINATION: (page, elements) =>
            environment.apiHost + environment.apiVersion + 'blacklist' + addPagination(page, elements),
        SEARCH: (page, elements, filter) =>
            environment.apiHost +
            environment.apiVersion +
            `blacklist` +
            addPagination(page, elements) +
            `&filter=${filter}`,
    },
    COMPANY: {
        BASE: environment.apiHost + environment.apiVersion + 'company',
        ALL_PAGE: (page, elements) =>
            environment.apiHost + environment.apiVersion + 'company' + addPagination(page, elements),
        TRANSPORTER: (page, elements) =>
            environment.apiHost + environment.apiVersion + 'company/transporter' + addPagination(page, elements),
        MUNICIPALITY: (id: number) => environment.apiHost + environment.apiVersion + `company/${id}/municipality`,
        RELATION: {
            BASE: environment.apiHost + environment.apiVersion + 'generator_transporter_relation',
            GET_BY_COMPANY: (page, elements) =>
                environment.apiHost +
                environment.apiVersion +
                'generator_transporter_relation' +
                addPagination(page, elements),
        },
        BLOCKAGE: environment.apiHost + environment.apiVersion + 'company/temporary_block',
        VALIDATION_REPORTS: (id) => environment.apiHost + environment.apiVersion + `generator-configuration/${id}`,
        VALIDATION_YEAR: (id) => environment.apiHost + environment.apiVersion + `gen-configuration-general/${id}`,
        UPDATE_VALIDATION_YEAR: (id) =>
            environment.apiHost + environment.apiVersion + `gen-configuration-general/${id}/company`,
    },
    CUSTOM_FIELD: {
        BASE: environment.apiHost + environment.apiVersion + 'custom_field',
        ALL: (page, elements) =>
            environment.apiHost + environment.apiVersion + 'custom_field' + addPagination(page, elements),
        MODULE: (mod) => environment.apiHost + environment.apiVersion + `custom_field/module/${mod}`,
        STAGE: (id) => environment.apiHost + environment.apiVersion + `company/${id}/yard/stages`,
    },
    DRIVER: {
        BASE: environment.apiHost + environment.apiVersion + 'driver',
        ALL: (page, elements) =>
            environment.apiHost + environment.apiVersion + 'driver' + addPagination(page, elements),
        NON_RELATED: (page, elements) =>
            environment.apiHost + environment.apiVersion + 'driver/non_related' + addPagination(page, elements),
        FILE: (id) => environment.apiHost + environment.apiVersion + `driver/${id}/file`,
        DELETE_FILE: (id) => environment.apiHost + environment.apiVersion + `driver-file/${id}`,
        SEARCH_NON_RELATED: (data, page, elements) =>
            environment.apiHost +
            environment.apiVersion +
            `driver/search_non_related/${data}` +
            addPagination(page, elements),
        SEARCH: (page, elements) =>
            environment.apiHost + environment.apiVersion + `driver/search` + addPagination(page, elements),
        ALL_HEALTH: environment.apiHost + environment.apiVersion + 'health-entity',
        ALL_RISK: environment.apiHost + environment.apiVersion + 'risk-manager',
    },
    FARE: {
        BASE: environment.apiHost + environment.apiVersion + 'fare',
        BY_TRANSPORTER: (id) => `${environment.apiHost}${environment.apiVersion}` + `fare/by_transporter/${id}`,
        ALL: (page, elements) => environment.apiHost + environment.apiVersion + 'fare' + addPagination(page, elements),
        SUBSCRIPTION: environment.apiHost + environment.apiVersion + 'fare_subscription',
        GET_LOCATIONS: (id) => environment.apiHost + environment.apiVersion + `fare/${id}/origins_and_destinies`,
        ADD_TRANSPORTER: (id) => environment.apiHost + environment.apiVersion + `fare/${id}/transporter/`,
        REMOVE_TRANSPORTER_FARE: (id) => environment.apiHost + environment.apiVersion + `fare/by_transporter/${id}`,
        MASSIVE: environment.apiHost + environment.apiVersion + 'fare/massive',
        MASSIVE_UPLOAD: environment.apiHost + environment.apiVersion + 'fare/massive/upload',
        MASSIVE_RELATIONS: environment.apiHost + environment.apiVersion + 'fare/massive/relations',
    },
    INTERVENTED_ROUTE: {
        BASE: environment.apiHost + environment.apiVersion + 'intervented_route',
    },
    OFFER: {
        BASE: environment.apiHost + environment.apiVersion + 'offer',
        DELETE_OFFER: (id: number) => environment.apiHost + environment.apiVersion + `offer/${id}`,
    },
    PUBLICATION: {
        BASE: environment.apiHost + environment.apiVersion + 'publication',
        ALL: (page, elements, start, end) =>
            environment.apiHost +
            environment.apiVersion +
            'publication' +
            addPaginationWithDates(page, elements, start, end),
        MASSIVE: environment.apiHost + environment.apiVersion + 'publication/massive',
        MASSIVE_UPLOAD: environment.apiHost + environment.apiVersion + 'publication/massive/upload',
        MASSIVE_RELATIONS: environment.apiHost + environment.apiVersion + 'publication/massive/relations',
        HISTORY: (page, elements, start, end) =>
            environment.apiHost +
            environment.apiVersion +
            'publication/history' +
            addPaginationWithDates(page, elements, start, end),
        COLUMNS: (id, type) => environment.apiHost + environment.apiVersion + `user/${id}/column_display?type=${type}`,
        SET_COLUMNS: (id) => environment.apiHost + environment.apiVersion + `user/${id}/column_display`,
        PUBLICATION_COLUMNS: (page, elements, start, end, state) =>
            environment.apiHost +
            environment.apiVersion +
            'publication/apply_column_display' +
            addPaginationWithDatesAndState(page, elements, start, end, state),
        SEARCH_PUBLICATION: (page, elements, start, end, state) =>
            environment.apiHost +
            environment.apiVersion +
            'publication/search/apply_column_display' +
            addPaginationWithDatesAndState(page, elements, start, end, state),

        SEARCH_HISTORY: (page, elements, start, end) =>
            environment.apiHost +
            environment.apiVersion +
            'publication/search/history' +
            addPaginationWithDates(page, elements, start, end),
        FINISHED_LOAD: (id: number) =>
            environment.apiHost + environment.apiVersion + `publication/${id}/end_publication`,
        CANCEL_LOAD: (id: number) =>
            environment.apiHost + environment.apiVersion + `publication/${id}/cancel_publication`,
        DELETE_ORIGIN: (id: number) => environment.apiHost + environment.apiVersion + `publication/origin/${id}`,
        DELETE_DESTINY: (id: number) => environment.apiHost + environment.apiVersion + `publication/destiny/${id}`,
        DOWNLOAD: (page, elements, start, end) =>
            environment.apiHost +
            environment.apiVersion +
            'publication/history/file' +
            addPaginationWithDates(page, elements, start, end),
        CREATE_AS_TRANSPORTER: environment.apiHost + environment.apiVersion + 'publication/transporter',
    },
    QUIZ: {
        QUESTIONS: (id) => environment.apiHost + environment.apiVersion + `quiz/${id}/company`,
        CREATE_QUIZ: environment.apiHost + environment.apiVersion + 'driver-quiz',
        UPDATE_QUIZ: (id) => environment.apiHost + environment.apiVersion + `driver-quiz/${id}`,
        SEND_QUIZ: (quizId) => environment.apiHost + environment.apiVersion + `driver-quiz-answer/${quizId}/quiz`,
    },
    REPORT: {
        BASE: environment.apiHost + environment.apiVersion + 'report',
        BLOCKAGE: (id) => environment.apiHost + environment.apiVersion + `report/${id}/status/no_temporary_block`,
    },
    TRIP: {
        BASE: environment.apiHost + environment.apiVersion + 'trip',
        ALL: (page, elements, start, end) =>
            environment.apiHost + environment.apiVersion + 'trip' + addPaginationWithDates(page, elements, start, end),
        ALL_DESTINY: (id) => environment.apiHost + environment.apiVersion + `trip/${id}/destiny_arrivals`,
        ALL_ORIGIN: (id) => environment.apiHost + environment.apiVersion + `trip/${id}/origin_arrivals`,
        REPORT: (id) => environment.apiHost + environment.apiVersion + `trip/${id}/status_report`,
        TRAZABILITY: (id) => environment.apiHost + environment.apiVersion + `trip/${id}/trazability`,
        SEARCH: (page, elements, start, end) =>
            environment.apiHost +
            environment.apiVersion +
            'trip/search/apply_column_display' +
            addPaginationWithDates(page, elements, start, end),
        SEARCH_COMPLIMENT: (page, elements, start, end) =>
            environment.apiHost +
            environment.apiVersion +
            'trip/search/apply_column_display_compliment' +
            addPaginationWithDates(page, elements, start, end),
        TRIP_COLUMNS: (page, elements, start, end) =>
            environment.apiHost +
            environment.apiVersion +
            'trip/apply_column_display' +
            addPaginationWithDates(page, elements, start, end),
        COMPLETED: (page, elements, start, end) =>
            environment.apiHost +
            environment.apiVersion +
            'trip/apply_column_display_compliment' +
            addPaginationWithDates(page, elements, start, end),
        VEHICLE_FILES: (plate: string, page: number, elements: number) =>
            environment.apiHost +
            environment.apiVersion +
            `vehicle/${plate}/plate_vehicle` +
            addPagination(page, elements),
        DRIVER_FILES: (id_card: string, page: number, elements: number) =>
            environment.apiHost + environment.apiVersion + `driver/${id_card}/id_card` + addPagination(page, elements),
        DOWNLOAD: (page, elements, start, end) =>
            environment.apiHost +
            environment.apiVersion +
            'trip/history/file' +
            addPaginationWithDates(page, elements, start, end),
        VERIFY_FILE: (id) => environment.apiHost + environment.apiVersion + `trip/${id}/verify_files`,
    },
    USER: {
        BASE: environment.apiHost + environment.apiVersion + 'user',
        ALL: (page, elements) => environment.apiHost + environment.apiVersion + 'user' + addPagination(page, elements),
        CONFIG_AA: (id) => environment.apiHost + environment.apiVersion + `user/${id}/aa_config`,
        CONFIG_EMAIL: (id) => environment.apiHost + environment.apiVersion + `user/${id}/email_config`,
        RIGHT_TO_SEE_BASE: environment.apiHost + environment.apiVersion + 'right_to_see',
        RIGHT_TO_SEE: (id) => environment.apiHost + environment.apiVersion + `user/${id}/right_to_see`,
    },
    VEHICLE: {
        BASE: environment.apiHost + environment.apiVersion + 'vehicle',
        PLATE: environment.apiHost + environment.apiVersion + 'vehicle/plate' + addPagination(0, 0),
        CURRENT_DRIVER: (plate) => environment.apiHost + environment.apiVersion + `vehicle/${plate}/current_driver`,
        CAPACITY: (plate) => environment.apiHost + environment.apiVersion + `vehicle/${plate}/capacity`,
        TYPE: environment.apiHost + environment.apiVersion + 'vehicle_type',
        ALL: (page, elements) =>
            environment.apiHost + environment.apiVersion + 'vehicle' + addPagination(page, elements),
        FILE: (id) => environment.apiHost + environment.apiVersion + `vehicle/${id}/file`,
        DELETE_FILE: (id) => environment.apiHost + environment.apiVersion + `vehicle-file/${id}`,
        ASSIGN_DRIVER: (vehicleId, driverId) =>
            environment.apiHost + environment.apiVersion + `vehicle/${vehicleId}/add_driving_record/${driverId}`,
        SEARCH: (page, elements) =>
            environment.apiHost + environment.apiVersion + `vehicle/search` + addPagination(page, elements),
    },
    YARD: {
        BASE: environment.apiHost + environment.apiVersion + 'yard',
        TRACKING: environment.apiHost + environment.apiVersion + 'yard/tracking',
        VECHILES: (page, elements) =>
            environment.apiHost + environment.apiVersion + 'yard/vehicles' + addPagination(page, elements),
        STAGE: (id) => environment.apiHost + environment.apiVersion + `yard/${id}/stages`,
        STAGES_WITH_VEHICLE_COUNT: (id) => environment.apiHost + environment.apiVersion + `yard/${id}/stages/capacity`,
        YARD_STAGE: (id) => environment.apiHost + environment.apiVersion + `yard_stage/${id}`,
        EXAMINE_CURRENT_STAGES: (id, searchQuery) =>
            environment.apiHost + environment.apiVersion + `yard/${id}/control/${searchQuery}`,
        REPORT: (id, searchQuery) =>
            environment.apiHost + environment.apiVersion + `yard/${id}/control/${searchQuery}/report`,
        SEARCH_YARD: environment.apiHost + environment.apiVersion + `yard/search`,
        SHIFT: (page, elements, start, end, yard) =>
            environment.apiHost +
            environment.apiVersion +
            'yard-shifts' +
            addPaginationWithDatesAndYard(page, elements, start, end, yard),
        SHIFT_RESCHEDULE: (id) => environment.apiHost + environment.apiVersion + `yard-shifts/${id}`,
        FORM_INSPECTION: environment.apiHost + environment.apiVersion + 'form',
        FORM_INSPECTION_RESPONSE: environment.apiHost + environment.apiVersion + 'form-response',
        FORM_INSPECTION_FILE: (id) => environment.apiHost + environment.apiVersion + `form-response/${id}/file`,
        FORM_HEADER: (id) => environment.apiHost + environment.apiVersion + `trip/${id}/form`,
        FORM_INSPECTION_RESPONSES: (id) => environment.apiHost + environment.apiVersion + `form-response/${id}/trip`,
    },
    YARD_STAGE: {
        VEHICLES_ON_STAGE: (id) => environment.apiHost + environment.apiVersion + `yard_stage/${id}/vehicles`,
    },
    YARD_REPORTS: {
        REPORTS: (page, elements, start, end) =>
            environment.apiHost +
            environment.apiVersion +
            `yard/reports` +
            addPaginationWithDates(page, elements, start, end),
        REPORTS_VEHICLES: (page, elements, start, end) =>
            environment.apiHost +
            environment.apiVersion +
            `yard/countVehicles` +
            addPaginationWithDates(page, elements, start, end),
        YARDSIDTAGES: environment.apiHost + environment.apiVersion + `yard/stages`,
        YARDSTAGESAVERAGES: (page, elements, start, end) =>
            environment.apiHost +
            environment.apiVersion +
            `yard/stages/averages` +
            addPaginationWithDates(page, elements, start, end),
    },
};
