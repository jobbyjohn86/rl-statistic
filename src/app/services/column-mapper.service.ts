import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ColumnMapperService {

    private columnMap: { [key: string]: string } = {};

    setColumnMappings(mappings: { dataField: string, caption: string }[]): void {
        this.columnMap = {};
        mappings.forEach(mapping => {
            this.columnMap[mapping.dataField] = mapping.caption || mapping.dataField;
        });
    }

    getMappedColumnName(column: string): string {
        return this.columnMap[column] || column;
    }

    // getMappedData(data: any[], mappings: { dataField: string, caption: string }[]): any[] {
    //     return data.map(item => {
    //         let mappedItem = {};
    //         Object.keys(item).forEach(key => {
    //             const mappedKey = this.getMappedColumnName(key);
    //             if (item.hasOwnProperty(key)) {
    //                 mappedItem[mappedKey] = item[key];
    //             }
    //         });
    //         return mappedItem;
    //     });
    // }

    getMappedData(data: any[], mappings: { dataField: string, caption: string }[]): any[] {
        return data.map(item => {
            let mappedItem = {};
            Object.keys(item).forEach(key => {
                const mappedKey = this.getMappedColumnName(key);
                mappedItem[mappedKey] = item[key];
            });
            return mappedItem;
        });
    }


    getMappedColumns(mappings: { dataField: string, caption: string }[]): string[] {
        return mappings.map(mapping => this.getMappedColumnName(mapping.dataField));
    }

}
