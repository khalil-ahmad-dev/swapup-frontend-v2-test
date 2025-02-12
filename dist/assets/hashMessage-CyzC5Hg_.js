import{bd as e,be as o,bf as a,o as i}from"./index-muOLQR3e.js";const c=`Ethereum Signed Message:
`;function u(t,n){const r=typeof t=="string"?e(t):t.raw instanceof Uint8Array?t.raw:o(t.raw),s=e(`${c}${r.length}`);return a(i([s,r]),n)}export{u as hashMessage};
