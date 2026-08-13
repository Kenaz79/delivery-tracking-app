const STATUS_STYLES = {
  pending: { label: 'Pending', dot: 'bg-muted', text: 'text-muted' },
  accepted: { label: 'Accepted', dot: 'bg-gold', text: 'text-gold' },
  in_transit: { label: 'In transit', dot: 'bg-violet-400', text: 'text-violet-400' },
  delivered: { label: 'Delivered', dot: 'bg-success', text: 'text-success' },
  cancelled: { label: 'Cancelled', dot: 'bg-danger', text: 'text-danger' },
};

export default function StatusChip({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${s.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}
