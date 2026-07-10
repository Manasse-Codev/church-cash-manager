import { Link } from "react-router";
import logoPng from "../../img/image.png";

const STATS = [
  { value: "500+", label: "Membres actifs"     },
  { value: "6",    label: "Départements"        },
  { value: "30+",  label: "Ans de présence"     },
  { value: "1",    label: "Vision, un Seigneur" },
];

const MISSION_CARDS = [
  { 
    icon: "📖", 
    title: "Notre Mission",  
    text: "La mission fondamentale des Assemblées de Dieu est d'annoncer la Bonne Nouvelle de l'Évangile à toutes les nations, de faire des disciples et de pourvoir aux besoins spirituels et humanitaires des populations. Elle repose sur l'évangélisation, l'implantation d'églises et l'action sociale à l'échelle mondiale." 
  },
  { 
    icon: "🌍", 
    title: "Notre Vision",   
    text: "La vision des Assemblées de Dieu repose sur l'évangélisation, l'implantation d'églises autonomes et la formation de disciples. Elle s'inspire de la Grande Commission (Matthieu 28:19) et vise à propager l'Évangile, fortifier le réveil spirituel par le Saint-Esprit et préparer le retour de Jésus-Christ. Au niveau local, cette vision s'adapte aux réalités de chaque communauté. En Côte d'Ivoire, elle se traduit notamment par l'encadrement de la jeunesse, l'impact social, l'enseignement biblique, le développement des familles chrétiennes et l'édification de lieux de prière où la présence de Dieu est manifestée." 
  },
  { 
    icon: "🕊️", 
    title: "Nos Valeurs",   
    text: "Les Assemblées de Dieu reposent sur des valeurs chrétiennes évangéliques et pentecôtistes. Leurs principes fondamentaux sont : L'autorité de la Bible comme Parole de Dieu, le salut par Jésus-Christ, la sanctification, le baptême du Saint-Esprit (conformément aux enseignements bibliques), l'amour du prochain, l'unité en Christ, l'évangélisation, l'action missionnaire, la prière, la communion fraternelle et le service de Dieu avec intégrité." 
  },
];

const ACTUALITES = [
  { date: "06 Juil 2026", cat: "Culte",     title: "Culte de réveil du dimanche",       desc: "Rejoignez-nous chaque dimanche à 9h pour un temps de louange, de prière et d'enseignement biblique." },
  { date: "12 Juil 2026", cat: "Jeunesse",  title: "Camp de jeunesse 2026",             desc: "Notre camp annuel aura lieu du 12 au 15 juillet. Inscriptions ouvertes pour les 15-35 ans." },
  { date: "20 Juil 2026", cat: "Formation", title: "Séminaire de formation des leaders", desc: "Un week-end de formation intensive pour les responsables de cellules et les diacres de l'église." },
];

const EVENEMENTS = [
  { jour: "13", mois: "Juil", heure: "10h00", titre: "Réunion de prière",      lieu: "Temple Bethsaïda, Cocody" },
  { jour: "20", mois: "Juil", heure: "09h00", titre: "Culte du dimanche",      lieu: "Sanctuaire Principal, Abidjan" },
  { jour: "25", mois: "Juil", heure: "18h00", titre: "Soirée d'adoration",     lieu: "Sanctuaire Principal, Abidjan" },
  { jour: "03", mois: "Aoû",  heure: "08h00", titre: "Camp de jeunesse (J1)",  lieu: "Centre de retraite, Yamoussoukro" },
];

