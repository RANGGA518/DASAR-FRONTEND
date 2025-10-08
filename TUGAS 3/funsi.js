// ================================
// fungsi.js
// Semua jenis fungsi dijadikan module
// ================================

// 1️ Declarative Function
export function sapa() {
  return "Halo Dunia dari Declarative Function!";
}

// 2️ Anonymous Function
export const kali = function (a, b) {
  return a * b;
};

// 3️ Arrow Function
export const bagi = (a, b) => {
  if (b === 0) return "Tidak bisa dibagi 0!";
  return a / b;
};

// 4️ Required Parameter
export function luasPersegi(sisi) {
  return sisi * sisi;
}

// 5️ Optional Parameter (Default Value)
export function salam(nama = "Teman") {
  return `Halo ${nama}, selamat datang!`;
}

// 6️ Rest Parameters
export function total(...angka) {
  return angka.reduce((a, b) => a + b, 0);
}

// 7️ Callback Function
export function prosesData(callback) {
  const out = document.getElementById("output");
  out.innerHTML += "<p>⏳ Sedang memproses data...</p>";

  setTimeout(() => {
    const hasil = " Data selesai diproses!";
    callback(hasil);
  }, 1500);
}

// 8️ Fungsi bantu untuk menampilkan hasil di HTML
export function tampil(teks) {
  const out = document.getElementById("output");
  out.innerHTML += `<p>${teks}</p>`;
}

// 9️ Fungsi untuk membersihkan output
export function clear() {
  document.getElementById("output").innerHTML = "";
}
