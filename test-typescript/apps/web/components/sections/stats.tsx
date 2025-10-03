const stats = [
  { label: 'Active Users', value: '10,000+' },
  { label: 'Uptime', value: '99.9%' },
  { label: 'Response Time', value: '< 100ms' },
  { label: 'Support', value: '24/7' },
];

export function Stats() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-2">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


