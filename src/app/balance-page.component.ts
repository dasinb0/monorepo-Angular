import { Component } from '@angular/core';
import { BalanceSectionComponent } from './balance-section.component';
import { TransactionsSectionComponent } from './transactions-section.component';

@Component({
  selector: 'monorepo-balance-page',
  template: `
    <div class="flex justify-center gap-4">
      <monorepo-balance-section></monorepo-balance-section>

      <monorepo-transactions-section></monorepo-transactions-section>
    </div>
  `,
  standalone: true,
  imports: [BalanceSectionComponent, TransactionsSectionComponent],
})
export class BalancePageComponent {}
