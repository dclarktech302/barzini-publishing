import PinUpdateForm from '@/components/features/settings/PinUpdateForm'

export default function SettingsPage() {
  return (
    <div className="max-w-sm">
      <h1 className="text-2xl font-semibold text-white">Settings</h1>
      <p className="mt-1 text-sm mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>
        Manage your account and PIN.
      </p>

      <div
        className="rounded-xl p-6"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <h2 className="text-sm font-semibold text-white mb-5">Change PIN</h2>
        <PinUpdateForm />
      </div>
    </div>
  )
}
