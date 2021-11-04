export class Inspection {
    public id?: number;
    public name?: string;
    /* vehicle */
    public transporter?: string;
    public plate?: string;
    public model?: string;
    public brand?: string;
    public ton?: number;
    public num_property?: number;
    public num_soat?: string;
    public date_expired_soat?: string;
    public num_review?: string;
    public date_expired_review?: string;
    public type_vehicle?: string;
    /* driver */
    public fullname?: string;
    public cc?: string;
    public date_license?: string;
    public num_license?: string;
    public category?: string;
    public phone?: string;
    public eps?: string;
    public arl?: string;
    public pension_plan?: string;
    public emergency_contact?: string;
    public phone_emergency_contact?: string;
}
