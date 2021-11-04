export interface ModalData {
    yard: any;
    vehiclePlate: string;
    tripId: VehicleControl;
}

interface FilledCustomField {
    id: number;
    yardStageInstanceId: number;
    name: string;
    value: string;
    createdAt: Date;
    updatedAt: Date;
}
interface StageHistory {
    id: number;
    name: string;
    completedAt: Date;
    customFields: FilledCustomField[];
}

interface Driver {
    id: number;
    fullname: string;
    idCard: string;
}

interface YardStage {
    id: number;
    order: number;
    name: string;
}

interface Vehicle {
    id: number;
    plate: string;
    type: string;
    loadCode: string;
}

export interface VehicleControl {
    tripId: number;
    isCompleted: boolean;
    currentStage: YardStage;
    driver: Driver;
    vehicle: Vehicle;
    customFields: any[];
    history: StageHistory[];
    stages: YardStage[];
}
