// SAMPLE DATA - fictional contacts, same in every option
window.CONTACTS=[
{n:"Amara Okafor",t:"Buyer",s:"Hot",want:"3-bed house, Riverside",bud:685000,ag:"Priya Nair",last:"2h ago",ph:"0412 555 014",em:"amara.okafor@example.com"},
{n:"Daniel & Mei Lindqvist",t:"Buyer",s:"Warm",want:"2-bed apartment, Harbour St",bud:540000,ag:"Tom Reyes",last:"Yesterday",ph:"0413 555 072",em:"lindqvist.dm@example.com"},
{n:"Harold Brennan",t:"Seller",s:"Hot",want:"Listing 14 Marlow Ave",bud:920000,ag:"Priya Nair",last:"3h ago",ph:"0421 555 188",em:"h.brennan@example.com"},
{n:"Sofia Marchetti",t:"Tenant",s:"Warm",want:"1-bed unit, near station",bud:2400,ag:"Jess Abara",last:"2 days ago",ph:"0430 555 231",em:"sofia.m@example.com"},
{n:"Kwame Mensah",t:"Landlord",s:"Cold",want:"Managing 3 rentals",bud:0,ag:"Jess Abara",last:"12 days ago",ph:"0417 555 349",em:"kwame.mensah@example.com"},
{n:"Rachel Tran",t:"Buyer",s:"Hot",want:"Townhouse, Eastfield",bud:760000,ag:"Tom Reyes",last:"Today, 9:15",ph:"0409 555 406",em:"rachel.tran@example.com"},
{n:"Patrick O'Sullivan",t:"Seller",s:"Warm",want:"Valuation for 8 Elm Court",bud:610000,ag:"Priya Nair",last:"4 days ago",ph:"0422 555 517",em:"patrick.os@example.com"},
{n:"Yuki Tanaka",t:"Tenant",s:"Cold",want:"Studio, any suburb",bud:1850,ag:"Jess Abara",last:"3 weeks ago",ph:"0418 555 620",em:"yuki.tanaka@example.com"},
{n:"Grace & Samuel Adeyemi",t:"Buyer",s:"Warm",want:"4-bed family home, Oakridge",bud:890000,ag:"Tom Reyes",last:"5 days ago",ph:"0431 555 733",em:"adeyemi.gs@example.com"},
{n:"Lucia Fernandez",t:"Landlord",s:"Warm",want:"Listing 22 Quay Road (rent)",bud:3100,ag:"Priya Nair",last:"6 days ago",ph:"0405 555 845",em:"lucia.fernandez@example.com"}
];
window.money=(c)=>c.bud?(c.t==="Tenant"||c.t==="Landlord"?"$"+c.bud.toLocaleString("en-US")+"/mo":"$"+c.bud.toLocaleString("en-US")):"—";
window.ini=(n)=>n.replace("&","").split(/\s+/).filter(Boolean).map(w=>w[0]).slice(0,2).join("");