export function LandingPage() {
  return (
    <div>
      {/* ── Hero ── */}
      <section
        id="accueil"
        className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden pt-20"
        style={{ background: "linear-gradient(160deg, var(--blue-deep) 0%, var(--blue-primary) 50%, var(--blue-accent) 100%)" }}
      >
        <div style={{ position: "absolute", inset: 0, opacity: 0.04 }}>
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        </div>
        <div style={{ position: "absolute", top: "-100px", right: "-100px", width: "450px", height: "450px", borderRadius: "50%", background: "rgba(255,255,255,0.03)", filter: "blur(50px)" }} />
        <div style={{ position: "absolute", bottom: "-150px", left: "-150px", width: "500px", height: "500px", borderRadius: "50%", background: "rgba(0,32,194,0.2)", filter: "blur(80px)" }} />

        <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-3xl mx-auto py-16">
          {/* Conteneur logo blanc arrondi pour masquer le fond opaque de l'image */}
          <div className="mb-8 p-4 bg-white rounded-3xl shadow-2xl border border-white/10 transition-transform hover:scale-102 duration-300" style={{ boxShadow: "0 20px 50px rgba(0, 0, 0, 0.25)" }}>
            <img src={logoPng} alt="Logo Assemblées de Dieu" className="w-24 h-24 md:w-28 md:h-28 object-contain" />
          </div>

          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 900, color: "white", fontSize: "clamp(2rem,6vw,3.75rem)", lineHeight: "1.1", marginBottom: "12px", letterSpacing: "-0.01em" }}>
            Assemblées de Dieu
          </h1>
          <div style={{ height: "3px", width: "100px", background: "linear-gradient(90deg, transparent, var(--gold), transparent)", margin: "0 auto 24px" }} />
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "clamp(1.1rem,2.2vw,1.35rem)", fontStyle: "italic", marginBottom: "12px", fontWeight: 500 }}>
            "Tout l'Évangile à toute créature"
          </p>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "16px", maxWidth: "550px", lineHeight: "1.7", marginBottom: "40px", fontWeight: 500 }}>
            Une communauté chrétienne vibrante, ancrée dans la Parole divine et engagée dans l'action de grâce et le service social en Côte d'Ivoire.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto px-4">
            <Link to="/inscription" className="btn-primary flex items-center justify-center" style={{ background: "var(--gold)", color: "var(--blue-deep)", boxShadow: "0 10px 25px rgba(212,168,67,0.35)", border: "none" }}>
              Rejoindre la communauté
            </Link>
            <a href="#a-propos" className="btn-outline flex items-center justify-center" style={{ color: "white", borderColor: "rgba(255,255,255,0.4)" }}
               onMouseOver={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "white"; }}
               onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)"; }}>
              En savoir plus
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce" aria-hidden="true">
          <div style={{ width: "1px", height: "32px", background: "linear-gradient(180deg,transparent,rgba(255,255,255,0.4))" }} />
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "rgba(255,255,255,0.4)" }} />
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ background: "var(--blue-primary)", padding: "40px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((s) => (
            <div key={s.label} className="space-y-1">
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "clamp(2rem,4.5vw,2.75rem)", color: "var(--gold)", lineHeight: "1.1" }}>{s.value}</div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── À propos ── */}
      <section id="a-propos" style={{ background: "white", padding: "100px 16px" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p style={{ color: "var(--blue-accent)", fontSize: "13px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "8px" }}>QUI SOMMES-NOUS</p>
            <h2 style={{ fontFamily: "var(--font-display)", color: "var(--blue-deep)", fontWeight: 800 }}>Une Église au service du Seigneur</h2>
            <div style={{ height: "4px", width: "60px", background: "var(--gold)", margin: "16px auto 0", borderRadius: "2px" }} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MISSION_CARDS.map((c) => (
              <div key={c.title} className="card-ad p-8 text-center flex flex-col items-center">
                <div style={{ fontSize: "44px", marginBottom: "20px" }}>{c.icon}</div>
                <h3 style={{ fontFamily: "var(--font-display)", color: "var(--blue-deep)", fontSize: "18px", fontWeight: 700, marginBottom: "14px" }}>{c.title}</h3>
                <p style={{ color: "var(--gray-600)", fontSize: "14px", lineHeight: "1.7" }}>{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Actualités ── */}
      <section id="actualites" style={{ background: "var(--blue-muted)", padding: "100px 16px" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p style={{ color: "var(--blue-accent)", fontSize: "13px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "8px" }}>ACTUALITÉS</p>
            <h2 style={{ fontFamily: "var(--font-display)", color: "var(--blue-deep)", fontWeight: 800 }}>Vie de l'Église</h2>
            <div style={{ height: "4px", width: "60px", background: "var(--gold)", margin: "16px auto 0", borderRadius: "2px" }} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ACTUALITES.map((a) => (
              <article key={a.title} className="card-ad overflow-hidden flex flex-col">
                <div style={{ height: "150px", background: "linear-gradient(135deg, var(--blue-primary), var(--blue-accent))", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <div className="absolute inset-0 bg-white/5" />
                  <img src={logoPng} alt="" style={{ width: "65px", opacity: 0.15, objectFit: "contain" }} aria-hidden="true" />
                </div>
                <div style={{ padding: "24px", flex: 1 }} className="flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="badge-primary">{a.cat}</span>
                      <span style={{ color: "var(--gray-600)", fontSize: "13px", fontWeight: 500 }}>{a.date}</span>
                    </div>
                    <h3 style={{ color: "var(--blue-deep)", fontWeight: 700, fontSize: "16px", marginBottom: "10px" }}>{a.title}</h3>
                    <p style={{ color: "var(--gray-600)", fontSize: "14px", lineHeight: "1.6" }}>{a.desc}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Événements ── */}
      <section style={{ background: "white", padding: "100px 16px" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p style={{ color: "var(--blue-accent)", fontSize: "13px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "8px" }}>AGENDA</p>
            <h2 style={{ fontFamily: "var(--font-display)", color: "var(--blue-deep)", fontWeight: 800 }}>Prochains événements</h2>
            <div style={{ height: "4px", width: "60px", background: "var(--gold)", margin: "16px auto 0", borderRadius: "2px" }} />
          </div>
          <div className="space-y-5">
            {EVENEMENTS.map((ev) => (
              <div key={ev.titre} className="card-ad p-6 flex flex-col sm:flex-row items-center gap-5">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl flex flex-col items-center justify-center" style={{ background: "linear-gradient(135deg, var(--blue-deep), var(--blue-primary))", color: "white" }}>
                  <span style={{ fontWeight: 800, fontSize: "20px", fontFamily: "var(--font-display)", lineHeight: "1" }}>{ev.jour}</span>
                  <span style={{ fontSize: "11px", fontWeight: 700, opacity: 0.8, textTransform: "uppercase", marginTop: "2px" }}>{ev.mois}</span>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <div style={{ fontWeight: 700, color: "var(--blue-deep)", fontSize: "17px" }}>{ev.titre}</div>
                  <div style={{ color: "var(--gray-600)", fontSize: "13px", marginTop: "4px", fontWeight: 500 }}>🕐 {ev.heure} · 📍 {ev.lieu}</div>
                </div>
                <button type="button" className="btn-outline w-full sm:w-auto" style={{ padding: "8px 22px", fontSize: "13px" }}>S'inscrire</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section style={{ background: "linear-gradient(135deg, var(--blue-deep), var(--blue-primary))", padding: "100px 16px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.05, background: "radial-gradient(circle, white 10%, transparent 80%)" }} />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="w-20 h-20 mx-auto mb-6 p-2 bg-white rounded-2xl shadow-xl flex items-center justify-center">
            <img src={logoPng} alt="" className="w-full h-full object-contain" aria-hidden="true" />
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", color: "white", fontWeight: 800, marginBottom: "16px" }}>Rejoignez notre communauté</h2>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "16px", lineHeight: "1.7", marginBottom: "36px", maxWidth: "520px", margin: "0 auto 36px" }}>
            Que vous cherchiez une famille spirituelle, un lieu d'apprentissage et de croissance chrétienne — nos cœurs et nos portes vous sont ouverts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <Link to="/inscription" className="btn-primary flex items-center justify-center" style={{ background: "var(--gold)", color: "var(--blue-deep)", border: "none" }}>S'inscrire maintenant</Link>
            <Link to="/connexion" className="btn-outline flex items-center justify-center" style={{ color: "white", borderColor: "rgba(255,255,255,0.3)" }}
                  onMouseOver={(e) => (e.currentTarget.style.borderColor = "white")}
                  onMouseOut={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)")}>Espace administration</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
