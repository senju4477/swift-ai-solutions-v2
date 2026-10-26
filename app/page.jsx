'use client';
import { useState } from 'react';
import { ArrowRight, Check, Phone, PhoneOff, Play, CalendarDays, FileText, Calculator, Star, MessageSquare, Settings2, ChartNoAxesColumnIncreasing } from 'lucide-react';
import CallDemo from './call-demo';
import EnquiryForm from './enquiry-form';
import ServiceIcon from './service-icons';

const industries = [
  {icon:'car',name:'Mechanics',value:'Mechanic / automotive',title:'Keep the workshop moving.',description:'Capture vehicle details, service needs and drop-off preferences while your team stays focused on the cars in front of them.'},
  {icon:'plumbing',name:'Plumbers',value:'Plumbing',title:'Stay on the tools. Stay reachable.',description:'Collect the job address, plumbing issue, urgency and access details, ready for your team to arrange the next step.'},
  {icon:'bolt',name:'Electricians',value:'Electrical',title:'A clearer start to every quote.',description:'Gather project details, property location, access and callback preferences so your team can review and quote.'},
  {icon:'cooling',name:'Air conditioning',value:'Air conditioning',title:'Handle the seasonal rush.',description:'Capture the system type, service request, location and preferred time. Your team checks coverage and availability.'},
  {icon:'building',name:'Builders',value:'Building / construction',title:'Keep enquiries organised on site.',description:'Collect project scope, location and contact details for a useful follow-up when you are off the tools.'},
  {icon:'business',name:'Other businesses',value:'Other local business',title:'A welcome that fits your business.',description:'Shape your greeting, common questions and callback process around your customers and the way you work.'},
];
const plans = [
  {id:'pilot',label:'LAUNCH PILOT',price:'A$299',intro:'For early businesses getting started.',items:['450 AI calling minutes','24/7 AI receptionist','Google Calendar integration','SMS confirmations and alerts','Call transfers to your team','No setup fee for pilot customers']},
  {id:'standard',label:'STANDARD',price:'A$349',intro:'A practical setup for everyday calls.',items:['450 AI calling minutes','All core receptionist features','Custom business setup','Dashboard access','Ongoing support','A$0.30 per additional minute'],featured:true},
  {id:'enterprise',label:'ENTERPRISE',price:'Custom',intro:'For more calls and more possibilities.',items:['Higher calling limits','Advanced integrations','Multiple locations','Priority support','Custom workflows','A setup tailored to your business']},
];
const faqs = [
  ['Can I keep my existing business phone number?','In many cases, yes. Calls can be forwarded from your current number to the receptionist. We’ll check your provider and forwarding options during setup. Your provider’s forwarding charges may apply.'],
  ['Can it book directly into my calendar?','Supported calendar connections can check availability and help manage appointments. We’ll confirm your calendar and booking rules first. Until a connection is configured, the receptionist collects a preferred time for your team to confirm. An appointment request is not a confirmed booking.'],
  ['What if a caller needs to speak to a person?','Your call flow can include a transfer to your team. If nobody is available, the receptionist can collect the details for a callback. Routing, working hours and escalation rules are agreed during onboarding.'],
  ['What happens if I use more than 450 minutes?','Standard additional AI calling minutes are A$0.30 per minute. For example, 600 minutes is A$349 + (150 × A$0.30) = A$394, before other agreed charges and taxes. Pilot overage terms are still to be confirmed.'],
  ['What setup fees, SMS charges and GST apply?','The Launch Pilot has no setup fee for pilot customers. Standard and Enterprise setup fees, SMS and telephony charges, GST treatment, billing terms, any minimum term and cancellation arrangements require written confirmation before signup. The prices and estimator do not settle those details. No payment or commitment is taken here.'],
  ['Will callers know they’re speaking with AI?','The sample greeting introduces the receptionist as AI. Your greeting and disclosure will be agreed during setup so customers know who they’re speaking with.'],
  ['Does it connect to my existing workshop software?','Software connections depend on the system you use. A practical starting point is a clear call summary your team can use in its existing workflow. We’ll confirm any direct integration before including it in your setup.'],
  ['What happens after I enquire?','This Version 2 preview prepares your enquiry for review, copying or download. It does not send it to Swift AI Solutions. Delivery needs a verified destination and authorised configuration before it can be enabled. A future demo discussion would cover your business, call flow and setup.'],
];

