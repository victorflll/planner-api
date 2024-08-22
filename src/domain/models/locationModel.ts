import Any = jasmine.Any;

export interface LocationModel {
    city: string;
    acronym: string;
}

export function mapToCity(locationData: Any[]): LocationModel[] {
    const result: LocationModel[] = [];

    for (const location of locationData) {
        result.push({
            city: location['municipio-nome'],
            acronym: location['UF-sigla'],
        });
    }

    return result;
}