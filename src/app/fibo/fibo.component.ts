import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-fibo',
  templateUrl: './fibo.component.html',
  styleUrls: ['./fibo.component.scss'],
})
export class FiboComponent {
  @Input() fiboTitle!: string;
  fiboNumber!: number;
  output!: number;

  calc_Fibo() {
    console.log('fiboNumber=', this.fiboNumber);
    this.output = fibonacci(this.fiboNumber);
  }
}

function fibonacci(num: number): number {
  console.log('fibo ', num);
  if (num == 1 || num == 2) {
    return 1;
  }
  return fibonacci(num - 1) + fibonacci(num - 2);
}
