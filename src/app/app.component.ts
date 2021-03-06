import { Component, OnInit, Output } from '@angular/core';
import { ColDef, ColumnApi, GridApi, GridReadyEvent } from 'ag-grid-community';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  tickProcessor!: Worker;

  gridRef!: GridReadyEvent | null;
  gridApi!: GridApi;
  columnApi!: ColumnApi;
  onGridReady = (gridReadyEvent: any) => {
    this.gridRef = gridReadyEvent;
    this.gridApi = gridReadyEvent.api;
    this.columnApi = gridReadyEvent.columnApi;
  };

  title = 'CQG-Angular';

  hideWMAflag = true;
  agGridAngular: any;
  hideWMAhandler() {
    this.hideWMAflag = !this.hideWMAflag;
    this.columnApi.setColumnVisible('wma', this.hideWMAflag);
    this.gridApi.sizeColumnsToFit();
  }
  columnDefs: ColDef[] = [
    {
      field: 'name',
      width: 100,
      minWidth: 80,
      maxWidth: 300,
      resizable: true,
    },
    {
      field: 'price',
      type: 'rightAligned',
      width: 100,
      minWidth: 100,
      maxWidth: 300,
      resizable: true,
      suppressSizeToFit: true,
    },
    {
      field: 'wma',
      type: 'rightAligned',
      width: 90,
      minWidth: 90,
      maxWidth: 300,
      resizable: true,
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
        this.gridRef?.api.setRowData(evt.data);
        return;
      };
      return;
    }
    return;
  }
}
