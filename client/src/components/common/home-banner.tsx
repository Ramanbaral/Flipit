export function HomeBanner() {
  return (
    <div className="rounded-xl border border-border bg-gradient-to-br from-blue-50 to-indigo-100 px-10 py-10 shadow-sm ">
      <h1 className="text-4xl font-extrabold leading-tight text-foreground">
        Find your next{' '}
        <span className="text-primary">treasure</span>
        {' '}today.
      </h1>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
        Join the most trusted secondhand marketplace. Secure transactions, verified sellers,
        and amazing finds.
      </p>
    </div>
  );
}
