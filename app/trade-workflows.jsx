import { ArrowRight, Check, Play } from 'lucide-react';
import ServiceIcon from './service-icons';

const trades = [
  {id:'automotive',icon:'car',name:'Automotive workshops',line:'More time in the workshop.',description:'Give service and repair enquiries a helpful first response while your team works on the vehicles already booked in.',details:['Vehicle make and model','Service or repair request','Preferred day and callback details'],handover:'Your workshop confirms availability and any booking.',industry:'Mechanic / automotive',sample:'mechanic',sampleLabel:'Hear the workshop example'},
  {id:'plumbing',icon:'plumbing',name:'Plumbing businesses',line:'Keep the next job within reach.',description:'Capture useful job details between site visits, so you can return a call with the information you need.',details:['Job type and suburb','What the caller needs help with','Callback number and preferred time'],handover:'Your team reviews the request and arranges a visit.',industry:'Plumbing',sample:'plumber',sampleLabel:'Hear the plumbing example'},
  {id:'electrical',icon:'bolt',name:'Electrical businesses',line:'A clearer start to every quote.',description:'Turn a general enquiry into an organised quote request, ready for a conversation when you’re off the tools.',details:['Installation or maintenance request','Property location','Project details and callback number'],handover:'Your electrician confirms scope, timing and pricing.',industry:'Electrical',sample:'electrician',sampleLabel:'Hear the electrical example'},
  {id:'air-conditioning',icon:'cooling',name:'Air conditioning teams',line:'Handle the seasonal rush.',description:'Keep service and installation requests organised when the weather brings a busy run of calls.',details:['System type and service needed','Property location','Preferred visit time and contact details'],handover:'Your team checks service coverage and availability.',industry:'Air conditioning'},
];

export default function TradeWorkflows({onSample,onEnquire}) {
  return <section className="section trade-section" id="trade-workflows"><div className="wrap">
    <div className="section-heading"><span className="section-kicker">THE RIGHT DETAILS FOR YOUR TRADE</span><h2>Different businesses.<br/>A helpful first hello.</h2><p className="section-sub">Call flows shaped around the enquiries you receive and the way your team follows up.</p></div>
    <div className="trade-grid">{trades.map(trade=><article className="trade-card" id={`for-${trade.id}`} key={trade.id}>
      <div className="trade-heading"><ServiceIcon type={trade.icon}/><div><span>{trade.name}</span><h3>{trade.line}</h3></div></div>
      <p>{trade.description}</p><div className="trade-capture"><span className="mini-label">DETAILS TO CAPTURE</span><ul>{trade.details.map(detail=><li key={detail}><Check size={14}/>{detail}</li>)}</ul></div>
      <div className="trade-handover"><ServiceIcon type="summary"/><p><strong>A useful next step</strong>{trade.handover}</p></div>
      <div className="trade-actions">{trade.sample&&<a className="text-link" href="#demo" onClick={()=>onSample(trade.sample)}><Play size={13}/>{trade.sampleLabel}</a>}<a className="text-link" href="#contact" onClick={()=>onEnquire(trade.industry)} aria-label={`Enquire about Swift AI for ${trade.name.toLowerCase()}`}>Discuss your setup <ArrowRight size={14}/></a></div>
    </article>)}</div>
    <p className="trade-note">Example workflows. Your team’s service area, booking rules and escalation process are agreed during setup.</p>
  </div></section>;
}
