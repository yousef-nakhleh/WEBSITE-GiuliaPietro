// src/legal/PrivacyPolicy.tsx
import React from "react";
import SEO from "../seo/SEO";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F5F1EB] text-[#3C2A21] pt-20">
      <SEO
        title="Privacy Policy | Giulia & Pietro Acconciature Unisex"
        description="Informativa sulla privacy del sito Giulia & Pietro Acconciature Unisex: scopri come vengono trattati i tuoi dati personali e come esercitare i tuoi diritti."
        canonicalUrl="https://epifaniodigiovanni.it/privacy"
        robots="index, follow"
      />

      <div className="mx-auto max-w-3xl px-6 py-16">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold">Privacy Policy</h1>
          <p className="mt-2 text-sm opacity-80">
            Ultimo aggiornamento: {new Date().toLocaleDateString()}
          </p>
        </header>

        <section className="space-y-6 text-[15px] leading-relaxed">
          <p>
            Questa informativa descrive in modo semplice come trattiamo i dati personali raccolti
            tramite questo sito web. Manteniamo il testo breve e chiaro.
          </p>

          <div>
            <h2 className="text-lg font-medium">1. Dati che raccogliamo</h2>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Nome e cognome</li>
              <li>Email</li>
              <li>Numero di telefono</li>
              <li>Messaggio o richiesta inviata tramite i moduli di contatto</li>
              <li>Dati di utilizzo anonimi (statistiche aggregate con Google Analytics)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-medium">2. Perché li raccogliamo</h2>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Rispondere a richieste e fissare appuntamenti.</li>
              <li>Migliorare il sito e i suoi contenuti.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-medium">3. Base giuridica</h2>
            <p className="mt-2">
              Eseguiamo il trattamento sulla base del tuo consenso e/o per rispondere a una tua
              richiesta (misure precontrattuali).
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium">4. Conservazione</h2>
            <p className="mt-2">
              Conserviamo i dati solo per il tempo necessario a rispondere e gestire la tua
              richiesta; i log statistici sono anonimi.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium">5. Condivisione</h2>
            <p className="mt-2">
              Non vendiamo i tuoi dati. Possiamo utilizzare servizi tecnici di terze parti
              (ad es. Google Analytics) che trattano informazioni in forma aggregata/anonima.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium">6. I tuoi diritti</h2>
            <p className="mt-2">
              Puoi chiedere accesso, rettifica, cancellazione o limitazione del trattamento. Per
              esercitare i diritti contattaci ai riferimenti qui sotto.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium">7. Cookie</h2>
            <p className="mt-2">
              Utilizziamo cookie funzionali e di analisi. Puoi gestire le preferenze tramite il
              banner o dalla voce “Impostazioni Cookie” nel footer.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium">8. Contatti</h2>
            <p className="mt-2">
              Per domande sulla privacy o richieste relative ai dati, contattaci al{" "}
              <a href="tel:3339347932" className="underline underline-offset-2">
                333 934 7932
              </a>{" "}
              o su{" "}
              <a
                href="https://www.instagram.com/giuliaepietroacconciature/"
                className="underline underline-offset-2"
              >
                Instagram
              </a>
              .
            </p>
          </div>
        </section>

        <footer className="mt-12 pt-6 border-t border-[#3C2A21]/20 text-sm opacity-80">
          <p>
            Titolare del trattamento: Giulia &amp; Pietro Acconciature Unisex — Indirizzo: Piazza
            Dottor Emilio Gallavresi, 6, 24043 Caravaggio (BG).
          </p>
        </footer>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
