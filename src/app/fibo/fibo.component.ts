import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-fibo',
  templateUrl: './fibo.component.html',
  styleUrls: ['./fibo.component.scss'],
})
export class FiboComponent implements OnInit {
  @Input() fiboTitle!: string;
  fiboNumber!: number;
  fiboOutput!: number;
  webWorker!: Worker;

  ngOnInit() {
    if (typeof Worker !== 'undefined') {
      this.webWorker = new Worker(
        new URL('./../web-worker.worker', import.meta.url)
      );
      this.webWorker.onmessage = (evt: MessageEvent) => {
        this.fiboOutput = evt.data;
      };
      this.webWorker.onerror = (err) => {
        console.log(
          '! WebWorker Error ! ',
          `${err.filename}:${err.lineno} ${err.message}`
        );
      };
    }
  }

  calc_Fibo() {
    this.webWorker.postMessage(this.fiboNumber);
  }
}
