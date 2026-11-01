const MARKS = [
  {
    id: 'visa',
    label: 'Visa',
    render: (
      <span className="text-[15px] font-black italic tracking-[-0.5px]" style={{ color: '#1A1F71' }}>
        VISA
      </span>
    ),
  },
  {
    id: 'mastercard',
    label: 'Mastercard',
    render: (
      <span className="flex items-center gap-1.5">
        <span className="relative flex h-4 w-7 items-center">
          <span className="absolute start-0 h-4 w-4 rounded-full" style={{ background: '#EB001B' }} />
          <span className="absolute end-0 h-4 w-4 rounded-full opacity-90" style={{ background: '#F79E1B' }} />
        </span>
        <span className="text-[10px] font-bold tracking-tight text-[#1f1f1f]">mastercard</span>
      </span>
    ),
  },
  {
    id: 'meeza',
    label: 'Meeza',
    render: (
      <span className="flex items-center gap-1">
        <span className="text-[15px] font-black lowercase tracking-tight" style={{ color: '#6B2C91' }}>
          meeza
        </span>
        <span className="flex flex-col gap-[2px]">
          <span className="h-1 w-1 rounded-full bg-[#E21D1D]" />
          <span className="h-1 w-1 rounded-full bg-[#F5A623]" />
          <span className="h-1 w-1 rounded-full bg-[#2E7D32]" />
        </span>
      </span>
    ),
  },
  {
    id: 'paypal',
    label: 'PayPal',
    render: (
      <span className="text-[13px] font-black italic tracking-[-0.4px]">
        <span style={{ color: '#003087' }}>Pay</span>
        <span style={{ color: '#009CDE' }}>Pal</span>
      </span>
    ),
  },
  {
    id: 'fawry',
    label: 'Fawry',
    render: (
      <span className="flex items-center gap-1">
        <span className="flex h-5 w-5 items-center justify-center rounded-[5px] bg-[#FFC20E] text-[10px] font-black text-[#111]">
          f
        </span>
        <span className="text-[12px] font-black lowercase tracking-tight text-[#111]">fawry</span>
      </span>
    ),
  },
];

export function PaymentMarks() {
  return (
    <ul className="flex flex-wrap items-center gap-2" aria-label="Accepted payment methods">
      {MARKS.map((mark) => (
        <li
          key={mark.id}
          title={mark.label}
          aria-label={mark.label}
          className="flex h-9 min-w-[74px] items-center justify-center rounded-lg border border-black/5 bg-white px-3 shadow-sm"
        >
          {mark.render}
        </li>
      ))}
    </ul>
  );
}
