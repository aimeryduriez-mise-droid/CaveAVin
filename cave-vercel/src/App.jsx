import { useState, useRef, useEffect, useCallback } from "react";
 
// ─── URL du backend (proxy Vite en dev, même origine en prod) ────────────────
const API = "/api/claude";
 
const fonts = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Jost:wght@300;400;500&display=swap');`;
 
const G = {
  bg:"#ffffff",surface:"#f7f3ef",card:"#ffffff",border:"#e8ddd4",
  gold:"#b8922e",goldLight:"#d4a84a",cream:"#2a1f14",muted:"#9a8878",
  red:"#8b2535",redLight:"#b83045",green:"#2e8a5a",greenDark:"#e6f5ed",
};
 
const Icon=({name,size=20,color=G.cream})=>{
  const p={stroke:color,strokeWidth:"1.5",fill:"none"};
  const icons={
    wine:<svg width={size}height={size}viewBox="0 0 24 24"{...p}><path d="M8 2h8l1 7a5 5 0 01-10 0L8 2z"/><path d="M12 14v6M9 20h6"/></svg>,
    plus:<svg width={size}height={size}viewBox="0 0 24 24"{...p}><path d="M12 5v14M5 12h14"/></svg>,
    star:<svg width={size}height={size}viewBox="0 0 24 24"fill={color}stroke={color}strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    starE:<svg width={size}height={size}viewBox="0 0 24 24"{...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    sparkle:<svg width={size}height={size}viewBox="0 0 24 24"{...p}><path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2z"/></svg>,
    search:<svg width={size}height={size}viewBox="0 0 24 24"{...p}><circle cx="11"cy="11"r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
    back:<svg width={size}height={size}viewBox="0 0 24 24"{...p}><path d="M19 12H5M12 5l-7 7 7 7"/></svg>,
    edit:<svg width={size}height={size}viewBox="0 0 24 24"{...p}><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    trash:<svg width={size}height={size}viewBox="0 0 24 24"{...p}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg>,
    check:<svg width={size}height={size}viewBox="0 0 24 24"{...p}strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
    cellar:<svg width={size}height={size}viewBox="0 0 24 24"{...p}><rect x="2"y="7"width="20"height="14"rx="2"/><path d="M16 7V5a2 2 0 00-4 0v2M8 7V5a2 2 0 00-4 0v2M2 11h20"/></svg>,
    barcode:<svg width={size}height={size}viewBox="0 0 24 24"{...p}><path d="M3 5v14M7 5v14M11 5v14M13 5v14M17 5v14M21 5v14"/></svg>,
    camera:<svg width={size}height={size}viewBox="0 0 24 24"{...p}><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12"cy="13"r="4"/></svg>,
    label:<svg width={size}height={size}viewBox="0 0 24 24"{...p}><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><circle cx="7"cy="7"r="1.5"fill={color}/></svg>,
    pencil:<svg width={size}height={size}viewBox="0 0 24 24"{...p}><path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>,
    refresh:<svg width={size}height={size}viewBox="0 0 24 24"{...p}><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>,
  };
  return icons[name]||null;
};
 
// ─── Données de démonstration (utilisées uniquement si cave vide) ─────────────
const DEMO = [
  {id:1,nom:"Château Margaux",domaine:"Château Margaux",region:"Bordeaux",appellation:"Margaux",millesime:2015,type:"Rouge",cepages:"Cabernet Sauvignon, Merlot",quantite:3,prix:890,note:5,garde:"2030-2050",commentaire:"Exceptionnel. Notes de cassis, violette et tabac.",couleur:"#6b1520"},
  {id:2,nom:"Puligny-Montrachet",domaine:"Domaine Leflaive",region:"Bourgogne",appellation:"Puligny-Montrachet",millesime:2019,type:"Blanc",cepages:"Chardonnay",quantite:6,prix:145,note:4,garde:"2024-2032",commentaire:"Minéralité pure, fleurs blanches, beurre frais.",couleur:"#d4a843"},
  {id:3,nom:"Hermitage",domaine:"M. Chapoutier",region:"Rhône",appellation:"Hermitage",millesime:2017,type:"Rouge",cepages:"Syrah",quantite:2,prix:78,note:4,garde:"2025-2040",commentaire:"Poivre noir, olive, cuir. Grande longueur.",couleur:"#4a1528"},
];
 
const TYPES=["Rouge","Blanc","Rosé","Effervescent","Doux","Autre"];
const REGIONS=["Bordeaux","Bourgogne","Rhône","Loire","Alsace","Champagne","Languedoc","Provence","Sud-Ouest","Autre"];
const BLANK={nom:"",domaine:"",region:"",appellation:"",millesime:new Date().getFullYear(),type:"Rouge",cepages:"",quantite:1,prix:"",note:3,garde:"",commentaire:"",couleur:"#6b1520"};
const LS_KEY="cave-a-vin-v1";
 
// ─── Appel backend ────────────────────────────────────────────────────────────
const callClaude = async (payload) => {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
};
 
export default function CaveAVin(){
  // ── État ────────────────────────────────────────────────────────────────
  const [bottles, setBottles] = useState(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      return saved ? JSON.parse(saved) : DEMO;
    } catch { return DEMO; }
  });
 
  const [view,setView]=useState("cave");
  const [selected,setSelected]=useState(null);
  const [form,setForm]=useState({});
  const [search,setSearch]=useState("");
  const [filterType,setFilterType]=useState("Tous");
  const [toast,setToast]=useState(null);
  const [recoQ,setRecoQ]=useState("");
  const [recoAns,setRecoAns]=useState("");
  const [recoLoading,setRecoLoading]=useState(false);
  const videoRef=useRef(null);
  const streamRef=useRef(null);
  const intervalRef=useRef(null);
  const [camError,setCamError]=useState(null);
  const [scanStatus,setScanStatus]=useState("idle");
  const [scannedCode,setScannedCode]=useState(null);
  const [extracting,setExtracting]=useState(false);
  const [captured,setCaptured]=useState(null);
  const [prefilled,setPrefilled]=useState(false);
 
  // ── Persistance localStorage ─────────────────────────────────────────────
  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(bottles)); } catch {}
  }, [bottles]);
 
  const showToast=(msg,type="success")=>{setToast({msg,type});setTimeout(()=>setToast(null),2800);};
 
  // ── Caméra ───────────────────────────────────────────────────────────────
  const stopCamera=useCallback(()=>{
    if(intervalRef.current)clearInterval(intervalRef.current);
    if(streamRef.current){streamRef.current.getTracks().forEach(t=>t.stop());streamRef.current=null;}
    setScanStatus("idle");setScannedCode(null);setCaptured(null);setCamError(null);
  },[]);
 
  const startCamera=useCallback(async()=>{
    setCamError(null);
    try{
      const s=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment",width:{ideal:1280},height:{ideal:720}}});
      streamRef.current=s;
      if(videoRef.current){videoRef.current.srcObject=s;await videoRef.current.play();}
    }catch{setCamError("Impossible d'accéder à la caméra. Autorisez l'accès dans votre navigateur.");}
  },[]);
 
  const startBarcodeScan=useCallback(()=>{
    if(!("BarcodeDetector"in window)){setScanStatus("unsupported");return;}
    const det=new window.BarcodeDetector({formats:["ean_13","ean_8","upc_a","upc_e","code_128","code_39"]});
    setScanStatus("scanning");
    intervalRef.current=setInterval(async()=>{
      if(!videoRef.current||videoRef.current.readyState<2)return;
      try{
        const codes=await det.detect(videoRef.current);
        if(codes.length>0){
          clearInterval(intervalRef.current);
          const code=codes[0].rawValue;
          setScannedCode(code);setScanStatus("found");
          await lookupBarcode(code);
        }
      }catch{}
    },400);
  },[]);
 
  useEffect(()=>{
    if(view==="barcode"){startCamera().then(()=>setTimeout(startBarcodeScan,800));}
    else if(view==="label"){startCamera();}
    else{stopCamera();}
    return()=>stopCamera();
  },[view]);
 
  // ── Scan code-barres ─────────────────────────────────────────────────────
  const lookupBarcode=async(code)=>{
    setExtracting(true);
    let pre={...BLANK};
    try{
      // Passe par le backend pour éviter les CORS
      const r=await fetch(`/api/barcode/${code}`);
      const d=await r.json();
      if(d.status===1&&d.product){
        const p=d.product;
        if(p.product_name||p.product_name_fr)pre.nom=p.product_name||p.product_name_fr;
        if(p.brands)pre.domaine=p.brands;
      }
    }catch{}
    try{
      const d=await callClaude({
        model:"claude-sonnet-4-20250514",max_tokens:500,
        system:"Tu es une base de données vinicole. Réponds UNIQUEMENT en JSON valide, sans backticks.",
        messages:[{role:"user",content:`Code-barres: ${code}. Nom partiel: "${pre.nom}", domaine: "${pre.domaine}". Complète ce JSON pour ce vin: {"nom":"","domaine":"","region":"","appellation":"","millesime":null,"type":"Rouge","cepages":"","garde":""}. Laisse vide si inconnu.`}]
      });
      const txt=d.content?.[0]?.text||"{}";
      const json=JSON.parse(txt.replace(/```json|```/g,"").trim());
      pre={...pre,...json,quantite:1,note:3,couleur:typeToColor(json.type)};
    }catch{}
    setExtracting(false);
    setForm(pre);setPrefilled(true);
    setView("form");
    showToast("Données trouvées — vérifiez avant d'enregistrer !");
  };
 
  // ── Photo étiquette ──────────────────────────────────────────────────────
  const captureLabel=async()=>{
    if(!videoRef.current)return;
    const c=document.createElement("canvas");
    c.width=videoRef.current.videoWidth;c.height=videoRef.current.videoHeight;
    c.getContext("2d").drawImage(videoRef.current,0,0);
    const b64=c.toDataURL("image/jpeg",0.85).split(",")[1];
    setCaptured(b64);stopCamera();setExtracting(true);
    try{
      const d=await callClaude({
        model:"claude-sonnet-4-20250514",max_tokens:600,
        system:"Tu es un expert en vins. Réponds UNIQUEMENT en JSON valide, sans backticks.",
        messages:[{role:"user",content:[
          {type:"image",source:{type:"base64",media_type:"image/jpeg",data:b64}},
          {type:"text",text:'Analyse cette étiquette de vin. Retourne UNIQUEMENT ce JSON: {"nom":"","domaine":"","region":"","appellation":"","millesime":null,"type":"Rouge","cepages":"","garde":"","prix":null}. Laisse vide si illisible.'}
        ]}]
      });
      const txt=d.content?.[0]?.text||"{}";
      const json=JSON.parse(txt.replace(/```json|```/g,"").trim());
      setForm({...BLANK,...json,quantite:1,note:3,couleur:typeToColor(json.type),etiquette:b64});
      setPrefilled(true);
      showToast("Étiquette analysée — vérifiez et complétez !");
      setView("form");
    }catch{
      showToast("Analyse impossible — saisie manuelle","error");
      setForm({...BLANK});setPrefilled(false);setView("form");
    }
    setExtracting(false);
  };
 
  // ── Helpers ──────────────────────────────────────────────────────────────
  const typeToColor=t=>({Rouge:"#6b1520",Blanc:"#d4a843",Rosé:"#c4607a",Effervescent:"#7a8fc8",Doux:"#a87a3a"}[t]||"#6b1520");
  const typeColor=t=>({Rouge:"#8b2535",Blanc:"#c8a832",Rosé:"#d4607a",Effervescent:"#7a8fc8",Doux:"#a87a3a"}[t]||G.muted);
 
  // ── Récupération du prix marché via web search ────────────────────────────
  const fetchMarketPrice = async (bottle) => {
    if (!bottle.nom) return;
    try {
      const d = await callClaude({
        model: "claude-sonnet-4-20250514", max_tokens: 400,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        system: "Tu es un expert en prix de vins. Recherche le prix marché actuel de la bouteille demandée. Réponds UNIQUEMENT en JSON valide, sans backticks.",
        messages: [{
          role: "user",
          content: `Recherche le prix moyen actuel de ce vin : "${bottle.nom}" ${bottle.domaine ? `de ${bottle.domaine}` : ""} millésime ${bottle.millesime || "NM"}.
Cherche sur des sites comme Wine-Searcher, Idealwine, iDealwine, La Place de Bordeaux, Cavissima, etc.
Retourne UNIQUEMENT ce JSON :
{
  "prix_moyen": null,
  "prix_min": null,
  "prix_max": null,
  "devise": "EUR",
  "source": "",
  "date": ""
}
Les prix sont par bouteille en euros. null si introuvable.`
        }]
      });
      // Extraire le dernier bloc text de la réponse (après web search)
      const textBlock = d.content?.filter(c => c.type === "text").pop();
      if (!textBlock) return;
      const txt = textBlock.text || "{}";
      const prix = JSON.parse(txt.replace(/```json|```/g, "").trim());
      setBottles(prev => prev.map(b =>
        b.id === bottle.id ? { ...b, prixMarche: prix } : b
      ));
      setSelected(prev => prev?.id === bottle.id ? { ...prev, prixMarche: prix } : prev);
    } catch (e) {
      console.error("Erreur prix marché:", e);
    }
  };
  const fetchCriticRatings = async (bottle) => {
    if(!bottle.nom) return;
    try {
      const d = await callClaude({
        model:"claude-sonnet-4-20250514", max_tokens:600,
        system:"Tu es une encyclopédie vinicole experte. Réponds UNIQUEMENT en JSON valide, sans backticks ni texte autour.",
        messages:[{role:"user", content:`Donne-moi les notes des grands critiques pour ce vin :
Nom: "${bottle.nom}", Domaine: "${bottle.domaine}", Millésime: ${bottle.millesime||"NM"}, Région: "${bottle.region}", Appellation: "${bottle.appellation}".
 
Retourne UNIQUEMENT ce JSON (null si note inconnue) :
{
  "parker": null,
  "winespectator": null,
  "decanter": null,
  "suckling": null,
  "bettanedesseauve": null,
  "resume": ""
}
Les notes Parker/Suckling/WineSpectator sont sur 100, Decanter sur 100, Bettane&Desseauve sur 20.
Le "resume" est une phrase de 1-2 lignes synthétisant le consensus des critiques sur ce vin et millésime (en français). Si le vin est peu connu ou le millésime non noté, dis-le en 1 phrase.`}]
      });
      const txt = d.content?.[0]?.text||"{}";
      const ratings = JSON.parse(txt.replace(/```json|```/g,"").trim());
      // Met à jour la bouteille avec les notes critiques
      setBottles(prev => prev.map(b =>
        b.id === bottle.id ? {...b, critiques: ratings} : b
      ));
      // Met à jour la vue détail si on y est
      setSelected(prev => prev?.id === bottle.id ? {...prev, critiques: ratings} : prev);
    } catch(e) {
      console.error("Erreur récupération critiques:", e);
    }
  };
 
  const saveBottle=()=>{
    if(!form.nom)return showToast("Le nom est requis","error");
    if(view==="edit"){
      const u={...form,quantite:+form.quantite||1,prix:+form.prix||0,note:+form.note||3};
      setBottles(p=>p.map(b=>b.id===form.id?u:b));setSelected(u);
      showToast("Bouteille mise à jour !");setView("detail");
      // Rafraîchit les notes si le nom/millésime a changé
      fetchCriticRatings(u);
      fetchMarketPrice(u);
    }else{
      const newBottle={...form,id:Date.now(),millesime:form.millesime||null,quantite:+form.quantite||1,prix:+form.prix||0,note:+form.note||3};
      setBottles(p=>[newBottle,...p]);
      showToast("Bouteille ajoutée — notes critiques en cours…");
      setPrefilled(false);
      setView("cave");
      // Récupère les notes automatiquement en arrière-plan
      fetchCriticRatings(newBottle);
      fetchMarketPrice(newBottle);
    }
  };
  const deleteBottle=id=>{setBottles(p=>p.filter(b=>b.id!==id));showToast("Bouteille supprimée");setView("cave");};
 
  const Stars=({n,size=14})=><div style={{display:"flex",gap:2}}>{[1,2,3,4,5].map(i=><span key={i}><Icon name={i<=n?"star":"starE"}size={size}color={G.gold}/></span>)}</div>;
  const Tag=({c,ch})=><span style={{background:c+"22",border:`1px solid ${c}44`,color:c,borderRadius:20,padding:"2px 10px",fontSize:11,fontFamily:"'Jost'",fontWeight:500,letterSpacing:1,textTransform:"uppercase"}}>{ch}</span>;
  const inp={background:G.surface,border:`1px solid ${G.border}`,borderRadius:8,color:G.cream,padding:"10px 12px",fontFamily:"'Jost'",fontSize:14,width:"100%",boxSizing:"border-box",outline:"none"};
  const Field=({label,field,type="text",opts,min,max})=>(
    <div style={{marginBottom:14}}>
      <label style={{display:"block",color:G.muted,fontSize:11,fontFamily:"'Jost'",letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>{label}</label>
      {opts?<select value={form[field]||""}onChange={e=>setForm(p=>({...p,[field]:e.target.value}))}style={{...inp,appearance:"none"}}>
        {opts.map(o=><option key={o}value={o}>{o}</option>)}
      </select>:type==="textarea"?
      <textarea value={form[field]||""}onChange={e=>setForm(p=>({...p,[field]:e.target.value}))}rows={3}style={{...inp,resize:"none"}}/>
      :<input type={type}value={form[field]??""}min={min}max={max}onChange={e=>setForm(p=>({...p,[field]:e.target.value}))}style={inp}/>}
    </div>
  );
 
  const filtered=bottles.filter(b=>{
    const q=search.toLowerCase();
    return(b.nom.toLowerCase().includes(q)||b.domaine.toLowerCase().includes(q)||b.region.toLowerCase().includes(q))&&(filterType==="Tous"||b.type===filterType);
  });
 
  // ── Vues ─────────────────────────────────────────────────────────────────
 
  const ViewCave=()=>(
    <div style={{flex:1,overflowY:"auto",padding:"0 16px 100px"}}>
      <div style={{padding:"24px 0 16px",textAlign:"center"}}>
        <div style={{color:G.gold,fontFamily:"'Cormorant Garamond'",fontSize:11,letterSpacing:4,textTransform:"uppercase",marginBottom:4}}>Ma Collection</div>
        <h1 style={{color:G.cream,fontFamily:"'Cormorant Garamond'",fontSize:32,fontWeight:400,margin:0,fontStyle:"italic"}}>Cave à Vin</h1>
        <div style={{color:G.muted,fontFamily:"'Jost'",fontSize:13,marginTop:4}}>{bottles.length} références · {bottles.reduce((a,b)=>a+b.quantite,0)} bouteilles</div>
      </div>
      <div style={{position:"relative",marginBottom:12}}>
        <div style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)"}}><Icon name="search"size={16}color={G.muted}/></div>
        <input placeholder="Rechercher…"value={search}onChange={e=>setSearch(e.target.value)}style={{...inp,paddingLeft:38}}/>
      </div>
      <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:12,scrollbarWidth:"none"}}>
        {["Tous",...TYPES].map(t=>(
          <button key={t}onClick={()=>setFilterType(t)}style={{whiteSpace:"nowrap",background:filterType===t?G.gold:G.surface,color:filterType===t?"#fff":G.muted,border:`1px solid ${filterType===t?G.gold:G.border}`,borderRadius:20,padding:"6px 14px",fontFamily:"'Jost'",fontSize:12,fontWeight:500,cursor:"pointer"}}>{t}</button>
        ))}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {filtered.length===0&&<div style={{textAlign:"center",padding:"40px 0",color:G.muted,fontFamily:"'Cormorant Garamond'",fontSize:20,fontStyle:"italic"}}>Aucune bouteille trouvée</div>}
        {filtered.map(b=>(
          <div key={b.id}onClick={()=>{setSelected(b);setView("detail");}}style={{background:G.card,border:`1px solid ${G.border}`,borderRadius:16,padding:"14px 16px",cursor:"pointer",display:"flex",gap:14,alignItems:"center",boxShadow:"0 1px 8px rgba(60,30,10,0.06)"}}>
            {b.etiquette ? (
              <div style={{width:48,height:48,borderRadius:12,overflow:"hidden",flexShrink:0,border:`1px solid ${G.border}`}}>
                <img src={`data:image/jpeg;base64,${b.etiquette}`} alt="étiquette" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              </div>
            ) : (
              <div style={{width:48,height:48,borderRadius:12,background:`linear-gradient(135deg,${b.couleur},${b.couleur}88)`,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",border:`1px solid ${b.couleur}44`}}>
                <Icon name="wine"size={22}color="rgba(255,255,255,0.7)"/>
              </div>
            )}
            <div style={{flex:1,minWidth:0}}>
              <div style={{color:G.cream,fontFamily:"'Cormorant Garamond'",fontSize:18,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{b.nom}</div>
              <div style={{color:G.muted,fontFamily:"'Jost'",fontSize:12,marginTop:2}}>{b.domaine} · {b.millesime||"NM"}</div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginTop:6}}><Stars n={b.note}/><Tag c={typeColor(b.type)}ch={b.type}/></div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <div style={{color:G.gold,fontFamily:"'Jost'",fontWeight:500,fontSize:15}}>×{b.quantite}</div>
              <div style={{color:G.muted,fontSize:11,fontFamily:"'Jost'"}}>{b.prix?`${b.prix}€`:"—"}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
 
  const ViewAcqMode=()=>(
    <div style={{flex:1,overflowY:"auto",padding:"0 20px 100px"}}>
      <div style={{padding:"24px 0 8px",display:"flex",alignItems:"center",gap:12}}>
        <button onClick={()=>setView("cave")}style={{background:"transparent",border:"none",cursor:"pointer",padding:4}}><Icon name="back"size={22}color={G.cream}/></button>
        <div>
          <div style={{color:G.gold,fontFamily:"'Jost'",fontSize:11,letterSpacing:3,textTransform:"uppercase"}}>Nouvelle entrée</div>
          <h2 style={{color:G.cream,fontFamily:"'Cormorant Garamond'",fontSize:28,fontWeight:400,fontStyle:"italic",margin:0}}>Acquisition</h2>
        </div>
      </div>
      <p style={{color:G.muted,fontFamily:"'Jost'",fontSize:13,lineHeight:1.7,marginBottom:28}}>Comment souhaitez-vous ajouter cette bouteille ?</p>
      {[
        {icon:"pencil",title:"Saisie manuelle",desc:"Remplissez le formulaire champ par champ",bg:`${G.gold}16`,border:`${G.gold}30`,ic:G.gold,action:()=>{setPrefilled(false);setForm({...BLANK});setView("form");}},
        {icon:"barcode",title:"Scanner un code-barres",desc:"Pointez la caméra vers le code EAN/UPC — les données sont récupérées automatiquement",bg:"#e6f5ed",border:"#a8d4bc",ic:G.green,action:()=>setView("barcode")},
        {icon:"label",title:"Photo de l'étiquette",desc:"L'IA analyse l'étiquette et pré-remplit toutes les informations",bg:`${G.redLight}14`,border:`${G.red}33`,ic:G.redLight,action:()=>setView("label")},
      ].map(({icon,title,desc,bg,border,ic,action})=>(
        <div key={title}onClick={action}style={{background:G.card,border:`1px solid ${G.border}`,borderRadius:18,padding:"20px",marginBottom:14,cursor:"pointer",display:"flex",gap:16,alignItems:"flex-start",boxShadow:"0 1px 8px rgba(60,30,10,0.05)"}}>
          <div style={{width:52,height:52,borderRadius:14,background:bg,border:`1px solid ${border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}>
            <Icon name={icon}size={24}color={ic}/>
          </div>
          <div>
            <div style={{color:G.cream,fontFamily:"'Cormorant Garamond'",fontSize:20,fontWeight:600,marginBottom:4}}>{title}</div>
            <div style={{color:G.muted,fontFamily:"'Jost'",fontSize:13,lineHeight:1.6}}>{desc}</div>
          </div>
        </div>
      ))}
      <div style={{background:`${G.gold}0d`,border:`1px solid ${G.gold}22`,borderRadius:12,padding:"12px 16px",marginTop:4}}>
        <p style={{color:G.muted,fontFamily:"'Jost'",fontSize:12,margin:0,lineHeight:1.6}}>✦ Après scan ou photo, vous pourrez vérifier les informations avant d'enregistrer.</p>
      </div>
    </div>
  );
 
  const ViewBarcode=()=>(
    <div style={{flex:1,display:"flex",flexDirection:"column"}}>
      <div style={{padding:"20px 16px 12px",display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
        <button onClick={()=>{stopCamera();setView("acqMode");}}style={{background:"transparent",border:"none",cursor:"pointer",padding:4}}><Icon name="back"size={22}color={G.cream}/></button>
        <div>
          <div style={{color:G.gold,fontFamily:"'Jost'",fontSize:11,letterSpacing:2,textTransform:"uppercase"}}>Acquisition</div>
          <h2 style={{color:G.cream,fontFamily:"'Cormorant Garamond'",fontSize:22,fontWeight:400,fontStyle:"italic",margin:0}}>Code-barres</h2>
        </div>
      </div>
      <div style={{position:"relative",margin:"0 16px",borderRadius:20,overflow:"hidden",background:"#000",aspectRatio:"4/3",flexShrink:0}}>
        <video ref={videoRef}playsInline muted style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none"}}>
          <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.45)"}}/>
          <div style={{position:"relative",width:"76%",height:78,zIndex:2}}>
            {[{t:0,l:0,bt:"2px solid #4aaa7a",bl:"2px solid #4aaa7a"},{t:0,r:0,bt:"2px solid #4aaa7a",br:"2px solid #4aaa7a"},{b:0,l:0,bb:"2px solid #4aaa7a",bl:"2px solid #4aaa7a"},{b:0,r:0,bb:"2px solid #4aaa7a",br:"2px solid #4aaa7a"}].map((s,i)=>(
              <div key={i}style={{position:"absolute",width:18,height:18,...Object.fromEntries(Object.entries(s).map(([k,v])=>[k==="bt"?"borderTop":k==="bb"?"borderBottom":k==="bl"?"borderLeft":k==="br"?"borderRight":k,v]))}}/>
            ))}
            {scanStatus==="scanning"&&<div style={{position:"absolute",left:4,right:4,height:2,background:"#4aaa7a",boxShadow:"0 0 8px #4aaa7a",animation:"scanline 1.8s ease-in-out infinite"}}/>}
          </div>
        </div>
        {scanStatus==="found"&&(
          <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.75)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12}}>
            <div style={{width:58,height:58,borderRadius:"50%",background:"#1a3a2a",border:"2px solid #4aaa7a",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="check"size={28}color="#4aaa7a"/></div>
            <div style={{color:"#4aaa7a",fontFamily:"'Jost'",fontSize:13,fontWeight:500}}>Détecté : {scannedCode}</div>
            {extracting&&<div style={{color:"#c0b0a0",fontFamily:"'Cormorant Garamond'",fontSize:17,fontStyle:"italic"}}>Recherche du vin…</div>}
          </div>
        )}
        {scanStatus==="unsupported"&&(
          <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.8)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:14,padding:28}}>
            <Icon name="barcode"size={40}color="#807060"/>
            <div style={{color:"#f0e8e0",fontFamily:"'Cormorant Garamond'",fontSize:19,fontStyle:"italic",textAlign:"center"}}>Non disponible sur ce navigateur</div>
            <div style={{color:"#a09080",fontFamily:"'Jost'",fontSize:13,textAlign:"center",lineHeight:1.6}}>Requiert Chrome ou Edge. Utilisez la photo d'étiquette.</div>
          </div>
        )}
        {camError&&(
          <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.8)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12,padding:28}}>
            <Icon name="camera"size={40}color="#807060"/>
            <div style={{color:"#f0e8e0",fontFamily:"'Cormorant Garamond'",fontSize:18,fontStyle:"italic",textAlign:"center"}}>{camError}</div>
          </div>
        )}
      </div>
      <style>{`@keyframes scanline{0%,100%{top:6px;}50%{top:calc(100% - 6px);}}`}</style>
      {scanStatus==="scanning"&&<p style={{color:G.muted,fontFamily:"'Jost'",fontSize:13,textAlign:"center",padding:"14px 24px 0"}}>Pointez le code-barres dans la zone</p>}
      <div style={{padding:"14px 16px 20px",display:"flex",gap:10,marginTop:"auto"}}>
        <button onClick={()=>{stopCamera();setPrefilled(false);setForm({...BLANK});setView("form");}}style={{flex:1,background:G.surface,border:`1px solid ${G.border}`,borderRadius:12,padding:"13px",color:G.cream,fontFamily:"'Jost'",fontSize:13,cursor:"pointer"}}>Saisie manuelle</button>
        <button onClick={()=>setView("label")}style={{flex:1,background:G.surface,border:`1px solid ${G.border}`,borderRadius:12,padding:"13px",color:G.cream,fontFamily:"'Jost'",fontSize:13,cursor:"pointer"}}>Photo étiquette</button>
      </div>
    </div>
  );
 
  const ViewLabel=()=>(
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{padding:"16px 16px 8px",display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
        <button onClick={()=>{stopCamera();setView("acqMode");}}style={{background:"transparent",border:"none",cursor:"pointer",padding:4}}><Icon name="back"size={22}color={G.cream}/></button>
        <div>
          <div style={{color:G.gold,fontFamily:"'Jost'",fontSize:11,letterSpacing:2,textTransform:"uppercase"}}>Acquisition</div>
          <h2 style={{color:G.cream,fontFamily:"'Cormorant Garamond'",fontSize:22,fontWeight:400,fontStyle:"italic",margin:0}}>Photo étiquette</h2>
        </div>
      </div>
 
      {/* Viewfinder — flex:1 pour remplir tout l'espace disponible */}
      <div style={{position:"relative",margin:"0 16px",borderRadius:20,overflow:"hidden",background:"#000",flex:1,minHeight:0}}>
        {captured?(
          <>
            <img src={`data:image/jpeg;base64,${captured}`}style={{width:"100%",height:"100%",objectFit:"cover"}}alt="label"/>
            {extracting&&(
              <div style={{position:"absolute",inset:0,background:"rgba(13,10,9,0.82)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16}}>
                <div style={{width:56,height:56,borderRadius:"50%",border:`2px solid ${G.gold}`,borderTopColor:"transparent",animation:"spin 1s linear infinite"}}/>
                <div style={{color:G.gold,fontFamily:"'Cormorant Garamond'",fontSize:20,fontStyle:"italic"}}>Analyse de l'étiquette…</div>
                <div style={{color:"#c0b0a0",fontFamily:"'Jost'",fontSize:13}}>Identification du vin en cours</div>
              </div>
            )}
          </>
        ):(
          <>
            <video ref={videoRef}playsInline muted style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
            <div style={{position:"absolute",inset:0,pointerEvents:"none"}}>
              <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.32)"}}/>
              <div style={{position:"absolute",top:"8%",left:"18%",right:"18%",bottom:"8%",border:`2px solid ${G.gold}88`,borderRadius:10}}/>
              <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)"}}>
                <div style={{color:G.gold,fontFamily:"'Jost'",fontSize:10,letterSpacing:2,background:"rgba(0,0,0,0.55)",padding:"4px 12px",borderRadius:20,whiteSpace:"nowrap"}}>CADREZ L'ÉTIQUETTE</div>
              </div>
            </div>
            {camError&&(
              <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.82)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12,padding:28}}>
                <Icon name="camera"size={40}color="#807060"/>
                <div style={{color:"#f0e8e0",fontFamily:"'Cormorant Garamond'",fontSize:18,fontStyle:"italic",textAlign:"center"}}>{camError}</div>
              </div>
            )}
          </>
        )}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
 
      {/* Instruction + boutons — toujours visibles en bas */}
      <div style={{flexShrink:0,padding:"10px 16px 16px"}}>
        {!captured&&!camError&&(
          <p style={{color:G.muted,fontFamily:"'Jost'",fontSize:13,textAlign:"center",margin:"0 0 10px",lineHeight:1.4}}>
            Cadrez l'étiquette dans le rectangle, puis photographiez
          </p>
        )}
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>{stopCamera();setPrefilled(false);setForm({...BLANK});setView("form");}}style={{background:G.surface,border:`1px solid ${G.border}`,borderRadius:12,padding:"13px 14px",color:G.cream,fontFamily:"'Jost'",fontSize:13,cursor:"pointer"}}>Manuel</button>
          {captured?(
            <button onClick={()=>{setCaptured(null);startCamera();}}style={{flex:1,background:G.surface,border:`1px solid ${G.border}`,borderRadius:12,padding:"13px",color:G.cream,fontFamily:"'Jost'",fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              <Icon name="refresh"size={16}color={G.cream}/>Reprendre
            </button>
          ):(
            <button onClick={captureLabel}disabled={!!camError}style={{flex:1,background:G.gold,border:"none",borderRadius:12,padding:"13px",color:"#fff",fontFamily:"'Jost'",fontSize:14,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,opacity:camError?0.4:1}}>
              <Icon name="camera"size={18}color="#fff"/>Photographier
            </button>
          )}
        </div>
      </div>
    </div>
  );
 
  const ViewForm=()=>(
    <div style={{flex:1,overflowY:"auto",padding:"0 16px 120px"}}>
      <div style={{padding:"20px 0 16px",display:"flex",alignItems:"center",gap:12}}>
        <button onClick={()=>setView(view==="edit"?"detail":"acqMode")}style={{background:"transparent",border:"none",cursor:"pointer",padding:4}}><Icon name="back"size={22}color={G.cream}/></button>
        <h2 style={{color:G.cream,fontFamily:"'Cormorant Garamond'",fontSize:24,fontWeight:400,fontStyle:"italic",margin:0}}>{view==="edit"?"Modifier":"Vérifier & Enregistrer"}</h2>
      </div>
      {prefilled&&view!=="edit"&&(
        <div style={{background:G.greenDark,border:"1px solid #a8d4bc",borderRadius:12,padding:"10px 14px",marginBottom:16,display:"flex",gap:8,alignItems:"center"}}>
          <Icon name="check"size={16}color={G.green}/>
          <span style={{color:G.green,fontFamily:"'Jost'",fontSize:13}}>Données pré-remplies — vérifiez et complétez</span>
        </div>
      )}
      <Field label="Nom de la cuvée *"field="nom"/>
      <Field label="Domaine / Château"field="domaine"/>
      <Field label="Type"field="type"opts={TYPES}/>
      <Field label="Région"field="region"opts={REGIONS}/>
      <Field label="Appellation"field="appellation"/>
      <Field label="Cépages"field="cepages"/>
      <Field label="Millésime"field="millesime"type="number"min={1800}max={2030}/>
      <Field label="Quantité"field="quantite"type="number"min={0}/>
      <Field label="Prix / bouteille (€)"field="prix"type="number"min={0}/>
      <Field label="Période de garde"field="garde"/>
      <div style={{marginBottom:14}}>
        <label style={{display:"block",color:G.muted,fontSize:11,fontFamily:"'Jost'",letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>Note</label>
        <div style={{display:"flex",gap:8}}>{[1,2,3,4,5].map(i=>(
          <button key={i}onClick={()=>setForm(p=>({...p,note:i}))}style={{background:"transparent",border:"none",cursor:"pointer",padding:4}}>
            <Icon name={i<=(form.note||3)?"star":"starE"}size={28}color={G.gold}/>
          </button>
        ))}</div>
      </div>
      <div style={{marginBottom:14}}>
        <label style={{display:"block",color:G.muted,fontSize:11,fontFamily:"'Jost'",letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>Couleur</label>
        <div style={{display:"flex",gap:10}}>
          {["#6b1520","#8b2535","#4a1528","#c8a832","#d4a843","#d4607a","#7a8fc8"].map(c=>(
            <button key={c}onClick={()=>setForm(p=>({...p,couleur:c}))}style={{width:32,height:32,borderRadius:"50%",background:c,border:form.couleur===c?`3px solid ${G.gold}`:"2px solid transparent",cursor:"pointer"}}/>
          ))}
        </div>
      </div>
      <Field label="Commentaire de dégustation"field="commentaire"type="textarea"/>
      <button onClick={saveBottle}style={{width:"100%",background:G.gold,border:"none",borderRadius:14,padding:"16px",color:"#fff",fontFamily:"'Jost'",fontSize:15,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
        <Icon name="check"size={18}color="#fff"/>{view==="edit"?"Enregistrer":"Ajouter à la cave"}
      </button>
    </div>
  );
 
  const ViewDetail=()=>{
    const b=selected;if(!b)return null;
    return(
      <div style={{flex:1,overflowY:"auto",padding:"0 0 100px"}}>
        <div style={{background:`linear-gradient(180deg,${b.couleur}22 0%,${G.bg} 100%)`,padding:"20px 16px 28px",borderBottom:`1px solid ${G.border}`}}>
          <button onClick={()=>setView("cave")}style={{background:"transparent",border:"none",cursor:"pointer",padding:4,marginBottom:12}}><Icon name="back"size={22}color="#2a1f14"/></button>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
            <div style={{flex:1}}>
              <Tag c={typeColor(b.type)}ch={b.type}/>
              <h2 style={{color:"#2a1f14",fontFamily:"'Cormorant Garamond'",fontSize:28,fontWeight:600,margin:"10px 0 4px",fontStyle:"italic",lineHeight:1.2}}>{b.nom}</h2>
              <div style={{color:G.gold,fontFamily:"'Jost'",fontSize:13}}>{b.domaine}</div>
            </div>
            {/* Photo étiquette si disponible, sinon icône wine */}
            {b.etiquette ? (
              <div style={{width:80,height:110,borderRadius:10,overflow:"hidden",flexShrink:0,border:`1px solid ${G.border}`,boxShadow:"0 4px 16px rgba(60,30,10,0.12)"}}>
                <img src={`data:image/jpeg;base64,${b.etiquette}`} alt="étiquette" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              </div>
            ) : (
              <div style={{width:64,height:64,borderRadius:14,background:`linear-gradient(135deg,${b.couleur},${b.couleur}77)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,border:`1px solid ${b.couleur}55`}}><Icon name="wine"size={30}color="rgba(255,255,255,0.65)"/></div>
            )}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginTop:12}}><Stars n={b.note}size={16}/></div>
        </div>
        <div style={{padding:"16px 16px 0"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:20}}>
            {[["Millésime",b.millesime||"NM"],["Quantité",`${b.quantite} btl`],["Prix / btl",b.prix?`${b.prix}€`:"—"]].map(([l,v])=>(
              <div key={l}style={{background:G.surface,border:`1px solid ${G.border}`,borderRadius:12,padding:"12px 10px",textAlign:"center"}}>
                <div style={{color:G.muted,fontFamily:"'Jost'",fontSize:10,letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>{l}</div>
                <div style={{color:G.cream,fontFamily:"'Cormorant Garamond'",fontSize:20,fontWeight:600}}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{background:G.surface,border:`1px solid ${G.border}`,borderRadius:16,padding:"16px",marginBottom:16}}>
            {[["Région",b.region],["Appellation",b.appellation],["Cépages",b.cepages],["Garde",b.garde||"—"]].filter(([,v])=>v).map(([k,v])=>(
              <div key={k}style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${G.border}`}}>
                <span style={{color:G.muted,fontFamily:"'Jost'",fontSize:13}}>{k}</span>
                <span style={{color:G.cream,fontFamily:"'Cormorant Garamond'",fontSize:16,fontWeight:600,textAlign:"right",maxWidth:"60%"}}>{v}</span>
              </div>
            ))}
          </div>
          {b.commentaire&&(
            <div style={{background:G.surface,border:`1px solid ${G.border}`,borderRadius:16,padding:"16px",marginBottom:16}}>
              <div style={{color:G.gold,fontFamily:"'Jost'",fontSize:11,letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>Mes notes</div>
              <p style={{color:G.cream,fontFamily:"'Cormorant Garamond'",fontSize:17,fontStyle:"italic",margin:0,lineHeight:1.6}}>"{b.commentaire}"</p>
            </div>
          )}
 
          {/* ── Prix marché ── */}
          <div style={{background:G.surface,border:`1px solid ${G.border}`,borderRadius:16,padding:"16px",marginBottom:16}}>
            <div style={{color:G.gold,fontFamily:"'Jost'",fontSize:11,letterSpacing:1,textTransform:"uppercase",marginBottom:12}}>Prix marché</div>
            {!b.prixMarche ? (
              <div style={{display:"flex",alignItems:"center",gap:10,color:G.muted,fontFamily:"'Jost'",fontSize:13}}>
                <div style={{width:16,height:16,borderRadius:"50%",border:`2px solid ${G.muted}`,borderTopColor:"transparent",animation:"spin 1s linear infinite",flexShrink:0}}/>
                Recherche en cours…
              </div>
            ) : b.prixMarche.prix_moyen ? (
              <>
                <div style={{display:"flex",alignItems:"baseline",gap:16,marginBottom:8}}>
                  <div>
                    <div style={{color:G.muted,fontFamily:"'Jost'",fontSize:10,letterSpacing:1,textTransform:"uppercase",marginBottom:2}}>Prix moyen</div>
                    <div style={{color:G.cream,fontFamily:"'Cormorant Garamond'",fontSize:28,fontWeight:600,lineHeight:1}}>
                      {b.prixMarche.prix_moyen}
                      <span style={{fontSize:16,color:G.muted}}> €</span>
                    </div>
                  </div>
                  {b.prixMarche.prix_min && b.prixMarche.prix_max && (
                    <div>
                      <div style={{color:G.muted,fontFamily:"'Jost'",fontSize:10,letterSpacing:1,textTransform:"uppercase",marginBottom:2}}>Fourchette</div>
                      <div style={{color:G.muted,fontFamily:"'Cormorant Garamond'",fontSize:16}}>
                        {b.prixMarche.prix_min}€ – {b.prixMarche.prix_max}€
                      </div>
                    </div>
                  )}
                </div>
                {/* Comparaison avec prix d'achat */}
                {b.prix > 0 && b.prixMarche.prix_moyen && (()=>{
                  const diff = Math.round(((b.prixMarche.prix_moyen - b.prix) / b.prix) * 100);
                  const positif = diff >= 0;
                  return (
                    <div style={{display:"inline-flex",alignItems:"center",gap:6,background:positif?"#e6f5ed":"#fdf0f0",border:`1px solid ${positif?"#a8d4bc":"#f0b8b8"}`,borderRadius:20,padding:"4px 12px",marginBottom:8}}>
                      <span style={{color:positif?G.green:G.red,fontFamily:"'Jost'",fontSize:12,fontWeight:500}}>
                        {positif?"▲":"▼"} {Math.abs(diff)}% {positif?"de plus-value":"en dessous du marché"}
                      </span>
                    </div>
                  );
                })()}
                {b.prixMarche.source && (
                  <div style={{color:G.muted,fontFamily:"'Jost'",fontSize:11,marginTop:4}}>
                    Source : {b.prixMarche.source}
                    {b.prixMarche.date ? ` · ${b.prixMarche.date}` : ""}
                  </div>
                )}
                <button onClick={()=>fetchMarketPrice(b)} style={{marginTop:10,background:"transparent",border:`1px solid ${G.border}`,borderRadius:8,padding:"6px 12px",color:G.muted,fontFamily:"'Jost'",fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
                  <Icon name="refresh" size={12} color={G.muted}/>Actualiser le prix
                </button>
              </>
            ) : (
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                <p style={{color:G.muted,fontFamily:"'Cormorant Garamond'",fontSize:15,fontStyle:"italic",margin:0}}>Prix introuvable pour ce vin.</p>
                <button onClick={()=>fetchMarketPrice(b)} style={{alignSelf:"flex-start",background:"transparent",border:`1px solid ${G.border}`,borderRadius:8,padding:"6px 12px",color:G.muted,fontFamily:"'Jost'",fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
                  <Icon name="refresh" size={12} color={G.muted}/>Réessayer
                </button>
              </div>
            )}
          </div>
 
          {/* ── Notes des critiques ── */}
          <div style={{background:G.surface,border:`1px solid ${G.border}`,borderRadius:16,padding:"16px",marginBottom:20}}>
            <div style={{color:G.gold,fontFamily:"'Jost'",fontSize:11,letterSpacing:1,textTransform:"uppercase",marginBottom:12}}>Notes des critiques</div>
            {!b.critiques ? (
              <div style={{display:"flex",alignItems:"center",gap:10,color:G.muted,fontFamily:"'Jost'",fontSize:13}}>
                <div style={{width:16,height:16,borderRadius:"50%",border:`2px solid ${G.muted}`,borderTopColor:"transparent",animation:"spin 1s linear infinite",flexShrink:0}}/>
                Récupération en cours…
              </div>
            ) : (
              <>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
                  {[
                    {label:"Robert Parker", key:"parker", max:100, color:"#8b2535"},
                    {label:"Wine Spectator", key:"winespectator", max:100, color:"#1a4a7a"},
                    {label:"Decanter", key:"decanter", max:100, color:"#c4607a"},
                    {label:"James Suckling", key:"suckling", max:100, color:"#2e6a3a"},
                    {label:"Bettane & Desseauve", key:"bettanedesseauve", max:20, color:"#7a5a2a"},
                  ].filter(({key})=>b.critiques[key]!==null&&b.critiques[key]!==undefined).map(({label,key,max,color})=>(
                    <div key={key} style={{background:"#fff",border:`1px solid ${G.border}`,borderRadius:10,padding:"10px 12px"}}>
                      <div style={{color:G.muted,fontFamily:"'Jost'",fontSize:10,letterSpacing:0.5,marginBottom:4}}>{label}</div>
                      <div style={{display:"flex",alignItems:"baseline",gap:3}}>
                        <span style={{color,fontFamily:"'Cormorant Garamond'",fontSize:24,fontWeight:600,lineHeight:1}}>{b.critiques[key]}</span>
                        <span style={{color:G.muted,fontFamily:"'Jost'",fontSize:11}}>/{max}</span>
                      </div>
                      {/* Barre de progression */}
                      <div style={{marginTop:6,height:3,background:G.border,borderRadius:2,overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${(b.critiques[key]/max)*100}%`,background:color,borderRadius:2}}/>
                      </div>
                    </div>
                  ))}
                </div>
                {b.critiques.resume&&(
                  <p style={{color:G.muted,fontFamily:"'Cormorant Garamond'",fontSize:15,fontStyle:"italic",margin:0,lineHeight:1.6,borderTop:`1px solid ${G.border}`,paddingTop:10}}>
                    {b.critiques.resume}
                  </p>
                )}
                {Object.entries(b.critiques).filter(([k,v])=>k!=="resume"&&v!==null).length===0&&(
                  <p style={{color:G.muted,fontFamily:"'Cormorant Garamond'",fontSize:15,fontStyle:"italic",margin:0}}>{b.critiques.resume||"Aucune note disponible pour ce vin."}</p>
                )}
                <button onClick={()=>fetchCriticRatings(b)} style={{marginTop:10,background:"transparent",border:`1px solid ${G.border}`,borderRadius:8,padding:"6px 12px",color:G.muted,fontFamily:"'Jost'",fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
                  <Icon name="refresh" size={12} color={G.muted}/>Actualiser
                </button>
              </>
            )}
          </div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>{setForm({...b});setView("edit");}}style={{flex:1,background:G.gold,border:"none",borderRadius:12,padding:"14px",color:"#fff",fontFamily:"'Jost'",fontSize:14,fontWeight:500,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              <Icon name="edit"size={16}color="#fff"/>Modifier
            </button>
            <button onClick={()=>deleteBottle(b.id)}style={{background:G.surface,border:`1px solid ${G.red}44`,borderRadius:12,padding:"14px 18px",color:G.redLight,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Icon name="trash"size={16}color={G.redLight}/>
            </button>
          </div>
        </div>
      </div>
    );
  };
 
  const ViewReco=()=>(
    <div style={{flex:1,overflowY:"auto",padding:"0 16px 100px"}}>
      <div style={{padding:"24px 0 16px",textAlign:"center"}}>
        <div style={{color:G.gold,fontFamily:"'Cormorant Garamond'",fontSize:11,letterSpacing:4,textTransform:"uppercase",marginBottom:4}}>Intelligence Artificielle</div>
        <h1 style={{color:G.cream,fontFamily:"'Cormorant Garamond'",fontSize:30,fontWeight:400,margin:0,fontStyle:"italic"}}>Votre Sommelier</h1>
        <p style={{color:G.muted,fontFamily:"'Jost'",fontSize:13,marginTop:6}}>Accords mets-vins, garde, conseils sur votre collection…</p>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
        {["Quel vin ouvrir ce soir avec un agneau rôti ?","Quels vins sont prêts à boire ?","Comment améliorer ma collection ?","Quel accord pour un plateau de fromages ?"].map(q=>(
          <button key={q}onClick={()=>setRecoQ(q)}style={{background:G.surface,border:`1px solid ${G.border}`,borderRadius:12,padding:"12px 14px",color:G.cream,fontFamily:"'Jost'",fontSize:13,textAlign:"left",cursor:"pointer"}}>✦ {q}</button>
        ))}
      </div>
      <div style={{display:"flex",gap:10,marginBottom:20}}>
        <textarea value={recoQ}onChange={e=>setRecoQ(e.target.value)}placeholder="Votre question au sommelier…"rows={2}style={{flex:1,background:G.surface,border:`1px solid ${G.border}`,borderRadius:12,color:G.cream,padding:"12px",fontFamily:"'Jost'",fontSize:14,resize:"none",outline:"none"}}/>
        <button onClick={async()=>{
          if(!recoQ.trim())return;
          setRecoLoading(true);setRecoAns("");
          const cave=bottles.map(b=>`${b.nom} (${b.type}, ${b.region}, ${b.millesime||"NM"}, note:${b.note}/5)`).join("; ");
          try{
            const d=await callClaude({model:"claude-sonnet-4-20250514",max_tokens:1000,system:`Tu es un sommelier expert. Cave: ${cave}. Réponds en français, de façon concise et élégante.`,messages:[{role:"user",content:recoQ}]});
            setRecoAns(d.content?.[0]?.text||"Erreur.");
          }catch{setRecoAns("Erreur de connexion au backend.");}
          setRecoLoading(false);
        }}disabled={recoLoading}style={{background:G.gold,border:"none",borderRadius:12,padding:"0 18px",cursor:recoLoading?"not-allowed":"pointer",opacity:recoLoading?0.6:1,flexShrink:0}}>
          {recoLoading?"…":<Icon name="sparkle"size={20}color="#fff"/>}
        </button>
      </div>
      {recoLoading&&<div style={{background:G.surface,border:`1px solid ${G.border}`,borderRadius:16,padding:"20px",textAlign:"center",color:G.muted,fontFamily:"'Cormorant Garamond'",fontSize:18,fontStyle:"italic"}}>Le sommelier réfléchit…</div>}
      {recoAns&&!recoLoading&&(
        <div style={{background:G.surface,border:`1px solid ${G.gold}44`,borderRadius:16,padding:"20px"}}>
          <div style={{color:G.gold,fontFamily:"'Jost'",fontSize:11,letterSpacing:1,textTransform:"uppercase",marginBottom:10}}>✦ Recommandation</div>
          <p style={{color:G.cream,fontFamily:"'Cormorant Garamond'",fontSize:17,lineHeight:1.7,margin:0,whiteSpace:"pre-wrap"}}>{recoAns}</p>
        </div>
      )}
    </div>
  );
 
  // ── Shell ─────────────────────────────────────────────────────────────────
  const isCamera=view==="barcode"||view==="label";
  return(
    <>
      <style>{fonts}</style>
      <style>{`*{box-sizing:border-box;margin:0;padding:0;}input,textarea,select{outline:none;}::-webkit-scrollbar{display:none;}`}</style>
      <div style={{background:G.bg,minHeight:"100vh",maxWidth:420,margin:"0 auto",display:"flex",flexDirection:"column",fontFamily:"'Jost',sans-serif"}}>
        {toast&&<div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",background:toast.type==="error"?G.red:G.gold,color:"#fff",padding:"10px 20px",borderRadius:20,fontFamily:"'Jost'",fontSize:13,fontWeight:500,zIndex:999,whiteSpace:"nowrap",boxShadow:"0 4px 20px rgba(0,0,0,0.2)"}}>{toast.msg}</div>}
        <div style={{flex:1,display:"flex",flexDirection:"column",overflowY:"auto"}}>
          {view==="cave"&&<ViewCave/>}
          {view==="detail"&&<ViewDetail/>}
          {view==="acqMode"&&<ViewAcqMode/>}
          {view==="barcode"&&<ViewBarcode/>}
          {view==="label"&&<ViewLabel/>}
          {(view==="form"||view==="edit")&&<ViewForm/>}
          {view==="reco"&&<ViewReco/>}
        </div>
        {!isCamera&&(
          <div style={{position:"sticky",bottom:0,background:"#ffffff",borderTop:"1px solid #ede5db",display:"flex",alignItems:"center",padding:"8px 0 16px",zIndex:100,boxShadow:"0 -4px 20px rgba(60,30,10,0.06)"}}>
            {[{id:"cave",icon:"cellar",label:"Cave"},{id:"acqMode",icon:"plus",label:"Ajouter",sp:true},{id:"reco",icon:"sparkle",label:"Sommelier"}].map(({id,icon,label,sp})=>(
              <button key={id}onClick={()=>setView(id)}style={{flex:1,background:sp?G.gold:"transparent",border:"none",borderRadius:sp?14:0,padding:sp?"12px 0":"10px 0",display:"flex",flexDirection:"column",alignItems:"center",gap:4,margin:sp?"0 12px":0}}>
                <Icon name={icon}size={22}color={sp?"#ffffff":view===id?G.gold:G.muted}/>
                <span style={{fontSize:10,fontFamily:"'Jost'",letterSpacing:0.5,color:sp?"#ffffff":view===id?G.gold:G.muted,fontWeight:500}}>{label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
