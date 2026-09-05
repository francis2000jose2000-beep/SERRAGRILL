export function WeeklyMenuSection() {
  const weeklyMenu = [
    { day: 'Segunda-feira', dish: 'Bife de Atum Braseado', price: '18.00 €', desc: 'Com sementes de sésamo e puré de batata doce.' },
    { day: 'Terça-feira', dish: 'Arroz de Pato à Antiga', price: '14.00 €', desc: 'Com enchidos da região e gratinado no forno a lenha.' },
    { day: 'Quarta-feira', dish: 'Bacalhau com Broa', price: '16.00 €', desc: 'Lombo de bacalhau envolto em broa de milho estaladiça.' },
    { day: 'Quinta-feira', dish: 'Cabrito Assado', price: '22.00 €', desc: 'Assado lentamente, acompanhado com batata miúda e grelos.' },
    { day: 'Sexta-feira', dish: 'Polvo à Lagareiro', price: '19.50 €', desc: 'Regado em azeite novo, alho e acompanhado com batata a murro.' },
    { day: 'Sábado', dish: 'Posta Mirandesa', price: '24.00 €', desc: 'Naco de vitela na brasa com flor de sal e esparregado.' },
  ];

  return (
    <section id="ementa-semanal" className="py-24 px-6 bg-[#FAF8F5] text-[#141210]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#141210]">
            Ementa Semanal
          </h2>
          <p className="text-[#A88849] font-serif italic text-lg">
            As sugestões do nosso Chef para cada dia da semana.
          </p>
        </div>

        <div className="space-y-8">
          {weeklyMenu.map((item, idx) => (
            <div key={idx} className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#EAE6DF] pb-4 group">
              <div className="flex-1">
                <span className="text-sm uppercase tracking-widest text-[#A88849] font-bold block mb-1">
                  {item.day}
                </span>
                <h3 className="text-xl font-serif font-bold group-hover:text-[#A88849] transition-colors">
                  {item.dish}
                </h3>
                <p className="text-[#5A554C] text-sm mt-1">{item.desc}</p>
              </div>
              <div className="mt-2 md:mt-0 pl-0 md:pl-4">
                <span className="text-lg font-bold text-[#141210] whitespace-nowrap">
                  {item.price}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
