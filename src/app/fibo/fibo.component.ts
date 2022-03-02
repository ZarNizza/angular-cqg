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
      this.webWorker = new Worker('./webWorker');
      this.webWorker.onmessage = ({ data }) => {
        this.fiboOutput = data;
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
    console.log('fiboNumber=', this.fiboNumber);
    this.webWorker.postMessage(this.fiboNumber);
    // this.output = fibonacci(this.fiboNumber);
  }
}

function fibonacci(num: number): number {
  console.log('fibo ', num);
  if (num == 1 || num == 2) {
    return 1;
  }
  return fibonacci(num - 1) + fibonacci(num - 2);
}
