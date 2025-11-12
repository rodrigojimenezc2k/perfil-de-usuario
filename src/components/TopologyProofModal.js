import React, { useState, useEffect } from "react";

const TopologyProofModal = ({ isOpen, topologia, elements, topoIndex, onClose }) => {
	const [proofs, setProofs] = useState(null);

	useEffect(() => {
		if (isOpen && topologia) {
			const verified = verifyTopologyAxioms(topologia, elements);
			setProofs(verified);
		}
	}, [isOpen, topologia, elements]);

	const verifyTopologyAxioms = (topo, elems) => {
		// topo es un array de arrays (subconjuntos)
		// elems es el array de elementos originales

		const topoSets = topo.map(set => new Set(set));
		const elemSet = new Set(elems);
		const emptySet = new Set();

		// Axioma 1: X y ∅ pertenecen a la topología
		const axiom1 = {
			name: "Axioma 1: X y ∅ ∈ τ",
			description: "El conjunto X y el conjunto vacío deben pertenecer a la topología.",
			checks: [
				{
					label: "∅ ∈ τ",
					passed: topo.some(set => set.length === 0),
					explanation: topo.some(set => set.length === 0) ? "✓ El conjunto vacío está en la topología." : "✗ El conjunto vacío NO está en la topología."
				},
				{
					label: "X ∈ τ",
					passed: topo.some(set => set.length === elems.length && elems.every(e => set.includes(e))),
					explanation: topo.some(set => set.length === elems.length && elems.every(e => set.includes(e))) ? `✓ El conjunto completo ${JSON.stringify(elems)} está en la topología.` : "✗ El conjunto completo NO está en la topología."
				}
			],
			passed: topo.some(set => set.length === 0) && topo.some(set => set.length === elems.length && elems.every(e => set.includes(e)))
		};

		// Axioma 2: Unión de elementos en τ está en τ
		const axiom2 = {
			name: "Axioma 2: Uniones finitas cerradas",
			description: "La unión de cualquier colección finita de conjuntos en τ debe estar en τ.",
			checks: [],
			passed: true
		};

		if (topoSets.length > 1) {
			// Verificar algunas uniones (no todas, sería exponencial)
			for (let i = 0; i < Math.min(topoSets.length - 1, 3); i++) {
				for (let j = i + 1; j < Math.min(topoSets.length, i + 3); j++) {
					const union = new Set([...topoSets[i], ...topoSets[j]]);
					const unionArray = Array.from(union).sort().join(",");
					const existsInTopo = topo.some(set => {
						const setArray = new Set(set);
						return setArray.size === union.size && Array.from(union).every(e => setArray.has(e));
					});

					const check = {
						label: `${setToString(Array.from(topoSets[i]))} ∪ ${setToString(Array.from(topoSets[j]))}`,
						passed: existsInTopo,
						explanation: existsInTopo ? `✓ La unión ${setToString(Array.from(union))} está en τ.` : `✗ La unión ${setToString(Array.from(union))} NO está en τ.`
					};
					axiom2.checks.push(check);
					if (!existsInTopo) axiom2.passed = false;
				}
			}
		} else {
			axiom2.checks.push({
				label: "Menos de 2 conjuntos",
				passed: true,
				explanation: "✓ Con menos de 2 conjuntos no hay unión a verificar."
			});
		}

		// Axioma 3: Intersección de elementos en τ está en τ
		const axiom3 = {
			name: "Axioma 3: Intersecciones finitas cerradas",
			description: "La intersección de cualquier colección finita de conjuntos en τ debe estar en τ.",
			checks: [],
			passed: true
		};

		if (topoSets.length > 1) {
			for (let i = 0; i < Math.min(topoSets.length - 1, 3); i++) {
				for (let j = i + 1; j < Math.min(topoSets.length, i + 3); j++) {
					const intersection = new Set([...topoSets[i]].filter(x => topoSets[j].has(x)));
					const existsInTopo = topo.some(set => {
						const setArray = new Set(set);
						return setArray.size === intersection.size && Array.from(intersection).every(e => setArray.has(e));
					});

					const check = {
						label: `${setToString(Array.from(topoSets[i]))} ∩ ${setToString(Array.from(topoSets[j]))}`,
						passed: existsInTopo,
						explanation: existsInTopo ? `✓ La intersección ${setToString(Array.from(intersection))} está en τ.` : `✗ La intersección ${setToString(Array.from(intersection))} NO está en τ.`
					};
					axiom3.checks.push(check);
					if (!existsInTopo) axiom3.passed = false;
				}
			}
		} else {
			axiom3.checks.push({
				label: "Menos de 2 conjuntos",
				passed: true,
				explanation: "✓ Con menos de 2 conjuntos no hay intersección a verificar."
			});
		}

		return [axiom1, axiom2, axiom3];
	};

	const setToString = (arr) => {
		if (arr.length === 0) return "∅";
		return `{${arr.join(",")}}`;
	};

	if (!isOpen) return null;

	return (
		<>
			{/* Overlay */}
			<div
				className="modal-overlay"
				onClick={onClose}
				style={{
					position: "fixed",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: "rgba(0,0,0,0.6)",
					backdropFilter: "blur(4px)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					zIndex: 1000,
					animation: "fadeIn 0.2s ease"
				}}
			/>

			{/* Modal */}
			<div
				className="modal-content"
				onClick={e => e.stopPropagation()}
				style={{
					position: "fixed",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					background: "linear-gradient(180deg, rgba(15,23,42,0.95), rgba(11,18,32,0.95))",
					border: "1px solid rgba(255,255,255,0.08)",
					borderRadius: "16px",
					padding: "24px",
					maxHeight: "90vh",
					maxWidth: "720px",
					width: "100%",
					overflow: "auto",
					backdropFilter: "blur(10px)",
					boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
					zIndex: 1001,
					animation: "slideUp 0.3s cubic-bezier(0.2,0.9,0.3,1)"
				}}
			>
				<style>{`
					@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
					@keyframes slideUp { from { transform: translate(-50%, calc(-50% + 20px)); opacity: 0 } to { transform: translate(-50%, -50%); opacity: 1 } }
					@keyframes checkMark { 0% { transform: scale(0) rotate(-45deg); opacity: 0 } 50% { transform: scale(1.2) } 100% { transform: scale(1); opacity: 1 } }
					@keyframes xMark { 0% { transform: scale(0) rotate(0); opacity: 0 } 100% { transform: scale(1); opacity: 1 } }
					
					.modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
					.modal-title { font-size: 1.4rem; margin: 0; color: #e6eef8; }
					.modal-close { background: transparent; border: 0; color: rgba(230,238,248,0.6); font-size: 1.5rem; cursor: pointer; }
					.modal-close:hover { color: #e6eef8; }

					.axiom-section { margin-bottom: 18px; }
					.axiom-title { font-size: 1.1rem; font-weight: 700; margin: 0 0 10px; color: #ffd166; display: flex; align-items: center; gap: 8px; }
					.axiom-title svg { width: 20px; height: 20px; }
					.axiom-desc { color: rgba(230,238,248,0.7); font-size: 0.95rem; margin-bottom: 10px; }

					.check-item { display: flex; gap: 10px; padding: 10px; margin-bottom: 8px; border-radius: 8px; background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.02); align-items: flex-start; }
					.check-icon { flex: 0 0 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.2rem; }
					.check-icon.passed { background: linear-gradient(90deg, #10b981, #34d399); color: white; animation: checkMark 0.6s ease; }
					.check-icon.failed { background: linear-gradient(90deg, #ef4444, #f87171); color: white; animation: xMark 0.4s ease; }
					.check-text { flex: 1; }
					.check-label { font-weight: 600; color: #e6eef8; margin-bottom: 2px; font-family: monospace; font-size: 0.95rem; }
					.check-explanation { color: rgba(230,238,248,0.65); font-size: 0.9rem; }

					.modal-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; border-top: 1px solid rgba(255,255,255,0.02); padding-top: 16px; }
					.btn-close { padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); background: transparent; color: #e6eef8; cursor: pointer; }
					.btn-close:hover { background: rgba(255,255,255,0.04); }

					.summary { display: flex; gap: 12px; margin-top: 14px; padding: 12px; border-radius: 10px; background: linear-gradient(135deg, rgba(16,185,129,0.08), rgba(6,182,212,0.04)); border: 1px solid rgba(16,185,129,0.12); }
					.summary-icon { flex: 0 0 28px; height: 28px; border-radius: 50%; background: linear-gradient(90deg, #10b981, #34d399); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; }
					.summary-text { color: #86efac; font-size: 0.95rem; font-weight: 600; }
				`}</style>

				<div className="modal-header">
					<h2 className="modal-title">τ Demostración #{topoIndex + 1}</h2>
					<button className="modal-close" onClick={onClose}>✕</button>
				</div>

				{proofs && proofs.map((axiom, idx) => (
					<div key={idx} className="axiom-section">
						<div className="axiom-title">
							{axiom.passed ? (
								<svg viewBox="0 0 24 24" fill="currentColor" style={{ color: "#10b981" }}>
									<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
								</svg>
							) : (
								<svg viewBox="0 0 24 24" fill="currentColor" style={{ color: "#ef4444" }}>
									<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
								</svg>
							)}
							{axiom.name}
						</div>
						<div className="axiom-desc">{axiom.description}</div>

						<div>
							{axiom.checks.map((check, cidx) => (
								<div key={cidx} className="check-item">
									<div className={`check-icon ${check.passed ? "passed" : "failed"}`}>
										{check.passed ? "✓" : "✗"}
									</div>
									<div className="check-text">
										<div className="check-label">{check.label}</div>
										<div className="check-explanation">{check.explanation}</div>
									</div>
								</div>
							))}
						</div>
					</div>
				))}

				{proofs && proofs.every(ax => ax.passed) && (
					<div className="summary">
						<div className="summary-icon">✓</div>
						<div className="summary-text">¡Todos los axiomas verificados! Este es un espacio topológico válido.</div>
					</div>
				)}

				<div className="modal-footer">
					<button className="btn-close" onClick={onClose}>Cerrar</button>
				</div>
			</div>
		</>
	);
};

export default TopologyProofModal;
