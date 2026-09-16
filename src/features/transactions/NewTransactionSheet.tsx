import { useState } from 'react';
import { Info } from '@phosphor-icons/react';
import type { LedgerRef } from '@/features/ledgers/ledgers';
import { Button } from '@/ui/Button';
import { Field } from '@/ui/Field';
import { Segmented } from '@/ui/Segmented';
import { Sheet } from '@/ui/Sheet';

type TxType = 'gasto' | 'ingreso' | 'ahorro' | 'transferencia';
type SplitMode = 'none' | 'equal' | 'percent' | 'amount';

interface NewTransactionSheetProps {
  open: boolean;
  onClose: () => void;
  ledger: LedgerRef;
}

/**
 * Alta de movimiento.
 *
 * Por ahora es la carcasa del formulario: valida nada y no persiste —eso entra
 * en la fase 4, contra Firestore—. Lo que sí deja fijado es la forma de la
 * pantalla, y en particular que **el reparto se elige acá, en cada
 * movimiento**, y solo aparece en un espacio compartido.
 */
export function NewTransactionSheet({ open, onClose, ledger }: NewTransactionSheetProps) {
  const [type, setType] = useState<TxType>('gasto');
  const [split, setSplit] = useState<SplitMode>('equal');
  const shared = ledger.kind === 'shared';

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Nuevo movimiento"
      subtitle={`${ledger.name} · septiembre 2026`}
      footer={
        <>
          <Button onClick={onClose}>Cancelar</Button>
          <Button variant="primary" onClick={onClose}>
            Guardar movimiento
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Segmented
          label="Tipo de movimiento"
          value={type}
          onChange={setType}
          options={[
            { value: 'gasto', label: 'Gasto' },
            { value: 'ingreso', label: 'Ingreso' },
            { value: 'ahorro', label: 'Ahorro' },
            { value: 'transferencia', label: 'Transferencia' },
          ]}
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 12,
          }}
        >
          <Field label="Monto">
            {(id) => (
              <input id={id} className="input" inputMode="decimal" placeholder="₡0.00" />
            )}
          </Field>
          <Field label="Fecha">
            {(id) => <input id={id} className="input" type="date" defaultValue="2026-09-15" />}
          </Field>
          <Field label="Categoría">
            {(id) => (
              <select id={id} className="select" defaultValue="alimentacion">
                <option value="alimentacion">Alimentación</option>
                <option value="vivienda">Vivienda</option>
                <option value="servicios">Servicios</option>
                <option value="cuidado">Cuidado personal</option>
              </select>
            )}
          </Field>
          <Field label="Cuenta">
            {(id) => (
              <select id={id} className="select" defaultValue="bn">
                <option value="bn">BN Cuenta Colones</option>
                <option value="efectivo">Efectivo</option>
                <option value="bac">Tarjeta BAC Visa</option>
                <option value="sinpe">SINPE Móvil</option>
              </select>
            )}
          </Field>
          <Field label="Medio de pago">
            {(id) => (
              <select id={id} className="select" defaultValue="debito">
                <option value="debito">Débito</option>
                <option value="credito">Crédito</option>
                <option value="efectivo">Efectivo</option>
                <option value="sinpe">SINPE</option>
              </select>
            )}
          </Field>
          <Field label="Quincena" hint="Se sugiere por la fecha; podés cambiarla.">
            {(id) => (
              <select id={id} className="select" defaultValue="1">
                <option value="1">1ª quincena · 1–15</option>
                <option value="2">2ª quincena · 16–30</option>
              </select>
            )}
          </Field>
          <Field label="Descripción" span={2}>
            {(id) => <input id={id} className="input" placeholder="Súper Automercado" />}
          </Field>
        </div>

        {shared && (
          <div
            style={{
              borderTop: '1px solid var(--color-divider)',
              paddingTop: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                flexWrap: 'wrap',
              }}
            >
              <Field label="Pagado por">
                {(id) => (
                  <select id={id} className="select" defaultValue="MR">
                    <option value="MR">María Rodríguez</option>
                    <option value="LS">Luis Salas</option>
                  </select>
                )}
              </Field>
            </div>

            <div>
              <span className="field-label">Cómo se divide</span>
              <Segmented
                label="Cómo se divide"
                value={split}
                onChange={setSplit}
                options={[
                  { value: 'none', label: 'Sin dividir' },
                  { value: 'equal', label: 'Mitad y mitad' },
                  { value: 'percent', label: 'Porcentaje' },
                  { value: 'amount', label: 'Montos exactos' },
                ]}
              />
              <p
                style={{
                  display: 'flex',
                  gap: 6,
                  fontSize: 11,
                  color: 'var(--color-text-faint)',
                  marginTop: 8,
                }}
              >
                <Info size={13} aria-hidden="true" style={{ flex: '0 0 auto', marginTop: 1 }} />
                El saldo lo mueve la cuenta con la que se pagó. El reparto solo
                alimenta el balance entre ustedes.
              </p>
            </div>
          </div>
        )}
      </div>
    </Sheet>
  );
}
