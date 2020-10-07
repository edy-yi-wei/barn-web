export class SpkContractor {
    contractorId: 0;
    contractorName: '';
    pics: [];
    contractorPicId: 0;

    constructor(id, name, picId) {
        this.contractorId = id;
        this.contractorName = name;
        this.contractorPicId = picId;
    }
}