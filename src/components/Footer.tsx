export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-10 px-6 text-sm">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-[#D14437] font-bold mb-2">Serra&amp;Grill</h3>
          <p className="text-xs text-slate-500">Especialidades grelhadas e culinária tradicional.</p>
        </div>
        <div>
          <h4 className="text-lg font-serif font-bold text-white mb-4 uppercase tracking-widest">Horário</h4>
          <ul className="space-y-2 text-zinc-400 text-sm">
            <li>Segunda a Sexta: 09:00 - 23:00</li>
            <li>Sábado: 10:00 - 23:00</li>
            <li className="text-[#D14437]/80">Domingo: Fechado</li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-serif font-bold text-white mb-4 uppercase tracking-widest">Contactos</h4>
          <div className="space-y-3 text-sm text-[#EAE6DF]">
            <div className="flex items-center gap-2">
              <a href="tel:+351932697927" className="hover:text-[#D14437] transition-colors duration-300">
                +351 932697927
              </a>
            </div>
            <div className="flex items-center gap-2">
              <a href="mailto:geral@domgroup.pt" className="hover:text-[#D14437] transition-colors duration-300">
                geral@domgroup.pt
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};