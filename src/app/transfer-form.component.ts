import { Component, EventEmitter, Output, input } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';

export interface TransferFormModel {
  memo: string | null;
  amount: number | null;
  receiverAddres: string | null;
  mintAddres: string | null;
  token: {
    address: string;
    balance: number;
    info: {
      image: string;
      name: string;
      symbol: string;
    };
  } | null;
}

export interface transferFormPayLoad {
  memo: string;
  amount: number;
  receiverAddres: string;
  token: {
    address: string;
    balance: number;
    info: {
      image: string;
      name: string;
      symbol: string;
    };
  };
}

@Component({
  selector: 'monorepo-transfer-form',
  template: `
    <form #form="ngForm" class="w-[400px]" (ngSubmit)="onSubmitForm(form)">
      <mat-form-field class="w-full mb-4">
        <mat-label>Moneda</mat-label>
        <mat-select
          [(ngModel)]="model.token"
          name="token"
          required
          #tokenControl="ngModel"
        >
          @for (token of tokens(); track token) {
            <mat-option [value]="token.address">
              <div class="flex items-center gap-2">
                <img [src]="token.info.image" class="rounded-full w-8 h-8" />
                <span> {{ token.info.symbol }} - {{ token.balance }}</span>
              </div>
            </mat-option>
          }
        </mat-select>

        @if (form.submitted && tokenControl.errors) {
          <mat-error>
            @if (tokenControl.errors['required']) {
              La moneda es obligatoria.
            }
          </mat-error>
        } @else {
          <mat-hint>Que moneda desea transferir?</mat-hint>
        }
      </mat-form-field>

      <mat-form-field appearance="fill" class="w-full mb-4">
        <mat-label>Concepto</mat-label>
        <input
          name="memo"
          matInput
          type="text"
          placeholder="Abonar Servicios"
          [(ngModel)]="model.memo"
          required
          #memoControl="ngModel"
        />

        <mat-icon matSuffix>description</mat-icon>

        @if (form.submitted && memoControl.errors) {
          <mat-error>
            @if (memoControl.errors['required']) {
              El motivo es obligatorio.
            }
          </mat-error>
        } @else {
          <mat-hint>Debe ser el motivo de la transferencia.</mat-hint>
        }
      </mat-form-field>

      <mat-form-field appearance="fill" class="w-full mb-4">
        <mat-label>Destino</mat-label>
        <input
          name="receiverAddress"
          matInput
          type="text"
          placeholder="Public key wallet destino"
          [(ngModel)]="model.receiverAddres"
          required
          #receiverAddressControl="ngModel"
        />

        <mat-icon matSuffix>key</mat-icon>

        @if (form.submitted && receiverAddressControl.errors) {
          <mat-error>
            @if (receiverAddressControl.errors['required']) {
              El destinatario es obligatorio.
            }
          </mat-error>
        } @else {
          <mat-hint>Debe ser una wallet de Solana.</mat-hint>
        }
      </mat-form-field>

      <mat-form-field appearance="fill" class="w-full mb-4">
        <mat-label>Monto</mat-label>
        <input
          name="amount"
          matInput
          type="number"
          min="0"
          placeholder="Ingresar Monto"
          [(ngModel)]="model.amount"
          required
          #amountControl="ngModel"
          [max]="tokenControl.value?.balance ?? undefined"
        />

        <mat-icon matSuffix>attach_money</mat-icon>

        @if (form.submitted && amountControl.errors) {
          <mat-error>
            @if (amountControl.errors['required']) {
              El monto es obligatorio.
            } @else if (amountControl.errors['min']) {
              El monto debe ser mayor a 0.
            } @else if (amountControl.errors['max']) {
              El monto debe ser menor a {{ tokenControl.value.balance }}.
            }
          </mat-error>
        } @else {
          <mat-hint>Ingresa el monto a enviar</mat-hint>
        }
      </mat-form-field>

      <footer class="flex justify-center">
        <button type="submit" mat-raised-button color="primary">Enviar</button>
      </footer>
    </form>
  `,
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInput,
    MatIcon,
    MatButton,
    MatSelect,
    MatOption,
  ],
})
export class TransferFormComponent {
  readonly model: TransferFormModel = {
    memo: null,
    amount: null,
    receiverAddres: null,
    mintAddres: null,
    token: null,
  };

  readonly tokens = input<
    {
      address: string;
      balance: number;
      info: { name: string; symbol: string; image: string };
    }[]
  >([]);

  @Output() readonly submitForm = new EventEmitter<transferFormPayLoad>();

  onSubmitForm(form: NgForm) {
    if (
      form.invalid ||
      this.model.amount === null ||
      this.model.memo === null ||
      this.model.receiverAddres === null ||
      this.model.token === null
    ) {
      console.error('Formulario no válido');
    } else {
      this.submitForm.emit({
        amount: this.model.amount,
        memo: this.model.memo,
        receiverAddres: this.model.receiverAddres,
        token: this.model.token,
      });
    }
  }
}
