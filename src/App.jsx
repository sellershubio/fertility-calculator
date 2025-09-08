import React, { useMemo, useState } from "react";

/**
 * Extended Fertility Score Predictor (FSP)
 * Original 7 fields (max 21) + 6 new fields (max 18) = total max 39.
 * Colour-code bands:
 *   Green 30–39, Blue 20–29, Orange 10–19, Red 5–9, Black <5.
 */

export default function FSPCalculator() {
  const [age, setAge] = useState(30);
  const [marriageYears, setMarriageYears] = useState(2);
  const [lifestyle, setLifestyle] = useState("Active");
  const [menstruation, setMenstruation] = useState("Regular");
  const [sexFrequency, setSexFrequency] = useState("Regular");
  const [diagnosis, setDiagnosis] = useState("No factor");
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);

  // New fields
  const [ovulation, setOvulation] = useState("Always");
  const [stress, setStress] = useState("Low");
  const [sleep, setSleep] = useState("Good");
  const [diet, setDiet] = useState("Balanced");
  const [substance, setSubstance] = useState("None");
  const [familyHistory, setFamilyHistory] = useState("No history");

  const [showDetails, setShowDetails] = useState(false);

  const bmi = useMemo(() => {
    const heightInM = height / 100;
    if (heightInM === 0) return 0;
    return +(weight / (heightInM * heightInM)).toFixed(1);
  }, [weight, height]);

  const scoreMap = useMemo(() => {
    function scoreAge(v) {
      if (v >= 21 && v <= 30) return 3;
      if (v >= 31 && v <= 35) return 2;
      if (v >= 36 && v <= 40) return 1;
      if (v > 40) return 0;
      return 0;
    }

    function scoreBMI(v) {
      if (v >= 24 && v <= 28) return 3;
      if (v >= 29 && v <= 35) return 2;
      if (v < 22) return 1;
      if (v > 35) return 0;
      if (v >= 22 && v < 24) return 2;
      if (v > 28 && v < 29) return 2;
      return 1;
    }

    function scoreMarriageYears(v) {
      if (v === 2) return 3;
      if (v >= 3 && v <= 5) return 2;
      if (v >= 6 && v <= 7) return 1;
      if (v > 7) return 0;
      if (v >= 1 && v < 2) return 3;
      return 0;
    }

    function scoreLifestyle(v) {
      return { Active: 3, Good: 2, Moderate: 1, Sedentary: 0 }[v] ?? 1;
    }

    function scoreMenstruation(v) {
      return { Regular: 3, "Regularly/irregular": 2, Irregular: 1, "Irregularly/irregular": 0 }[v] ?? 1;
    }

    function scoreSex(v) {
      return { Regular: 3, Irregular: 2, "Once a week": 1, "Once a month": 0 }[v] ?? 1;
    }

    function scoreDiagnosis(v) {
      return { "No factor": 3, "One factor": 2, "Two factors": 1, "Multiple factors": 0 }[v] ?? 1;
    }

    // New scoring
    function scoreOvulation(v) {
      return { Always: 3, Mostly: 2, Rare: 1, None: 0 }[v] ?? 1;
    }

    function scoreStress(v) {
      return { Low: 3, Moderate: 2, High: 1, Severe: 0 }[v] ?? 1;
    }

    function scoreSleep(v) {
      return { Good: 3, Fair: 2, Poor: 1, Insomnia: 0 }[v] ?? 1;
    }

    function scoreDiet(v) {
      return { Balanced: 3, "Mostly balanced": 2, Junk: 1, Poor: 0 }[v] ?? 1;
    }

    function scoreSubstance(v) {
      return { None: 3, Occasional: 2, Frequent: 1, Daily: 0 }[v] ?? 1;
    }

    function scoreFamilyHistory(v) {
      return { "No history": 3, Remote: 2, Close: 1, Multiple: 0 }[v] ?? 1;
    }

    const parts = {
      age: scoreAge(age),
      bmi: scoreBMI(bmi),
      marriage: scoreMarriageYears(marriageYears),
      lifestyle: scoreLifestyle(lifestyle),
      menstruation: scoreMenstruation(menstruation),
      sex: scoreSex(sexFrequency),
      diagnosis: scoreDiagnosis(diagnosis),
      ovulation: scoreOvulation(ovulation),
      stress: scoreStress(stress),
      sleep: scoreSleep(sleep),
      diet: scoreDiet(diet),
      substance: scoreSubstance(substance),
      familyHistory: scoreFamilyHistory(familyHistory),
    };

    const total = Object.values(parts).reduce((a, b) => a + b, 0);

    function band(totalScore) {
      if (totalScore >= 30) return "Green";
      if (totalScore >= 20) return "Blue";
      if (totalScore >= 10) return "Orange";
      if (totalScore >= 5) return "Red";
      return "Black";
    }

    const color = band(total);
    return { parts, total, color };
  }, [age, bmi, marriageYears, lifestyle, menstruation, sexFrequency, diagnosis, ovulation, stress, sleep, diet, substance, familyHistory]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-6 md:p-10 border border-purple-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
            Fertility Score Predictor (FSP)
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Extended version with lifestyle, health, and family history factors. Educational use only.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card label="Age (years)"><NumberField value={age} setValue={setAge} min={18} max={60} step={1} /><Hint>21–30 → 3, 31–35 → 2, 36–40 → 1, &gt;40 → 0</Hint></Card>
          <Card label="Weight (kg)"><NumberField value={weight} setValue={setWeight} min={30} max={200} step={1} /></Card>
          <Card label="Height (cm)"><NumberField value={height} setValue={setHeight} min={100} max={220} step={1} /></Card>
          <Card label="BMI (kg/m²)"><div className="font-bold text-lg">{bmi}</div><Hint>24–28 → 3, 29–35 → 2, &lt;22 → 1, &gt;35 → 0</Hint></Card>
          <Card label="Marriage duration (years)"><NumberField value={marriageYears} setValue={setMarriageYears} min={0} max={40} step={1} /><Hint>2 → 3, 3–5 → 2, 6–7 → 1, &gt;7 → 0</Hint></Card>
          <Card label="Lifestyle"><Select value={lifestyle} setValue={setLifestyle} options={["Active", "Good", "Moderate", "Sedentary"]} /></Card>
          <Card label="Menstruation pattern"><Select value={menstruation} setValue={setMenstruation} options={["Regular", "Regularly/irregular", "Irregular", "Irregularly/irregular"]} /></Card>
          <Card label="Sexual intercourse"><Select value={sexFrequency} setValue={setSexFrequency} options={["Regular", "Irregular", "Once a week", "Once a month"]} /></Card>
          <Card label="Diagnosis"><Select value={diagnosis} setValue={setDiagnosis} options={["No factor", "One factor", "Two factors", "Multiple factors"]} /></Card>

          {/* New fields */}
          <Card label="Ovulation pattern"><Select value={ovulation} setValue={setOvulation} options={["Always", "Mostly", "Rare", "None"]} /></Card>
          <Card label="Stress level"><Select value={stress} setValue={setStress} options={["Low", "Moderate", "High", "Severe"]} /></Card>
          <Card label="Sleep quality"><Select value={sleep} setValue={setSleep} options={["Good", "Fair", "Poor", "Insomnia"]} /></Card>
          <Card label="Diet quality"><Select value={diet} setValue={setDiet} options={["Balanced", "Mostly balanced", "Junk", "Poor"]} /></Card>
          <Card label="Substance use"><Select value={substance} setValue={setSubstance} options={["None", "Occasional", "Frequent", "Daily"]} /></Card>
          <Card label="Family history"><Select value={familyHistory} setValue={setFamilyHistory} options={["No history", "Remote", "Close", "Multiple"]} /></Card>
        </div>

        <div className="mt-10 p-6 rounded-3xl border bg-gradient-to-r from-purple-50 via-pink-50 to-blue-50 shadow-inner">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <div className="text-sm text-gray-600">Total Score</div>
              <div className="text-4xl font-extrabold text-purple-600">{scoreMap.total} / 39</div>
            </div>
            <Badge color={scoreMap.color}>{scoreMap.color}</Badge>
          </div>

          <button className="mt-5 text-sm px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow" onClick={() => setShowDetails((s) => !s)}>
            {showDetails ? "Hide breakdown" : "Show breakdown"}
          </button>

          {showDetails && (
            <ul className="mt-4 text-sm text-gray-800 space-y-1 bg-white/70 p-4 rounded-xl shadow-sm">
              {Object.entries(scoreMap.parts).map(([k, v]) => (
                <li key={k}>{k}: <b>{v}</b></li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-8 text-xs text-gray-500 leading-relaxed text-center">
          Educational aid only – not a diagnosis.
        </div>
      </div>
    </div>
  );
}

/* --- UI Components --- */
function Card({ label, children }) {
  return (
    <div className="border rounded-2xl p-5 bg-white shadow hover:shadow-lg transition">
      <div className="text-sm font-semibold text-purple-600 mb-2">{label}</div>
      {children}
    </div>
  );
}

function NumberField({ value, setValue, min, max, step }) {
  return (
    <input type="number" className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none" value={value} step={step} min={min} max={max} onChange={(e) => setValue(Number(e.target.value))} />
  );
}

function Select({ value, setValue, options }) {
  return (
    <select className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none" value={value} onChange={(e) => setValue(e.target.value)}>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  );
}

function Badge({ color, children }) {
  const map = {
    Green: "bg-green-500 text-white",
    Blue: "bg-blue-500 text-white",
    Orange: "bg-orange-500 text-white",
    Red: "bg-red-600 text-white",
    Black: "bg-gray-900 text-white",
  };
  return <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-base font-bold shadow ${map[color]}`}>{children}</span>;
}

function Hint({ children }) {
  return <div className="text-xs text-gray-500 mt-1 italic">{children}</div>;
}
