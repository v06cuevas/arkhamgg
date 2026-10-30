ALTER TABLE public.purchases
  ADD COLUMN IF NOT EXISTS purchase_kind text NOT NULL DEFAULT 'productos'
    CHECK (purchase_kind IN ('piezas', 'productos', 'otros')),
  ADD COLUMN IF NOT EXISTS attachment_url text,
  ADD COLUMN IF NOT EXISTS attachment_type text,
  ADD COLUMN IF NOT EXISTS supplier_invoice_number text,
  ADD COLUMN IF NOT EXISTS ncf text,
  ADD COLUMN IF NOT EXISTS itbis numeric(12, 2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS credit_days integer,
  ADD COLUMN IF NOT EXISTS late_penalty_percent numeric(5, 2) DEFAULT 0;

NOTIFY pgrst, 'reload schema';