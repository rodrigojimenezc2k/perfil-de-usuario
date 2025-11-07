import "./App.css";
import React, { useState, useRef, useEffect } from "react";
import { obtenerTopologias } from "./components/services/topologiasService";

function App() {
	const [step, setStep] = useState(1);
	const [count, setCount] = useState("");
	const [items, setItems] = useState([]);
	const [error, setError] = useState("");
	const [topologiasData, setTopologiasData] = useState(null);
	const [loadingTopologias, setLoadingTopologias] = useState(false);
	const firstInputRef = useRef(null);

	useEffect(() => {
		if (step === 2) {
			// focus primer input cuando aparecen los campos
			setTimeout(() => firstInputRef.current && firstInputRef.current.focus(), 120);
		}
	}, [step]);

	const handleCountSubmit = (e) => {
		e && e.preventDefault();
		setError("");
		const n = parseInt(count, 10);
		if (!Number.isInteger(n) || n <= 0 || n > 4) {
			setError("Introduce un número entero entre 1 y 4.");
			return;
		}
		setItems(Array.from({ length: n }, () => ""));
		setStep(2);
	};

	const handleElementChange = (index, value) => {
		const next = [...items];
		next[index] = value;
		setItems(next);
	};

	const handleSubmitSet = async (e) => {
		e && e.preventDefault();
		setError("");
		const trimmed = items.map((s) => (s || "").trim());
		if (trimmed.some((s) => s === "")) {
			setError("Rellena todos los elementos del conjunto.");
			return;
		}

		// Axioma: si hay más de un elemento, no debe repetirse ninguno
		if (trimmed.length > 1) {
			const uniq = new Set(trimmed);
			if (uniq.size !== trimmed.length) {
				setError('Axioma: elementos duplicados detectados. Si pide más de un elemento no puede repetir entradas.');
				return;
			}
		}
		setItems(trimmed);
		// consumir servicio
		setLoadingTopologias(true);
		setTopologiasData(null);
		try {
			const data = await obtenerTopologias(trimmed);
			setTopologiasData(data);
			setStep(3);
		} catch (err) {
			setError('Error al generar topologias: ' + (err.message || err));
		} finally {
			setLoadingTopologias(false);
		}
	};

	const handleReset = () => {
		setStep(1);
		setCount("");
		setItems([]);
		setError("");
	};

	return (
		<div className="app-root">
			<style>{`
				/* App.js embedded styles: gradientes, animaciones, icons styling */
				:root{
					--bg1: #0f172a;
					--bg2: #0b1220;
					--accent: #7c3aed;
					--accent2: #06b6d4;
					--card: rgba(255,255,255,0.03);
					--glass: rgba(255,255,255,0.04);
				}
				*{box-sizing:border-box}
				body,html,#root{height:100%;margin:0;font-family:Inter,ui-sans-serif,system-ui,Segoe UI,Roboto,"Helvetica Neue",Arial}
				.app-root{
					min-height:100vh;
					background:radial-gradient(800px 400px at 10% 20%, rgba(124,58,237,0.12), transparent),
							   radial-gradient(600px 300px at 90% 80%, rgba(6,182,212,0.06), transparent),
							   linear-gradient(180deg,var(--bg1),var(--bg2));
					display:flex;
					/* allow content to grow and scroll naturally */
					align-items:flex-start;
					justify-content:center;
					padding:40px 40px 80px;
					color:#e6eef8;
				}
				.scene {
					width:100%;
					max-width:980px;
					background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
					border-radius:18px;
					padding:28px;
					box-shadow: 0 8px 40px rgba(2,6,23,0.6), inset 0 1px 0 rgba(255,255,255,0.02);
					position:relative;
					overflow:visible;
					backdrop-filter: blur(6px) saturate(120%);
				}
				.header {
					display:flex;
					align-items:center;
					gap:18px;
					margin-bottom:18px;
				}
				.logo {
					width:64px;
					height:64px;
					padding:10px;
					border-radius:12px;
					background:linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01));
					box-shadow: 0 6px 18px rgba(7,10,26,0.5), inset 0 -6px 18px rgba(124,58,237,0.06);
					display:flex;
					align-items:center;
					justify-content:center;
					transform:translateZ(0);
					animation:float 4s ease-in-out infinite;
				}
				@keyframes float { 0%{transform:translateY(0)}50%{transform:translateY(-8px)}100%{transform:translateY(0)} }
				.title {
					font-size:1.6rem;
					letter-spacing:0.2px;
					margin:0;
				}
				.subtitle { color:rgba(230,238,248,0.7); margin-top:4px; font-size:0.95rem; }

				.body {
					display:flex;
					gap:24px;
					align-items:flex-start;
				}

				.panel {
					flex:1;
					background:var(--card);
					border-radius:12px;
					padding:18px;
					border:1px solid rgba(255,255,255,0.025);
					min-height:220px;
					position:relative;
					overflow:hidden;
				}

				.panel .panel-title { font-weight:600; margin:0 0 8px; font-size:1.05rem; }
				.form-row { display:flex; gap:12px; align-items:center; margin-bottom:12px; }
				.input, .num {
					flex:1;
					padding:10px 12px;
					border-radius:10px;
					border:1px solid rgba(255,255,255,0.04);
					background:linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.00));
					color:inherit;
					font-size:0.98rem;
					outline:none;
					transition:box-shadow .18s ease, transform .15s ease;
				}
				.num { max-width:140px; text-align:center; }
				.input:focus, .num:focus { box-shadow: 0 6px 22px rgba(124,58,237,0.12); transform:translateY(-2px); border-color: rgba(124,58,237,0.4); }

				.btn {
					padding:10px 14px;
					border-radius:10px;
					border:0;
					background:linear-gradient(90deg,var(--accent),var(--accent2));
					color:white;
					font-weight:700;
					cursor:pointer;
					transition:transform .16s ease, box-shadow .12s ease;
					box-shadow: 0 8px 28px rgba(12,8,60,0.45);
				}
				.btn:hover { transform:translateY(-4px); box-shadow: 0 18px 40px rgba(12,8,60,0.55); }

				.small { padding:8px 10px; font-size:0.9rem; background:transparent; border:1px solid rgba(255,255,255,0.04); color:inherit; }

				.inputs-grid {
					display:grid;
					grid-template-columns:repeat(auto-fill,minmax(220px,1fr));
					gap:12px;
					margin-top:8px;
				}
				.element-card {
					display:flex;
					align-items:center;
					gap:10px;
					padding:10px;
					border-radius:10px;
					background:linear-gradient(180deg, rgba(255,255,255,0.012), rgba(255,255,255,0.006));
					border:1px solid rgba(255,255,255,0.02);
					transition:transform .18s cubic-bezier(.2,.9,.3,1), box-shadow .18s ease;
					animation:popIn .36s ease both;
				}
				@keyframes popIn { from { transform: translateY(10px) scale(.98); opacity:0 } to { transform: translateY(0) scale(1); opacity:1 } }
				.icon-wrap {
					width:44px;height:44px;border-radius:10px;display:flex;align-items:center;justify-content:center;
					background:linear-gradient(135deg, rgba(124,58,237,0.12), rgba(6,182,212,0.06));
					box-shadow: inset 0 -6px 18px rgba(255,255,255,0.02);
				}
				.math-chip {
					padding:8px 12px;border-radius:999px;background:linear-gradient(90deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
					border:1px solid rgba(255,255,255,0.03); font-weight:600;
					animation:chippop .45s cubic-bezier(.2,.9,.3,1) both;
				}
				@keyframes chippop { from{transform:translateY(6px) scale(.98);opacity:0} to{transform:none;opacity:1} }

				.result {
					display:flex;
					gap:12px;
					align-items:center;
					flex-wrap:wrap;
					margin-top:12px;
					padding-top:6px;
					border-top:1px dashed rgba(255,255,255,0.02);
				}
				.brace { font-weight:800; font-size:1.25rem; color: rgba(230,238,248,0.9); }
				.chips { display:flex; gap:8px; flex-wrap:wrap; align-items:center; }

				.helper { color:rgba(230,238,248,0.65); font-size:0.92rem; margin-top:6px; }

				.error { color:#ffb4b4; margin-top:8px; font-weight:600; }

				/* Topologias cards */
				.topo-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:16px; margin-top:12px }
				.topo-card { background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)); border-radius:12px; padding:12px; border:1px solid rgba(255,255,255,0.03); box-shadow:0 8px 30px rgba(2,6,23,0.45); transform-origin:center; animation:cardPop .45s ease both }
				.topo-header { font-weight:700; color:#e6eef8; margin-bottom:8px; }
				.topo-body { display:flex; flex-direction:column; gap:8px; }
				.topo-set { background:linear-gradient(90deg, rgba(255,255,255,0.01), rgba(255,255,255,0.006)); padding:8px; border-radius:8px; border:1px solid rgba(255,255,255,0.02); }
				.brace { color:rgba(230,238,248,0.9); margin-right:6px; font-weight:700 }
				.topo-card:hover { transform:translateY(-6px) scale(1.02); box-shadow:0 20px 50px rgba(2,6,23,0.6) }
				@keyframes cardPop { from { transform: translateY(8px) scale(.98); opacity:0 } to { transform:none; opacity:1 } }

				.footer-actions { display:flex; gap:8px; margin-top:12px; justify-content:flex-end; }

				/* responsive */
				@media (max-width:880px){
					.body { flex-direction:column; }
				}
			`}</style>

			<div className="scene" role="main" aria-labelledby="app-title">
				<div className="header">
					<div className="logo" aria-hidden>
						{/* SVG combinando símbolos matemáticos / topológicos */}
						<svg width="40" height="40" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
							<defs>
								<linearGradient id="g1" x1="0" x2="1">
									<stop offset="0" stopColor="#7c3aed"/><stop offset="1" stopColor="#06b6d4"/>
								</linearGradient>
							</defs>
							<circle cx="32" cy="32" r="30" fill="url(#g1)" opacity="0.15"/>
							<g transform="translate(12,10)" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.95">
								<path d="M4 28 C8 10,28 6,36 18" fill="none" strokeOpacity="0.9" />
								<path d="M2 20 L12 12 L22 20" fill="none" strokeOpacity="0.9"/>
							</g>
							<text x="6" y="52" fill="#fff" fontSize="10" fontWeight="700" opacity="0.9">Σ∈</text>
						</svg>
					</div>

					<div>
						<h1 id="app-title" className="title">Constructor de Topologias para conjuntos finitos</h1>
						<div className="subtitle">
  Introduce cuántos elementos tiene el conjunto y luego sus valores. 
  Topologías (τ) para (X).
</div>
					</div>
				</div>

				<div className="body">
					<div className="panel" aria-live="polite">
						<p className="panel-title">Paso {step} — Definición del conjunto</p>
						{step === 1 && (
							<form onSubmit={handleCountSubmit}>
								<div className="form-row">
									<input
										aria-label="Número de elementos"
										className="num"
										type="number"
										min="1"
										max="20"
										value={count}
										onChange={(e) => setCount(e.target.value)}
										placeholder="Ej: 4"
									/>
									<button className="btn" type="submit">Crear campos</button>
								</div>
								<div className="helper">Máx. 4 elementos ,las topologias crecen mas rapido que una exponencial , para 5 o mas elementos es un problema no computable. Usa números, símbolos , nombres o emojis.</div>
								{error && <div className="error" role="alert">{error}</div>}
							</form>
						)}

						{step === 2 && (
							<form onSubmit={handleSubmitSet}>
								<div className="panel-title" style={{marginBottom:10}}>Introduce cada elemento</div>
								<div className="inputs-grid">
									{items.map((val, i) => (
										<label key={i} className="element-card">
											<div className="icon-wrap" aria-hidden>
												{/* iconos SVG variados: toroide-ish, conjunto, sigma */}
												{ i % 3 === 0 ? (
													<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="7" stroke="white" strokeOpacity="0.9" strokeWidth="1.6"/></svg>
												) : i % 3 === 1 ? (
													<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M6 6 L18 6 L12 18 Z" stroke="white" strokeWidth="1.6" strokeOpacity="0.95" fill="none"/></svg>
												) : (
													<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M6 7h6M6 12h10M6 17h6" stroke="white" strokeWidth="1.6" strokeOpacity="0.95" strokeLinecap="round"/></svg>
												)}
											</div>
											<input
												ref={i===0?firstInputRef:null}
												className="input"
												placeholder={`Elemento ${i+1} (ej: a${i+1})`}
												value={val}
												onChange={(e) => handleElementChange(i, e.target.value)}
											/>
										</label>
									))}
								</div>

								<div className="footer-actions">
									<button type="button" className="small" onClick={handleReset}>Volver</button>
									<button type="submit" className="btn">Finalizar conjunto</button>
								</div>

								{error && <div className="error" role="alert">{error}</div>}
							</form>
						)}

						{step === 3 && (
							<div>
								<div className="panel-title">Conjunto definido</div>

								<div className="helper">Elementos originales:</div>
								<div style={{marginTop:8, display:'flex', gap:8, flexWrap:'wrap'}}>
									{items.map((it, idx) => (
										<span key={idx} className="math-chip" title={`Elemento ${idx+1}`}>{it}</span>
									))}
								</div>

								{loadingTopologias && (
									<div className="helper" style={{marginTop:12}}>Generando topologías, por favor espera…</div>
								)}

								{topologiasData && (
									<>
										<div className="helper" style={{marginTop:12}}>Se encontraron <strong style={{color:'#ffd166'}}>{topologiasData.num_topologias}</strong> topologías</div>
										<div className="topo-grid" style={{marginTop:12}}>
											{topologiasData.topologias.map((topo, tIdx) => (
												<div key={tIdx} className="topo-card" role="article">
													<div className="topo-header">Topología #{tIdx+1}</div>
													<div className="topo-body">
														{topo.map((conj, cIdx) => (
															<div key={cIdx} className="topo-set">
																<span className="brace">{'{ '}</span>
																{conj.length === 0 ? <em className="text-muted">∅</em> : (
																	<div className="chips" style={{display:'inline-flex',gap:8}}>
																		{conj.map((el, i) => (
																			<span key={i} className="math-chip" style={{padding:'6px 8px', fontSize:14}}>{el}</span>
																		))}
																	</div>
																)}
																<span className="brace">{' }'}</span>
															</div>
														))}
													</div>
												</div>
											))}
										</div>
									</>
								)}

								<div className="footer-actions" style={{marginTop:14}}>
									<button className="small" onClick={() => setStep(2)}>Editar elementos</button>
									<button className="btn" onClick={() => alert("Conjunto guardado: " + JSON.stringify(items))}>Guardar</button>
								</div>
							</div>
						)}
					</div>

					{/* panel derecho: explicación/visualización topológica */}
					<div className="panel" aria-hidden={step===2?false:true}>
						<p className="panel-title">Visual Topológica</p>
						<div style={{display:'flex',gap:12,alignItems:'center',flexWrap:'wrap'}}>
							<div style={{flex:'0 0 120px'}}>
								<svg viewBox="0 0 120 80" width="120" height="80" style={{display:'block'}}>
									<defs>
										<linearGradient id="lg" x1="0" x2="1"><stop offset="0" stopColor="#7c3aed"/><stop offset="1" stopColor="#06b6d4"/></linearGradient>
									</defs>
									<g fill="none" stroke="url(#lg)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.95">
										<path d="M14 40 C22 18, 48 12, 62 22 C76 32, 100 28, 106 18" strokeOpacity="0.12"/>
										<ellipse cx="60" cy="40" rx="32" ry="18" strokeOpacity="0.22" />
										<path d="M34 46 C40 58, 76 58, 86 46" strokeOpacity="0.16" />
									</g>
								</svg>
							</div>

							<div style={{flex:1}}>
								<div className="helper">Calcula todas la topologias de tu conjunto finito y no te quedes sin enterarte de todas las posibilidades!</div>
								<ul style={{marginTop:12,lineHeight:1.6}}>
									<li>Introduce el número de elementos.</li>
									<li>Asigna nombres o símbolos (ej: a, 1, ∞, A).</li>
									<li>Te sorprendera saber las posibles topologias que se pueden definir.</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