export default function Home() {
  const [industry,setIndustry]=useState(0);
  const [selectedPlan,setSelectedPlan]=useState('standard');
  const [selectedIndustry,setSelectedIndustry]=useState('');
  const [demoScenario,setDemoScenario]=useState('mechanic');
  const [minutes,setMinutes]=useState(600);
  const extra=Math.max(0,minutes-450);
  const estimate=(34900+extra*30)/100;
  const chooseIndustry=i=>{setIndustry(i);setSelectedIndustry(industries[i].value);};
  const activeIndustry=industries[industry];
  return <main id="main" tabIndex={-1}>
    <section className="hero" id="home">
      <img className="hero-photo" src="/images/workshop-hero-v2.webp" alt="Mechanic working on a vehicle in a bright automotive workshop — illustrative image" width="1536" height="1024" fetchPriority="high"/>
      <div className="hero-wash"/>
      <div className="wrap hero-grid">
        <div className="hero-copy"><div className="eyebrow">AI RECEPTIONIST FOR AUSTRALIAN BUSINESSES</div>
          <h1>Never miss a<br/><span>customer call</span> again.</h1>
          <p>Answer calls, capture customer and job details, and manage booking requests—even when you’re busy.</p>
          <div className="actions"><a className="button" href="#contact">Book a Demo <ArrowRight size={18}/></a><a className="button outline" href="#demo"><span className="hero-play"><Play size={10} fill="currentColor"/></span> Hear a Sample Call</a></div>
          <div className="benefits"><span><Check/> 24/7 answering</span><span><Check/> Number forwarding options</span><span><Check/> Remote setup</span></div>
        </div>
        <div className="hero-visual" aria-label="Illustrative AI call and summary; no live call or booking">
          <div className="incoming-card"><div className="incoming-heading"><img src="/images/swift-ai-solutions-logo.png" alt="" width="2048" height="682"/><div><strong>AI receptionist</strong><span>Illustrative call</span></div></div><div className="call-wave" aria-hidden="true">{Array.from({length:29},(_,i)=><i key={i} style={{height:`${9+Math.max(0,27-Math.abs(14-i)*2)+(i%3)*4}px`}}/>)}</div><div className="call-circles" aria-hidden="true"><span><PhoneOff size={18}/></span><span><Phone size={18}/></span></div></div>
          <div className="summary-card"><strong>Illustrative call summary</strong><div><ServiceIcon type="car"/><span>Logbook service</span></div><div><ServiceIcon type="calendar"/><span>Tuesday morning requested</span></div><div><ServiceIcon type="summary"/><span>Workshop to confirm</span></div></div>
        </div>
      </div>
    </section>

    <CallDemo selectedScenario={demoScenario} onScenarioChange={setDemoScenario}/>

    <section className="section industries" id="industries"><div className="wrap">
      <div className="section-heading"><span className="section-kicker">INDUSTRIES</span><h2>Built for businesses on the move.</h2><p>Help Australian tradies and local businesses turn a first call into a clear next step.</p></div>
      <div className="industry-controls" role="group" aria-label="Explore your industry">{industries.map(({icon,name},i)=><button type="button" aria-pressed={i===industry} onClick={()=>chooseIndustry(i)} key={name}><ServiceIcon type={icon}/><span>{name}</span></button>)}</div>
      <div className="industry-detail" aria-live="polite"><strong>{activeIndustry.title}</strong><span>{activeIndustry.description}</span></div>
      <div className="benefit-grid">{[['phone','Answer every enquiry','24/7 AI call handling, even while you’re busy.'],['calendar','Capture the right details','Customer information, job details and booking requests.'],['message','Keep your team informed','Summaries, SMS and human transfers when configured.']].map(([icon,title,desc])=><article className="benefit-card" key={title}><ServiceIcon type={icon}/><div><h3>{title}</h3><p>{desc}</p></div></article>)}</div>
    </div></section>

    <section className="section setup" id="how"><div className="wrap"><div className="section-heading"><span className="section-kicker">GET STARTED</span><h2>We set it up. You stay in control.</h2></div><ol className="steps">{[['Tell us about your business','Share your services, opening hours and how you work.'],['Review your call flow','We’ll shape a greeting and call flow for your approval.'],['Confirm before going live','Review sample calls and confirm your setup.']].map(([title,desc],i)=><li className="step" key={title}><span className="step-number">0{i+1}</span><div><h3>{title}</h3><p>{desc}</p></div>{i<2&&<ArrowRight className="step-arrow"/>}</li>)}</ol></div></section>

    <section className="section pricing" id="pricing"><div className="wrap"><div className="section-heading"><span className="section-kicker">PRICING</span><h2>Choose your starting point.</h2><p>A clear starting point, with the details agreed before signup.</p></div>
      <div className="price-grid">{plans.map(plan=><article className={`price-card ${plan.featured?'featured':''}`} key={plan.id} aria-label={`${plan.label} plan`}><div className="plan-top"><span>{plan.label}</span>{plan.featured?<strong className="popular"><Star size={13}/> Most Popular</strong>:plan.id==='pilot'?<span className="pilot-tag">Limited pilot programme</span>:null}</div><div className="plan-body"><h3>{plan.price}{plan.id!=='enterprise'&&<small>/month</small>}</h3><p className="plan-intro">{plan.intro}</p><ul>{plan.items.map(t=><li key={t}><Check size={17}/><span>{t}</span></li>)}</ul><a href="#contact" onClick={()=>setSelectedPlan(plan.id)} data-plan={plan.id} className={`button ${plan.featured?'':'outline'}`} aria-label={`Get Started — ${plan.label}`}>Get Started <ArrowRight size={17}/></a></div></article>)}</div>
      <div className="usage-estimator"><div className="estimator-heading"><Calculator/><div><h3>Standard usage estimator</h3><p>450 minutes included · A$0.30 per additional minute</p></div></div><div className="estimator-controls"><div className="range-label"><label htmlFor="monthly-minutes">Monthly AI calling minutes</label><div className="minutes-input"><input id="monthly-minutes-number" aria-label="Monthly AI calling minutes, enter a number" type="number" min="0" max="1500" step="1" value={minutes} onChange={e=>setMinutes(Math.min(1500,Math.max(0,Number(e.target.value))))}/><span>min</span></div></div><input id="monthly-minutes" type="range" min="0" max="1500" step="1" value={minutes} onChange={e=>setMinutes(Number(e.target.value))} aria-valuetext={`${minutes} minutes, A$${estimate.toFixed(2)} before other agreed charges and taxes`}/><div className="range-extremes"><span>0</span><span>1,500</span></div></div><div className="estimate-total" aria-live="polite"><output htmlFor="monthly-minutes monthly-minutes-number">A${estimate.toFixed(2)}</output><span>/month*</span><small>{extra?`A$349 + ${extra} × A$0.30`:'Within the included 450 minutes'}</small></div><p className="estimator-note">*Plan and AI calling minutes only. Other agreed charges and taxes excluded.</p></div>
      <p className="pricing-terms">All prices in AUD. No setup fee for pilot customers. Standard/Enterprise setup fees, pilot overages, SMS, telephony and GST treatment require confirmation before signup. <a href="/service-information/">Service information</a></p>
    </div></section>

    <section className="section faq" id="faq"><div className="wrap"><div className="section-heading"><span className="section-kicker">FAQS</span><h2>Common questions.</h2></div><div className="faq-list">{faqs.map(([q,a],i)=><details key={q} className="faq-item"><summary id={`faq-question-${i}`}>{q}<ArrowRight size={17}/></summary><div><p>{a}</p></div></details>)}</div></div></section>

    <section className="section contact" id="contact"><div className="wrap contact-grid"><div className="contact-copy"><span className="section-kicker">GET IN TOUCH</span><h2>Your next customer is calling.<br/>Let’s be ready.</h2><p>Tell us about your business and the calls you need help with.</p><ul>{[[MessageSquare,'Discuss your call flow'],[Settings2,'Explore your integrations'],[ChartNoAxesColumnIncreasing,'Choose your next step']].map(([Icon,t])=><li key={t}><span><Icon size={24}/></span>{t}</li>)}</ul></div><EnquiryForm selectedPlan={selectedPlan} onPlanChange={setSelectedPlan} selectedIndustry={selectedIndustry} onIndustryChange={setSelectedIndustry}/></div></section>
  </main>;
}
