import Any = jasmine.Any;

export interface LocationModel {
    city: string;
    acronym: string;
    country: string;
}

export function mapToCity(locationData: Any[]): LocationModel[] {
    const result: LocationModel[] = [];

    for (const location of locationData) {
        result.push({
            city: location['municipio-nome'],
            acronym: location['UF-sigla'],
            country: "BR",
        });
    }

    return result;
}