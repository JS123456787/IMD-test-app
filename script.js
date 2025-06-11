'use strict';

// Use React and its hooks from the global window object (loaded via CDN)
const { useState, useMemo, useCallback, useEffect } = React;

// --- SVG Icons (replaces lucide-react library) ---
// These are functions that return SVG markup, so they work in the browser without an import.
const Icon = ({ size = 24, children, ...props }) => (
    React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props },
        children
    )
);

const SlidersHorizontal = (props) => React.createElement(Icon, props, React.createElement("line", { x1: "21", x2: "14", y1: "4", y2: "4" }), React.createElement("line", { x1: "10", x2: "3", y1: "4", y2: "4" }), React.createElement("line", { x1: "21", x2: "12", y1: "12", y2: "12" }), React.createElement("line", { x1: "8", x2: "3", y1: "12", y2: "12" }), React.createElement("line", { x1: "21", x2: "16", y1: "20", y2: "20" }), React.createElement("line", { x1: "12", x2: "3", y1: "20", y2: "20" }), React.createElement("line", { x1: "14", x2: "14", y1: "2", y2: "6" }), React.createElement("line", { x1: "8", x2: "8", y1: "10", y2: "14" }), React.createElement("line", { x1: "16", x2: "16", y1: "18", y2: "22" }));
const AlertTriangle = (props) => React.createElement(Icon, props, React.createElement("path", { d: "m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" }), React.createElement("line", { x1: "12", x2: "12", y1: "9", y2: "13" }), React.createElement("line", { x1: "12", x2: "12.01", y1: "17", y2: "17" }));
const CheckCircle = (props) => React.createElement(Icon, props, React.createElement("path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }), React.createElement("polyline", { points: "22 4 12 14.01 9 11.01" }));
const ListPlus = (props) => React.createElement(Icon, props, React.createElement("path", { d: "M11 12H3" }), React.createElement("path", { d: "M16 6H3" }), React.createElement("path", { d: "M16 18H3" }), React.createElement("path", { d: "M18 9v6" }), React.createElement("path", { d: "M21 12h-6" }));
const Calculator = (props) => React.createElement(Icon, props, React.createElement("rect", { width: "16", height: "20", x: "4", y: "2", rx: "2" }), React.createElement("line", { x1: "8", x2: "16", y1: "6", y2: "6" }), React.createElement("line", { x1: "16", x2: "16", y1: "14", y2: "18" }), React.createElement("line", { x1: "8", x2: "8", y1: "10", y2: "18" }), React.createElement("line", { x1: "8", x2: "16", y1: "14", y2: "14" }));
const Loader2 = (props) => React.createElement(Icon, { ...props, className: "animate-spin" }, React.createElement("path", { d: "M21 12a9 9 0 1 1-6.219-8.56" }));
const ChevronDown = (props) => React.createElement(Icon, props, React.createElement("path", { d: "m6 9 6 6 6-6" }));
const LayoutGrid = (props) => React.createElement(Icon, props, React.createElement("rect", { width: "7", height: "7", x: "3", y: "3", rx: "1" }), React.createElement("rect", { width: "7", height: "7", x: "14", y: "3", rx: "1" }), React.createElement("rect", { width: "7", height: "7", x: "14", y: "14", rx: "1" }), React.createElement("rect", { width: "7", height: "7", x: "3", y: "14", rx: "1" }));
const BarChart2 = (props) => React.createElement(Icon, props, React.createElement("line", { x1: "18", x2: "18", y1: "20", y2: "10" }), React.createElement("line", { x1: "12", x2: "12", y1: "20", y2: "4" }), React.createElement("line", { x1: "6", x2: "6", y1: "20", y2: "14" }));
const RotateCcw = (props) => React.createElement(Icon, props, React.createElement("path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" }), React.createElement("path", { d: "M3 3v5h5" }));
const XCircle = (props) => React.createElement(Icon, props, React.createElement("circle", { cx: "12", cy: "12", r: "10" }), React.createElement("line", { x1: "15", x2: "9", y1: "9", y2: "15" }), React.createElement("line", { x1: "9", x2: "15", y1: "9", y2: "15" }));
const HelpCircle = (props) => React.createElement(Icon, props, React.createElement("circle", { cx: "12", cy: "12", r: "10" }), React.createElement("path", { d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" }), React.createElement("line", { x1: "12", x2: "12.01", y1: "17", y2: "17" }));


// --- Pure IMD Calculation Logic ---
const calculateIMD = (frequencies, options = {}) => {
    const { ignore2T3O = false, ignore3T3O = false, ignore5ths = false } = options;
    const validFrequencies = frequencies
        .map(f => parseFloat(f))
        .filter(f => !isNaN(f) && f > 0);

    if (validFrequencies.length < 2) {
        return { imdProducts: [], counts: { total: 0, twoToneThirdOrder: 0, threeToneThirdOrder: 0, fifthOrder: 0, hits: 0 } };
    }

    const products = [];
    const uniqueProducts = new Set();
    const validFreqSet = new Set(validFrequencies.map(f => f.toFixed(3)));

    if (!ignore2T3O || !ignore5ths) {
        for (let i = 0; i < validFrequencies.length; i++) {
            for (let j = i + 1; j < validFrequencies.length; j++) {
                const f1 = validFrequencies[i];
                const f2 = validFrequencies[j];
                const candidates = [];
                
                if (!ignore2T3O) {
                    candidates.push(
                        { value: 2 * f1 - f2, order: 3, type: '2-TX', formula: `2*${f1}-${f2}`, sources: [f1,f2] },
                        { value: 2 * f2 - f1, order: 3, type: '2-TX', formula: `2*${f2}-${f1}`, sources: [f1,f2] }
                    );
                }
                
                if (!ignore5ths) {
                     candidates.push(
                        { value: 3 * f1 - 2 * f2, order: 5, type: '2-TX', formula: `3*${f1}-2*${f2}`, sources: [f1,f2] },
                        { value: 3 * f2 - 2 * f1, order: 5, type: '2-TX', formula: `3*${f2}-2*${f1}`, sources: [f1,f2] }
                    );
                }

                candidates.forEach(p => {
                    const valStr = p.value.toFixed(3);
                    if (p.value > 0 && !uniqueProducts.has(valStr)) {
                        p.isHit = validFreqSet.has(valStr);
                        products.push(p);
                        uniqueProducts.add(valStr);
                    }
                });
            }
        }
    }

    if (!ignore3T3O && validFrequencies.length >= 3) {
        for (let i = 0; i < validFrequencies.length; i++) {
            for (let j = i + 1; j < validFrequencies.length; j++) {
                for (let k = j + 1; k < validFrequencies.length; k++) {
                    const f1 = validFrequencies[i], f2 = validFrequencies[j], f3 = validFrequencies[k];
                    const candidates = [
                        { value: f1 + f2 - f3, order: 3, type: '3-TX', formula: `${f1}+${f2}-${f3}`, sources: [f1,f2,f3] },
                        { value: f1 + f3 - f2, order: 3, type: '3-TX', formula: `${f1}+${f3}-${f2}`, sources: [f1,f2,f3] },
                        { value: f2 + f3 - f1, order: 3, type: '3-TX', formula: `${f2}+${f3}-${f1}`, sources: [f1,f2,f3] },
                    ];
                    candidates.forEach(p => {
                       const valStr = p.value.toFixed(3);
                        if (p.value > 0 && !uniqueProducts.has(valStr)) {
                            p.isHit = validFreqSet.has(valStr);
                            products.push(p);
                            uniqueProducts.add(valStr);
                        }
                    });
                }
            }
        }
    }
    
    const counts = {
        total: products.length,
        twoToneThirdOrder: products.filter(p => p.order === 3 && p.type === '2-TX').length,
        threeToneThirdOrder: products.filter(p => p.order === 3 && p.type === '3-TX').length,
        fifthOrder: products.filter(p => p.order === 5).length,
    };

    return { imdProducts: products.sort((a, b) => a.value - b.value), counts };
};

const isMultipleOf25 = (freqStr) => {
    if (typeof freqStr !== 'string' && typeof freqStr !== 'number') return true;
    const freq = parseFloat(freqStr);
    if (isNaN(freq) || freqStr === '') return true;
    const remainder = (freq * 1000) % 25;
    return remainder < 0.001 || Math.abs(remainder - 25) < 0.001;
};

// --- Main App Component ---
function App() {
    const [page, setPage] = useState('calculator');
    
    const NavButton = ({ active, onClick, children, icon: ButtonIcon }) => {
        return (
            React.createElement("button", { onClick: onClick, className: `flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${active ? 'bg-cyan-600 text-white' : 'text-zinc-300 hover:bg-zinc-700'}` },
                React.createElement(ButtonIcon, { size: 16 }),
                children
            )
        );
    };
    
    return (
        React.createElement("div", { className: "bg-zinc-900 text-zinc-100 min-h-screen font-sans p-4 sm:p-6 md:p-8" },
            React.createElement("div", { className: "max-w-6xl mx-auto" },
                React.createElement("header", { className: "mb-6 text-center" },
                    React.createElement("div", { className: "flex items-center justify-center gap-3" },
                        React.createElement(SlidersHorizontal, { className: "text-cyan-400", size: 32 }),
                        React.createElement("h1", { className: "text-4xl font-bold tracking-tight text-white" }, "IMD Test App 📶")
                    )
                ),
                React.createElement("nav", { className: "flex justify-center items-center gap-2 mb-8 p-2 bg-zinc-800 rounded-lg" },
                    React.createElement(NavButton, { onClick: () => setPage('calculator'), active: page === 'calculator', icon: Calculator }, "Manual Test"),
                    React.createElement(NavButton, { onClick: () => setPage('generator'), active: page === 'generator', icon: ListPlus }, "List Generator")
                ),
                page === 'calculator' && React.createElement(IMDCalculatorPage),
                page === 'generator' && React.createElement(IMDGeneratorPage)
            )
        )
    );
}

// --- All other components go here, written in JSX ---
// Babel will transpile them automatically because of the script type in index.html

function IMDCalculatorPage() {
    const [frequencies, setFrequencies] = useState(Array(8).fill(''));
    const [carrierSpacing, setCarrierSpacing] = useState('0.350');
    const [isCarrierSpacingEnabled, setIsCarrierSpacingEnabled] = useState(true);
    const [spacing2T3O, setSpacing2T3O] = useState('0.075');
    const [is2T3OSpacingEnabled, setIs2T3OSpacingEnabled] = useState(true);
    const [spacing3T3O, setSpacing3T3O] = useState('0.50');
    const [is3T3OSpacingEnabled, setIs3T3OSpacingEnabled] = useState(false);
    const [spacing5T, setSpacing5T] = useState('0.50');
    const [is5TSpacingEnabled, setIs5TSpacingEnabled] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [pulsingRules, setPulsingRules] = useState({});

    const handleFrequencyChange = (index, value) => {
        const newFrequencies = [...frequencies];
        if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
            newFrequencies[index] = value;
            setFrequencies(newFrequencies);
        }
    };

    const handleClear = () => setFrequencies(Array(8).fill(''));
    const handleRestoreDefaults = () => {
        setCarrierSpacing('0.350');
        setSpacing2T3O('0.075');
        setSpacing3T3O('0.50');
        setSpacing5T('0.50');
        setIsCarrierSpacingEnabled(true);
        setIs2T3OSpacingEnabled(true);
        setIs3T3OSpacingEnabled(false);
        setIs5TSpacingEnabled(false);
    };

    const { imdProducts: allImdProducts, counts } = useMemo(() => calculateIMD(frequencies), [frequencies]);
    
    const displayedImdProducts = useMemo(() => {
        return allImdProducts.filter(p => {
            if (p.order === 3 && p.type === '2-TX' && !is2T3OSpacingEnabled) return false;
            if (p.order === 3 && p.type === '3-TX' && !is3T3OSpacingEnabled) return false;
            if (p.order === 5 && !is5TSpacingEnabled) return false;
            return true;
        });
    }, [allImdProducts, is2T3OSpacingEnabled, is3T3OSpacingEnabled, is5TSpacingEnabled]);

    const violationData = useMemo(() => {
        const alerts = Array(8).fill(null).map(() => []);
        const validFreqs = frequencies.map((f, i) => ({ freq: parseFloat(f), originalIndex: i })).filter(item => !isNaN(item.freq) && item.freq > 0);
        const cSpacing = parseFloat(carrierSpacing);
        const s2t3o = parseFloat(spacing2T3O);
        const s3t3o = parseFloat(spacing3T3O);
        const s5t = parseFloat(spacing5T);
        
        let newPulsingRules = {};
        const carrierHitPairs = new Set();
        if (isCarrierSpacingEnabled && !isNaN(cSpacing)) {
            for (let i = 0; i < validFreqs.length; i++) {
                for (let j = i + 1; j < validFreqs.length; j++) {
                    if (Math.abs(validFreqs[i].freq - validFreqs[j].freq) < cSpacing) {
                        const originalI = validFreqs[i].originalIndex;
                        const originalJ = validFreqs[j].originalIndex;
                        const pairKey = [originalI, originalJ].sort().join('-');
                        carrierHitPairs.add(pairKey);
                        if (!alerts[originalI].includes('Carrier Spacing')) alerts[originalI].push('Carrier Spacing');
                        if (!alerts[originalJ].includes('Carrier Spacing')) alerts[originalJ].push('Carrier Spacing');
                        newPulsingRules.carrier = true;
                    }
                }
            }
        }
        
        const productHits = new Set();
        allImdProducts.forEach((p, productIndex) => {
             for(const f of validFreqs) {
                 if (is2T3OSpacingEnabled && !isNaN(s2t3o) && p.type === '2-TX' && p.order === 3 && Math.abs(p.value - f.freq) < s2t3o) {
                    productHits.add(productIndex);
                    if(!alerts[f.originalIndex].includes('IMD Hit')) alerts[f.originalIndex].push('IMD Hit');
                    newPulsingRules.twoT3O = true;
                 }
                 if (is3T3OSpacingEnabled && !isNaN(s3t3o) && p.type === '3-TX' && p.order === 3 && Math.abs(p.value - f.freq) < s3t3o) {
                    productHits.add(productIndex);
                    if(!alerts[f.originalIndex].includes('IMD Hit')) alerts[f.originalIndex].push('IMD Hit');
                    newPulsingRules.threeT3O = true;
                 }
                 if (is5TSpacingEnabled && !isNaN(s5t) && p.order === 5 && Math.abs(p.value - f.freq) < s5t) {
                    productHits.add(productIndex);
                    if(!alerts[f.originalIndex].includes('IMD Hit')) alerts[f.originalIndex].push('IMD Hit');
                    newPulsingRules.fiveT = true;
                 }
             }
        });

        const displayedProductHits = new Set();
        displayedImdProducts.forEach((p, displayedIndex) => {
            const originalIndex = allImdProducts.findIndex(orig => orig.value === p.value);
            if(productHits.has(originalIndex)) {
                displayedProductHits.add(displayedIndex);
            }
        });
        
        return { alerts, productHits: displayedProductHits, totalHits: productHits.size + carrierHitPairs.size, pulsingRules: newPulsingRules };
    }, [frequencies, allImdProducts, displayedImdProducts, carrierSpacing, isCarrierSpacingEnabled, spacing2T3O, is2T3OSpacingEnabled, spacing3T3O, is3T3OSpacingEnabled, spacing5T, is5TSpacingEnabled]);
    
    useEffect(() => { setPulsingRules(violationData.pulsingRules); }, [violationData.pulsingRules]);

    const hasCarrierSpacingViolation = useMemo(() => violationData.alerts.some(a => a && a.includes('Carrier Spacing')), [violationData.alerts]);

    const getProductStyle = (index) => {
        const product = displayedImdProducts[index];
        let baseStyle = 'border-l-4 p-3 rounded-r-lg shadow-md transition-all duration-300 ';
        if (product.order === 3 && product.type === '2-TX') baseStyle += 'bg-red-800/50 border-red-500';
        else if (product.order === 3 && product.type === '3-TX') baseStyle += 'bg-orange-800/50 border-orange-500';
        else if (product.order === 5) baseStyle += 'bg-yellow-800/50 border-yellow-400';
        else baseStyle += 'bg-zinc-700 border-zinc-500';
        if (violationData.productHits.has(index)) return baseStyle + ' pulsing-hit';
        return baseStyle;
    };

    const SubNavButton = ({ active, onClick, children, icon: SubNavIcon }) => (
        <button onClick={onClick} className={`flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-md transition-colors ${active ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:bg-zinc-800'}`}>
            <SubNavIcon size={16} />{children}
        </button>
    );
    
    return (
        <div>
            <div className="bg-zinc-800 p-6 rounded-lg shadow-xl mb-8">
                 <div className="flex flex-col md:flex-row md:gap-6">
                    <div className="flex-grow">
                         <h2 className="text-xl font-semibold mb-4 text-white">Enter Frequencies (MHz)</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-6">
                            {frequencies.map((freq, index) => {
                                const isNonStandard = !isMultipleOf25(freq);
                                return (
                                <div key={index}>
                                    {violationData.alerts[index].length > 0 && (
                                        <div className="flex items-center gap-1 text-red-400 text-xs font-bold mb-1"><AlertTriangle size={12}/> {violationData.alerts[index][0]}</div>
                                    )}
                                    <label htmlFor={`freq-${index}`} className={`block text-sm font-medium mb-1 ${violationData.alerts[index].length > 0 ? 'text-red-400' : isNonStandard ? 'text-yellow-400' : 'text-zinc-400'}`}>Freq {index + 1}</label>
                                    <input id={`freq-${index}`} type="text" value={freq} onChange={(e) => handleFrequencyChange(index, e.target.value)} placeholder="e.g., 512.250" className={`w-full bg-zinc-700 border rounded-md px-3 py-2 placeholder-zinc-500 focus:ring-2 focus:outline-none transition ${violationData.alerts[index].length > 0 || isNonStandard ? 'border-red-500 focus:ring-red-500 text-red-400' : 'border-zinc-600 focus:ring-cyan-500 text-white'}`}/>
                                </div>
                            )})}
                        </div>
                        <button onClick={handleClear} className="mt-4 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold py-1 px-4 rounded-md transition duration-200">
                                Clear
                        </button>
                    </div>
                     <div className="bg-zinc-900/50 p-4 rounded-lg flex-shrink-0 mt-6 md:mt-0 md:w-auto">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-semibold text-white">📐 Rules</h3>
                            <button onClick={handleRestoreDefaults} className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300"><RotateCcw size={12}/> Defaults</button>
                        </div>
                         <div className="space-y-3">
                             <div className="flex items-center gap-3"><input id="calc-enable-carrier-spacing" type="checkbox" checked={isCarrierSpacingEnabled} onChange={(e) => setIsCarrierSpacingEnabled(e.target.checked)} className="h-4 w-4 rounded bg-zinc-700 border-zinc-600 text-cyan-600 focus:ring-cyan-500"/><label htmlFor="calc-carrier-spacing" className={`text-sm font-medium text-zinc-400 flex-1 ${pulsingRules.carrier ? 'pulsing-red' : ''}`}>Carrier Spacing</label><input id="calc-carrier-spacing" type="text" value={carrierSpacing} onChange={e => setCarrierSpacing(e.target.value)} disabled={!isCarrierSpacingEnabled} className="w-24 bg-zinc-700 border border-zinc-600 rounded-md px-2 py-1 text-white disabled:bg-zinc-800 disabled:text-zinc-500"/></div>
                             <div className="flex items-center gap-3"><input id="calc-enable-2t3o-spacing" type="checkbox" checked={is2T3OSpacingEnabled} onChange={(e) => setIs2T3OSpacingEnabled(e.target.checked)} className="h-4 w-4 rounded bg-zinc-700 border-zinc-600 text-cyan-600 focus:ring-cyan-500"/><label htmlFor="calc-2t3o-spacing" className={`text-sm font-medium text-zinc-400 flex-1 ${pulsingRules.twoT3O ? 'pulsing-red' : ''}`}>2T3O Spacing</label><input id="calc-2t3o-spacing" type="text" value={spacing2T3O} onChange={e => setSpacing2T3O(e.target.value)} disabled={!is2T3OSpacingEnabled} className="w-24 bg-zinc-700 border border-zinc-600 rounded-md px-2 py-1 text-white disabled:bg-zinc-800 disabled:text-zinc-500"/></div>
                             <div className="flex items-center gap-3"><input id="calc-enable-3t3o-spacing" type="checkbox" checked={is3T3OSpacingEnabled} onChange={(e) => setIs3T3OSpacingEnabled(e.target.checked)} className="h-4 w-4 rounded bg-zinc-700 border-zinc-600 text-cyan-600 focus:ring-cyan-500"/><label htmlFor="calc-3t3o-spacing" className={`text-sm font-medium text-zinc-400 flex-1 ${pulsingRules.threeT3O ? 'pulsing-red' : ''}`}>3T3O Spacing</label><input id="calc-3t3o-spacing" type="text" value={spacing3T3O} onChange={e => setSpacing3T3O(e.target.value)} disabled={!is3T3OSpacingEnabled} className="w-24 bg-zinc-700 border border-zinc-600 rounded-md px-2 py-1 text-white disabled:bg-zinc-800 disabled:text-zinc-500"/></div>
                             <div className="flex items-center gap-3"><input id="calc-enable-5t-spacing" type="checkbox" checked={is5TSpacingEnabled} onChange={(e) => setIs5TSpacingEnabled(e.target.checked)} className="h-4 w-4 rounded bg-zinc-700 border-zinc-600 text-cyan-600 focus:ring-cyan-500"/><label htmlFor="calc-5t-spacing" className={`text-sm font-medium text-zinc-400 flex-1 ${pulsingRules.fiveT ? 'pulsing-red' : ''}`}>2T5O Spacing</label><input id="calc-5t-spacing" type="text" value={spacing5T} onChange={e => setSpacing5T(e.target.value)} disabled={!is5TSpacingEnabled} className="w-24 bg-zinc-700 border border-zinc-600 rounded-md px-2 py-1 text-white disabled:bg-zinc-800 disabled:text-zinc-500"/></div>
                         </div>
                    </div>
                </div>
            </div>
            <div>
                 <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
                    <div className="flex items-center gap-4">
                         <h2 className="text-xl font-semibold text-white">Analysis Results 🔎</h2>
                         <div className="flex items-center gap-1 p-1 bg-zinc-900/50 rounded-lg">
                            <SubNavButton onClick={() => setViewMode('grid')} active={viewMode === 'grid'} icon={LayoutGrid}>Grid View</SubNavButton>
                            <SubNavButton onClick={() => setViewMode('graph')} active={viewMode === 'graph'} icon={BarChart2}>Graph</SubNavButton>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                         {violationData.totalHits > 0 ? (
                            <div className="flex items-center gap-2 text-red-400 font-bold" title="Direct Hits">
                                <AlertTriangle size={20} />
                                <span>{violationData.totalHits} <span className="text-red-400">Hits</span></span>
                            </div>
                         ) : (frequencies.filter(f => f !== '').length > 1 &&
                            <CheckCircle size={20} className="text-green-500" title="No Violations" />
                         )}
                        <div className="flex items-start gap-2 sm:gap-3 text-sm bg-zinc-800/50 p-2 rounded-lg">
                            <div className={`text-center px-1 ${!is2T3OSpacingEnabled ? 'opacity-40' : ''}`}>
                                 <div className="flex items-center justify-center gap-2 h-6" title="2-Tone 3rd-Order Products">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                                    <span className="font-bold text-lg text-white">{counts.twoToneThirdOrder}</span>
                                    <span className="text-zinc-400">2T3O</span>
                                </div>
                                <div className="text-xs text-zinc-500 font-mono mt-0.5 whitespace-nowrap">
                                    <p>2f₁-f₂</p><p>2f₂-f₁</p>
                                </div>
                            </div>
                             <div className="h-full self-stretch border-l border-zinc-700"></div>
                             <div className={`text-center px-1 ${!is3T3OSpacingEnabled ? 'opacity-40' : ''}`}>
                                 <div className="flex items-center justify-center gap-2 h-6" title="3-Tone 3rd-Order Products">
                                    <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>
                                    <span className="font-bold text-lg text-white">{counts.threeToneThirdOrder}</span>
                                    <span className="text-zinc-400">3T3O</span>
                                </div>
                                <div className="text-xs text-zinc-500 font-mono mt-0.5 whitespace-nowrap">
                                   <p>f₁+f₂-f₃</p><p>f₁+f₃-f₂</p><p>f₂+f₃-f₁</p>
                                </div>
                            </div>
                            <div className="h-full self-stretch border-l border-zinc-700"></div>
                            <div className={`text-center px-1 ${!is5TSpacingEnabled ? 'opacity-40' : ''}`}>
                                 <div className="flex items-center justify-center gap-2 h-6" title="5th-Order Products">
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                                    <span className="font-bold text-lg text-white">{counts.fifthOrder}</span>
                                    <span className="text-zinc-400">2T5O</span>
                                </div>
                                 <div className="text-xs text-zinc-500 font-mono mt-0.5 whitespace-nowrap">
                                    <p>3f₁-2f₂</p><p>3f₂-2f₁</p>
                                </div>
                            </div>
                            <div className="h-full self-stretch border-l border-zinc-700"></div>
                            <div className="text-center pl-2 pr-1" title="Total Products">
                                <div className="flex items-center justify-center h-6">
                                   <span className="font-bold text-xl text-white">{displayedImdProducts.length}</span>
                                </div>
                                 <p className="text-xs text-zinc-400 mt-0.5">Total IMD</p>
                            </div>
                        </div>
                    </div>
                </div>
                {frequencies.filter(f => f).length < 2 ? (
                     <div className="text-center py-10 border-2 border-dashed border-zinc-700 rounded-lg"><p className="text-zinc-400">Enter at least two frequencies to see IMD results.</p></div>
                ) : (
                    viewMode === 'grid' ? (
                        displayedImdProducts.length > 0 ? (
                             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {displayedImdProducts.map((p, i) => (
                                    <div key={i} className={getProductStyle(i)}>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                {violationData.productHits.has(i) && (<div className="flex items-center gap-2 text-red-400 font-bold text-xs mb-1"><AlertTriangle size={14} /><span>IMD HIT!</span></div>)}
                                                <p className="text-2xl font-bold font-mono text-white">{p.value.toFixed(3)}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm font-semibold text-zinc-300">{p.order}rd Order <span className="text-zinc-400">({p.type})</span></p>
                                        <p className="text-xs font-mono text-cyan-400/70 mt-1 truncate" title={p.formula}>{p.formula}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            hasCarrierSpacingViolation ? (
                                <div className="text-center py-10 border-2 border-dashed border-red-700 rounded-lg bg-red-900/30 text-red-300">
                                     <XCircle className="mx-auto h-12 w-12"/>
                                    <p className="mt-4 font-semibold">Direct hit channel spacing violations</p>
                                </div>
                            ) : (
                                <div className="text-center py-10 border-2 border-dashed border-green-700 rounded-lg bg-green-900/30 text-green-300"><CheckCircle className="mx-auto h-12 w-12"/><p className="mt-4 font-semibold">No intermodulation products found.</p></div>
                            )
                        )
                    ) : (
                        <div className="bg-zinc-800 p-4 rounded-lg shadow-md">
                            <SpectrumGraph carriers={frequencies.map(f => parseFloat(f)).filter(f => !isNaN(f))} imdProducts={displayedImdProducts} />
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

function IMDGeneratorPage() {
    const [lowerBound, setLowerBound] = useState('470.000');
    const [upperBound, setUpperBound] = useState('608.000');
    const [numFrequencies, setNumFrequencies] = useState('8');
    const [carrierSpacing, setCarrierSpacing] = useState('0.350');
    const [isCarrierSpacingEnabled, setIsCarrierSpacingEnabled] = useState(true);
    const [spacing2T3O, setSpacing2T3O] = useState('0.075');
    const [is2T3OSpacingEnabled, setIs2T3OSpacingEnabled] = useState(true);
    const [spacing3T3O, setSpacing3T3O] = useState('0.50');
    const [is3T3OSpacingEnabled, setIs3T3OSpacingEnabled] = useState(false);
    const [spacing5T, setSpacing5T] = useState('0.50');
    const [is5TSpacingEnabled, setIs5TSpacingEnabled] = useState(false);
    
    const [generatedLists, setGeneratedLists] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [generationRulesSnapshot, setGenerationRulesSnapshot] = useState(null);

    const isNumFreqsInvalid = useMemo(() => {
        if (numFrequencies === '') return false;
        const num = parseInt(numFrequencies, 10);
        return isNaN(num) || num < 1 || num > 8;
    }, [numFrequencies]);

    const handleRestoreDefaults = () => {
        setCarrierSpacing('0.350'); setSpacing2T3O('0.075'); setSpacing3T3O('0.50'); setSpacing5T('0.50');
        setIsCarrierSpacingEnabled(true); setIs2T3OSpacingEnabled(true); setIs3T3OSpacingEnabled(false); setIs5TSpacingEnabled(false);
    };

    const handleGenerate = useCallback(() => {
        const lower = parseFloat(lowerBound), upper = parseFloat(upperBound), numFreqs = parseInt(numFrequencies, 10);
        const cSpacing = parseFloat(carrierSpacing), s2t3o = parseFloat(spacing2T3O), s3t3o = parseFloat(spacing3T3O), s5t = parseFloat(spacing5T);
        
        if (isNaN(numFreqs) || numFreqs < 1 || numFreqs > 8 || isNaN(lower) || isNaN(upper) || (isCarrierSpacingEnabled && isNaN(cSpacing)) || (is2T3OSpacingEnabled && isNaN(s2t3o)) || (is3T3OSpacingEnabled && isNaN(s3t3o)) || (is5TSpacingEnabled && isNaN(s5t)) || lower >= upper) {
            setError('Please enter valid numeric values for all enabled fields.'); return;
        }
        setError(''); setIsGenerating(true); setGeneratedLists([]); setExpandedIndex(null);
        setGenerationRulesSnapshot({ isCarrierSpacingEnabled, is2T3OSpacingEnabled, is3T3OSpacingEnabled, is5TSpacingEnabled, carrierSpacing, spacing2T3O, spacing3T3O, spacing5T });

        setTimeout(() => {
            const results = [];
            const channelPool = [];
            for (let f = lower; f <= upper; f += 0.025) { channelPool.push(f); }
            
            if (channelPool.length < numFreqs) { setError(`The specified range is too small to generate ${numFreqs} channels.`); setIsGenerating(false); return; }
            const maxAttempts = 500, targetListCount = 20;

            for (let i = 0; i < maxAttempts && results.length < targetListCount; i++) {
                let currentPool = [...channelPool].sort(() => 0.5 - Math.random());
                const list = [];
                for (const candidateFreq of currentPool) {
                    if (list.length >= numFreqs) break;
                    let isValid = true;
                    if (isCarrierSpacingEnabled) {
                        for (const existingFreq of list) { if (Math.abs(candidateFreq - existingFreq) < cSpacing) { isValid = false; break; } }
                    }
                    if (!isValid) continue;
                    const tempList = [...list, candidateFreq];
                    const { imdProducts: tempImd } = calculateIMD(tempList);
                    for (const product of tempImd) {
                         for (const carrier of tempList) {
                            if (is2T3OSpacingEnabled && product.type === '2-TX' && product.order === 3 && Math.abs(product.value - carrier) < s2t3o) {isValid = false; break;}
                            if (is3T3OSpacingEnabled && product.type === '3-TX' && product.order === 3 && Math.abs(product.value - carrier) < s3t3o) {isValid = false; break;}
                            if (is5TSpacingEnabled && product.order === 5 && Math.abs(product.value - carrier) < s5t) {isValid = false; break;}
                         }
                         if (!isValid) break;
                    }
                    if (isValid) { list.push(candidateFreq); }
                }
                if (list.length === numFreqs) {
                    const sortedList = list.sort((a, b) => a - b);
                    const { imdProducts, counts } = calculateIMD(sortedList);
                    results.push({ list: sortedList, imdProducts, counts });
                }
            }
            results.sort((a, b) => a.counts.total - b.counts.total);
            setGeneratedLists(results);
            if (results.length === 0) { setError("Could not generate any valid lists. Try relaxing the constraints."); }
            setIsGenerating(false);
        }, 50);
    }, [lowerBound, upperBound, numFrequencies, carrierSpacing, isCarrierSpacingEnabled, spacing2T3O, is2T3OSpacingEnabled, spacing3T3O, is3T3OSpacingEnabled, spacing5T, is5TSpacingEnabled]);
    
    const handleToggleExpand = (index) => setExpandedIndex(expandedIndex === index ? null : index);

    const showGeneratorQuestionMark = useMemo(() => {
        if (!generationRulesSnapshot || generatedLists.length === 0) return false;
        const snapshot = generationRulesSnapshot;
        if (isCarrierSpacingEnabled !== snapshot.isCarrierSpacingEnabled || (isCarrierSpacingEnabled && parseFloat(carrierSpacing) !== parseFloat(snapshot.carrierSpacing))) return true;
        if (is2T3OSpacingEnabled !== snapshot.is2T3OSpacingEnabled || (is2T3OSpacingEnabled && parseFloat(spacing2T3O) !== parseFloat(snapshot.spacing2T3O))) return true;
        if (is3T3OSpacingEnabled !== snapshot.is3T3OSpacingEnabled || (is3T3OSpacingEnabled && parseFloat(spacing3T3O) !== parseFloat(snapshot.spacing3T3O))) return true;
        if (is5TSpacingEnabled !== snapshot.is5TSpacingEnabled || (is5TSpacingEnabled && parseFloat(spacing5T) !== parseFloat(snapshot.spacing5T))) return true;
        return false;
    }, [carrierSpacing, isCarrierSpacingEnabled, spacing2T3O, is2T3OSpacingEnabled, spacing3T3O, is3T3OSpacingEnabled, spacing5T, is5TSpacingEnabled, generationRulesSnapshot, generatedLists]);

    return (
        <div>
            <div className="bg-zinc-800 p-6 rounded-lg shadow-xl mb-8">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <h2 className="text-xl font-semibold mb-4 text-white">🤖 Generator Settings</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div><label htmlFor="lower" className="block text-sm font-medium text-zinc-400 mb-1">Lower Bound (MHz)</label><input id="lower" type="text" value={lowerBound} onChange={e => setLowerBound(e.target.value)} className="w-full bg-zinc-700 border border-zinc-600 rounded-md px-3 py-2 text-white placeholder-zinc-500 focus:ring-2 focus:ring-cyan-500"/></div>
                            <div><label htmlFor="upper" className="block text-sm font-medium text-zinc-400 mb-1">Upper Bound (MHz)</label><input id="upper" type="text" value={upperBound} onChange={e => setUpperBound(e.target.value)} className="w-full bg-zinc-700 border border-zinc-600 rounded-md px-3 py-2 text-white placeholder-zinc-500 focus:ring-2 focus:ring-cyan-500"/></div>
                        </div>
                    </div>
                    <div className="bg-zinc-900/50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-3">
                             <h3 className="text-lg font-semibold text-white">📐 Rules</h3>
                             <button onClick={handleRestoreDefaults} className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300"><RotateCcw size={12}/> Defaults</button>
                        </div>
                         <div className="space-y-3">
                             <div className="flex items-center gap-3"><input id="enable-carrier-spacing" type="checkbox" checked={isCarrierSpacingEnabled} onChange={(e) => setIsCarrierSpacingEnabled(e.target.checked)} className="h-4 w-4 rounded bg-zinc-700 border-zinc-600 text-cyan-600 focus:ring-cyan-500"/><label htmlFor="carrier-spacing" className="text-sm font-medium text-zinc-400 flex-1">Carrier Spacing</label><input id="carrier-spacing" type="text" value={carrierSpacing} onChange={e => setCarrierSpacing(e.target.value)} disabled={!isCarrierSpacingEnabled} className="w-24 bg-zinc-700 border border-zinc-600 rounded-md px-2 py-1 text-white disabled:bg-zinc-800 disabled:text-zinc-500"/></div>
                             <div className="flex items-center gap-3"><input id="enable-2t3o-spacing" type="checkbox" checked={is2T3OSpacingEnabled} onChange={(e) => setIs2T3OSpacingEnabled(e.target.checked)} className="h-4 w-4 rounded bg-zinc-700 border-zinc-600 text-cyan-600 focus:ring-cyan-500"/><label htmlFor="2t3o-spacing" className="text-sm font-medium text-zinc-400 flex-1">2T3O Spacing</label><input id="2t3o-spacing" type="text" value={spacing2T3O} onChange={e => setSpacing2T3O(e.target.value)} disabled={!is2T3OSpacingEnabled} className="w-24 bg-zinc-700 border border-zinc-600 rounded-md px-2 py-1 text-white disabled:bg-zinc-800 disabled:text-zinc-500"/></div>
                             <div className="flex items-center gap-3"><input id="enable-3t3o-spacing" type="checkbox" checked={is3T3OSpacingEnabled} onChange={(e) => setIs3T3OSpacingEnabled(e.target.checked)} className="h-4 w-4 rounded bg-zinc-700 border-zinc-600 text-cyan-600 focus:ring-cyan-500"/><label htmlFor="3t3o-spacing" className="text-sm font-medium text-zinc-400 flex-1">3T3O Spacing</label><input id="3t3o-spacing" type="text" value={spacing3T3O} onChange={e => setSpacing3T3O(e.target.value)} disabled={!is3T3OSpacingEnabled} className="w-24 bg-zinc-700 border border-zinc-600 rounded-md px-2 py-1 text-white disabled:bg-zinc-800 disabled:text-zinc-500"/></div>
                             <div className="flex items-center gap-3"><input id="gen-5th-spacing" type="checkbox" checked={is5TSpacingEnabled} onChange={(e) => setIs5TSpacingEnabled(e.target.checked)} className="h-4 w-4 rounded bg-zinc-700 border-zinc-600 text-cyan-600 focus:ring-cyan-500"/><label htmlFor="gen-5th-spacing" className="text-sm font-medium text-zinc-400 flex-1">2T5O Spacing</label><input id="gen-5th-spacing" type="text" value={spacing5T} onChange={e => setSpacing5T(e.target.value)} disabled={!is5TSpacingEnabled} className="w-24 bg-zinc-700 border border-zinc-600 rounded-md px-2 py-1 text-white disabled:bg-zinc-800 disabled:text-zinc-500"/></div>
                         </div>
                    </div>
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                     {generatedLists.length > 0 && (
                         showGeneratorQuestionMark ? 
                         <HelpCircle size={24} className="text-cyan-500" title="Rules have changed since generation. Results may not be compliant with current settings."/> : 
                         <CheckCircle size={24} className="text-green-500" title="Lists are compliant with the rules set at time of generation."/>
                     )}
                    <button onClick={handleGenerate} disabled={isGenerating} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-6 rounded-md transition duration-200 disabled:bg-zinc-600 disabled:cursor-wait">{isGenerating ? <><Loader2/> Generating...</> : 'Generate Lists'}</button>
                    <div className="flex items-center gap-2">
                        <label htmlFor="num-freqs" className="text-sm font-medium text-zinc-400">Frequencies to find:</label>
                        <input id="num-freqs" type="number" min="1" max="8" value={numFrequencies} onChange={e => setNumFrequencies(e.target.value)} className={`w-20 bg-zinc-700 border rounded-md px-3 py-1 focus:ring-2 focus:outline-none transition ${isNumFreqsInvalid ? 'border-red-500 text-red-400 focus:ring-red-500' : 'border-zinc-600 text-white focus:ring-cyan-500'}`} />
                    </div>
                </div>
                {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
            </div>
            {isGenerating && (<div className="text-center py-10"><Loader2 size={48} className="mx-auto text-cyan-400"/></div>)}
            {!isGenerating && generatedLists.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Generated Lists (Sorted from least to most total IMD products)</h3>
                    {generatedLists.map((item, index) => (
                        <div key={index} className="bg-zinc-800 rounded-lg shadow-md transition-all duration-300">
                            <div className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer" onClick={() => handleToggleExpand(index)}>
                                <div className="flex-grow"><div className="flex items-center gap-3 mb-2"><p className="text-sm font-bold text-cyan-300">List #{index + 1}</p><ChevronDown size={16} className={`text-zinc-400 transition-transform duration-200 ${expandedIndex === index ? 'rotate-180' : ''}`}/></div><div className={`grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 font-mono text-sm`}>{item.list.map(freq => <span key={freq} className={!isMultipleOf25(freq) ? 'text-yellow-400' : 'text-white'}>{freq.toFixed(3)}</span>)}</div></div>
                                <div className="bg-zinc-900 px-4 py-3 rounded-md text-center flex-shrink-0 w-44">
                                    <span className="text-2xl font-bold text-white">{item.counts.total}</span>
                                    <p className="text-xs text-zinc-400 -mt-1">Total IMD</p>
                                    <div className="border-t border-zinc-700 my-2"></div>
                                    <div className="flex justify-between items-center text-xs">
                                        <div className={`transition-opacity ${!generationRulesSnapshot?.is2T3OSpacingEnabled ? 'opacity-40' : 'text-red-400/90'}`} title="2-Transmitter 3rd Order"><span className="font-bold text-base">{item.counts.twoToneThirdOrder}</span><p className="-mt-1 text-zinc-500">2T3O</p></div>
                                        <div className={`transition-opacity ${!generationRulesSnapshot?.is3T3OSpacingEnabled ? 'opacity-40' : 'text-orange-400/90'}`} title="3-Transmitter 3rd Order"><span className="font-bold text-base">{item.counts.threeToneThirdOrder}</span><p className="-mt-1 text-zinc-500">3T3O</p></div>
                                        <div className={`transition-opacity ${!generationRulesSnapshot?.is5TSpacingEnabled ? 'opacity-40' : 'text-yellow-400/90'}`} title="5th Order"><span className="font-bold text-base">{item.counts.fifthOrder}</span><p className="-mt-1 text-zinc-500">2T5O</p></div>
                                    </div>
                                </div>
                            </div>
                            {expandedIndex === index && (
                                <div className="p-4 border-t border-zinc-700/50">
                                    <SpectrumGraph carriers={item.list} imdProducts={item.imdProducts.filter(p => {
                                        if (p.order === 3 && p.type === '2-TX' && !generationRulesSnapshot?.is2T3OSpacingEnabled) return false;
                                        if (p.order === 3 && p.type === '3-TX' && !generationRulesSnapshot?.is3T3OSpacingEnabled) return false;
                                        if (p.order === 5 && !generationRulesSnapshot?.is5TSpacingEnabled) return false;
                                        return true;
                                    })} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
            {!isGenerating && generatedLists.length === 0 && (<div className="text-center py-10 border-2 border-dashed border-zinc-700 rounded-lg"><p className="text-zinc-400">Results will be displayed here.</p></div>)}
        </div>
    );
}

const SpectrumGraph = ({ carriers, imdProducts }) => {
    const [tooltip, setTooltip] = useState({ show: false, content: '', x: 0, y: 0 });
    const handleMouseOver = (e, content) => { setTooltip({ show: true, content, x: e.clientX, y: e.clientY }); };
    const handleMouseOut = () => { setTooltip({ show: false, content: '', x: 0, y: 0 }); };
    const handleMouseMove = (e) => { if (tooltip.show) { setTooltip(prev => ({ ...prev, x: e.clientX, y: e.clientY })); } };

    if (!carriers || carriers.length === 0) return null;
    const allFrequencies = [...carriers, ...imdProducts.map(p => p.value)];
    const minFreq = Math.min(...allFrequencies), maxFreq = Math.max(...allFrequencies);
    const padding = (maxFreq - minFreq) * 0.05 || 1;
    const rangeStart = minFreq - padding, rangeEnd = maxFreq + padding;
    const totalRange = rangeEnd - rangeStart;
    const freqToX = (freq) => ((freq - rangeStart) / totalRange) * 100;
    const getIMDColor = (p) => p.order === 3 ? (p.type === '2-TX' ? '#EF4444' : '#F97316') : p.order === 5 ? '#EAB308' : '#6B7280';
    const getIMDHeight = (p) => p.order === 3 ? (p.type === '2-TX' ? '50' : '70') : p.order === 5 ? '90' : '100';

    return (
        <div className="relative w-full bg-zinc-900/70 p-4 rounded-lg" onMouseMove={handleMouseMove}>
            {tooltip.show && <div style={{ left: tooltip.x + 15, top: tooltip.y + 15, position: 'fixed' }} className="z-10 p-2 text-xs font-mono text-white bg-black rounded-md pointer-events-none">{tooltip.content}</div>}
            <svg width="100%" height="150" className="overflow-visible">
                <line x1="0" y1="120" x2="100%" y2="120" stroke="#4B5563" />
                <text x="0" y="140" fill="#9CA3AF" className="text-xs font-mono">{rangeStart.toFixed(2)}</text>
                <text x="50%" y="140" fill="#9CA3AF" textAnchor="middle" className="text-xs font-mono">Frequency (MHz)</text>
                <text x="100%" y="140" fill="#9CA3AF" textAnchor="end" className="text-xs font-mono">{rangeEnd.toFixed(2)}</text>
                {imdProducts.map((p, i) => <line key={`imd-${i}`} x1={`${freqToX(p.value)}%`} y1="120" x2={`${freqToX(p.value)}%`} y2={getIMDHeight(p)} stroke={getIMDColor(p)} strokeWidth="4" onMouseOver={(e) => handleMouseOver(e, `IMD Order ${p.order} (${p.type.replace('-', ' ')}): ${p.value.toFixed(3)}`)} onMouseOut={handleMouseOut}/>)}
                {carriers.map((freq, i) => <line key={`carrier-${i}`} x1={`${freqToX(freq)}%`} y1="120" x2={`${freqToX(freq)}%`} y2="20" stroke="#22C55E" strokeWidth="4" onMouseOver={(e) => handleMouseOver(e, `Carrier: ${freq.toFixed(3)}`)} onMouseOut={handleMouseOut}/>)}
            </svg>
        </div>
    );
};

// --- This is the most important part ---
// It finds the 'root' div in your HTML and tells React to render your App component inside it.
// Babel needs to run before this line executes.
const domContainer = document.querySelector('#root');
const root = ReactDOM.createRoot(domContainer);
root.render(React.createElement(App));
