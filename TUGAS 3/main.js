// main.js
// Import semua fungsi dari modul
import {
  sapa,
  kali,
  bagi,
  luasPersegi,
  salam,
  total,
  prosesData,
  tampil,
  clear,
} from "./funsi.js";

// ======== EVENT SETUP ========
document.getElementById("btnDeclarative").addEventListener("click", () => {
  clear();
  tampil(sapa());
});

document.getElementById("btnAnonymous").addEventListener("click", () => {
  clear();
  tampil(`Hasil 4 × 6 = ${kali(4, 6)}`);
});

document.getElementById("btnArrow").addEventListener("click", () => {
  clear();
  tampil(`Hasil 12 ÷ 3 = ${bagi(12, 3)}`);
});

document.getElementById("btnRequired").addEventListener("click", () => {
  clear();
  tampil(`Luas persegi (sisi 5) = ${luasPersegi(5)}`);
});

document.getElementById("btnOptional").addEventListener("click", () => {
  clear();
  tampil(salam());
  tampil(salam("Firdaus"));
});

document.getElementById("btnRest").addEventListener("click", () => {
  clear();
  tampil(`Total(1,2,3,4,5) = ${total(1, 2, 3, 4, 5)}`);
});

document.getElementById("btnCallback").addEventListener("click", () => {
  clear();
  prosesData((hasil) => tampil(hasil));
});
