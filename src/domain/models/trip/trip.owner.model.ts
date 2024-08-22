export class TripOwner {
    tripId: string;
    ownerName: string | null = null;

    constructor(tripId: string) {
        this.tripId = tripId;
    }
}