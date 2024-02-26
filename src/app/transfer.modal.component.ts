import { Component } from '@angular/core';
import { createTransferInstructions } from '@heavy-duty/spl-utils';
import { injectTransactionSender } from '@heavy-duty/wallet-adapter';
import {
  TransferFormComponent,
  transferFormPayLoad,
} from './transfer-form.component';

@Component({
  selector: 'monorepo-transfer-modal',
  template: `
    <div class="px-8 pt-16 pb-8">
      <!-- Corregir estilo -->
      <h2 class="text-3xl text-center mb-8">Trasnferir fondos</h2>
      <monorepo-transfer-form
        (submitForm)="onTransfer($event)"
      ></monorepo-transfer-form>
    </div>
  `,
  standalone: true,
  imports: [TransferFormComponent],
})
export class TransferModalComponent {
  private readonly _transactionSender = injectTransactionSender();

  onTransfer(payload: transferFormPayLoad) {
    this._transactionSender
      .send(({ publicKey }) =>
        createTransferInstructions({
          amount: payload.amount * 10 ** 9,
          mintAddress: '7EYnhQoR9YM3N7UoaKRoA44Uy8JeaZV3qyouov87awMs', //ponerlo en enviroments
          receiverAddress: payload.receiverAddres,
          senderAddress: publicKey.toBase58(),
          fundReceiver: true,
          memo: payload.memo,
        }),
      )
      .subscribe({
        next: (signature) => console.log(`Firma: ${signature}`),
        error: (error) => console.error(error),
        complete: () => console.log('Transferencia completada'),
      });
  }
}
