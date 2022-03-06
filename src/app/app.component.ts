import { Component, OnInit, Output } from '@angular/core';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  RefreshCellsParams,
} from 'ag-grid-community';
import type { ContractBook } from './types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  tickProcessor!: Worker;

  gridApi!: GridApi;
  gridRef!: GridReadyEvent | null;
  onGridReady = (gridReadyEvent: any) => {
    this.gridRef = gridReadyEvent;
    this.gridApi = gridReadyEvent.api;
  };

  title = 'Q-q!';

  hideWMAflag = false;
  hideWMAhandler() {
    this.hideWMAflag = !this.hideWMAflag;
    this.gridApi.setColumnDefs(this.columnDefs);
    // this.gridApi.refreshCells();
  }
  columnDefs: ColDef[] = [
    {
      field: 'name',
      width: 150,
      minWidth: 100,
      maxWidth: 300,
      resizable: true,
    },
    {
      field: 'price',
      type: 'rightAligned',
      width: 150,
      minWidth: 100,
      maxWidth: 300,
      resizable: true,
    },
    {
      field: 'wma',
      type: 'rightAligned',
      width: 150,
      minWidth: 100,
      maxWidth: 300,
      resizable: true,
      hide: this.hideWMAflag,
    },
  ];
  rowData = [{ name: 'ABC', price: 0, wma: 0 }];

  ngOnInit(): void {
    this.gridRef = null;
    this.viewGrid();
  }

  viewGrid(): void {
    if (typeof Worker !== 'undefined') {
      this.tickProcessor = new Worker(
        new URL('./tickProcessor.worker', import.meta.url)
      );
      this.tickProcessor.onmessage = (evt: MessageEvent) => {
        // if (typeof this.gridRef === 'undefined' || this.gridRef === null) {
        //   return;
        // } else {
        this.gridRef?.api.setRowData(
          Object.entries(evt.data as ContractBook).map((c) => {
            return {
              name: c[1].n,
              price: c[1].cp.toFixed(4),
              wma:
                c[1].cp > 0
                  ? ((c[1].wma.p * 100) / c[1].cp).toFixed(2) + '%'
                  : '0',
            };
          })
        );
        return;
        // }
      };
      return;
    }
    return;
  }
}
