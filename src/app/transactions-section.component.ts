import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { injectPublicKey } from '@heavy-duty/wallet-adapter';
import { computedAsync } from 'ngxtension/computed-async';
import { ShyftApiService } from './shyft-api.service';

@Component({
  selector: 'monorepo-transactions-section',
  imports: [MatTableModule, MatCard, DatePipe],
  standalone: true,
  template: `
    <mat-card
      class="w-[500px] px-4 py-8"
      style="background-color: #EEEEEE; border-bottom: 2px solid #7b1fa2;"
    >
      <h2 class="text-center text-3xl mb-4">Historial de Transacciones</h2>

      @if (!transactions()) {
        <p class="text-center">Conecta tu wallet para ver las transacciones.</p>
      } @else if (transactions()?.length === 0) {
        <p class="text-center">No hay transacciones disponibles.</p>
      } @else {
        <table mat-table [dataSource]="transactions() ?? []">
          <ng-container matColumnDef="type">
            <th
              mat-header-cell
              *matHeaderCellDef
              style="background-color: #f0f0f0; color: black; border-bottom: 1px solid #7b1fa2;"
            >
              Type
            </th>
            <td
              mat-cell
              *matCellDef="let element"
              style="background-color: #f0f0f0; color: black; black; border-bottom: 1px solid #7b1fa2;"
            >
              {{ element.type }}
            </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th
              mat-header-cell
              *matHeaderCellDef
              style="background-color: #f0f0f0; color: black; border-bottom: 1px solid #7b1fa2;"
            >
              Status
            </th>
            <td
              mat-cell
              *matCellDef="let element"
              style="background-color: #f0f0f0; color: black; black; border-bottom: 1px solid #7b1fa2;"
            >
              {{ element.status }}
            </td>
          </ng-container>

          <ng-container matColumnDef="timestamp">
            <th
              mat-header-cell
              *matHeaderCellDef
              style="background-color: #f0f0f0; color: black; border-bottom: 1px solid #7b1fa2;"
            >
              Timestamp
            </th>
            <td
              mat-cell
              *matCellDef="let element"
              style="background-color: #f0f0f0; color: black; black; border-bottom: 1px solid #7b1fa2;"
            >
              {{ element.timestamp | date: 'dd/MM/yy' }}
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr
            mat-row
            *matRowDef="let row; columns: displayedColumns"
            style="border-bottom: 1px solid #7b1fa2;"
          ></tr>
        </table>
      }
    </mat-card>
  `,
})
export class TransactionsSectionComponent {
  private readonly _shyftApiService = inject(ShyftApiService);
  private readonly _publicKey = injectPublicKey();

  readonly displayedColumns = ['type', 'status', 'timestamp'];
  readonly transactions = computedAsync(() =>
    this._shyftApiService.getTransactions(this._publicKey()?.toBase58()),
  );
}
