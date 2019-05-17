export class DossierVIN {
    engine_capacity: string;
    body_type: string;
    fuel_type: string;
    make: string;
    model: string;
    manufacturer_country: string;
    model_year: string;
    url_logo: string;
    constructor(Vin: DossierVIN) {
        this.engine_capacity = Vin.engine_capacity;
        this.body_type = Vin.body_type;
        this.fuel_type = Vin.fuel_type;
        this.make = Vin.make;
        this.model = Vin.model;
        this.manufacturer_country = Vin.manufacturer_country;
        this.model_year = Vin.model_year;
        this.url_logo = Vin.url_logo;
        this.getDispo();
    }
    getDispo(): boolean {
        let state = true;
        if ((this.engine_capacity === '' || !this.engine_capacity) && (this.body_type === '' || !this.body_type) &&
            (this.fuel_type === '' || !this.fuel_type) && (this.manufacturer_country === '' || !this.manufacturer_country)
        ) {
            state = false;
        }
        return state;
    }

}
