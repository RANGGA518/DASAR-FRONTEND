// === Data barang per kategori ===
const barangData = {
  PC: [
    { nama: "PC IBM Core i7", harga: 5600000 },
    { nama: "Laptop ASUS Core i5", harga: 4500000 },
    { nama: "Laptop Lenovo AMD Ryzen 5", harga: 9500000 },
  ],
  AKS: [
    { nama: "Flashdisk 32 GB", harga: 50000 },
    { nama: "Harddisk 256 GB", harga: 1250000 },
    { nama: "Speaker Aktif", harga: 255000 },
  ],
  PRT: [
    { nama: "ACER", harga: 1500000 },
    { nama: "TOSHIBA", harga: 1250000 },
    { nama: "LENOVO", harga: 3000000},
  ],
};

// === Ambil elemen ===
const kategoriSelect = document.getElementById("kategori");
const namaInput = document.getElementById("nama-brg");
const hargaInput = document.getElementById("harga-brg");
const jumlahInput = document.getElementById("jumlah-brg");
const totalPenjualan = document.getElementById("ttl-jual");
const diskonInput = document.getElementById("diskon");
const pajakInput = document.getElementById("pajak");
const hargaTotalInput = document.getElementById("harga-total");
const jualInput = document.getElementById("jual");

// Popup Barang
const popupOverlay = document.getElementById("popup-overlay");
const popupItems = document.getElementById("popup-items");
const okBtn = document.getElementById("okBtn");
const cancelBtn = document.getElementById("cancelBtn");

// Popup Jenis Penjualan
const popupJual = document.getElementById("popup-jual");
const okJual = document.getElementById("okJual");
const cancelJual = document.getElementById("cancelJual");

let totalSementara = 0;

// === Event: Klik nama barang buka popup ===
namaInput.addEventListener("click", function () {
  const kategori = kategoriSelect.value;
  if (!kategori) {
    alert("Silakan pilih kategori terlebih dahulu!");
    return;
  }
  tampilkanBarang(kategori);
  popupOverlay.style.display = "flex";
});

// === Event: Klik jenis penjualan buka popup ===
jualInput.addEventListener("click", function () {
  if (!hargaInput.value || !jumlahInput.value) {
    alert("Lengkapi data barang dan jumlah terlebih dahulu!");
    return;
  }
  popupJual.style.display = "flex";
});

// === Update kategori ===
function updateKategori() {
  const kategori = kategoriSelect.value;
  if (kategori === "") {
    namaInput.disabled = true;
    namaInput.placeholder = "Pilih kategori dulu...";
    namaInput.value = "";
    hargaInput.value = "";
  } else {
    namaInput.disabled = false;
    namaInput.placeholder = "Klik untuk pilih barang...";
  }
}

// === Tampilkan barang sesuai kategori ===
function tampilkanBarang(kategori) {
  popupItems.innerHTML = "";
  const listBarang = barangData[kategori];
  listBarang.forEach((item) => {
    const label = document.createElement("label");
    label.classList.add("radio-item");
    label.innerHTML = `
      <input type="radio" name="barang" value="${item.nama}" data-harga="${item.harga}">
      <span class="radio-text">${item.nama} - Rp. ${item.harga.toLocaleString("id-ID")}</span>
    `;
    popupItems.appendChild(label);
  });
}

// === Tombol OK barang ===
okBtn.addEventListener("click", function () {
  const selected = document.querySelector('input[name="barang"]:checked');
  if (selected) {
    const nama = selected.value;
    const harga = parseInt(selected.getAttribute("data-harga"));
    namaInput.value = nama;
    hargaInput.value = harga.toLocaleString("id-ID");
    popupOverlay.style.display = "none";
  } else {
    alert("Silakan pilih salah satu barang!");
  }
});

// === Tombol batal barang ===
cancelBtn.addEventListener("click", function () {
  popupOverlay.style.display = "none";
});

// === Tombol OK jenis penjualan ===
okJual.addEventListener("click", function () {
  const selected = popupJual.querySelector('input[name="jenis"]:checked');
  if (!selected) {
    alert("Silakan pilih jenis penjualan!");
    return;
  }

  jualInput.value = selected.value;
  popupJual.style.display = "none";

  // Ambil harga & jumlah
  const harga = parseInt(hargaInput.value.replace(/\./g, "")) || 0;
  const jumlah = Number(jumlahInput.value) || 0;

  if (harga <= 0 || jumlah <= 0) {
    alert("Masukkan harga dan jumlah yang valid!");
    return;
  }

  // Hitung total penjualan awal
  totalSementara = harga * jumlah;
  totalPenjualan.value = totalSementara.toLocaleString("id-ID");

  // Hitung pajak
  const kategori = kategoriSelect.value;
  let pajak = 0;
  if (kategori === "PC") pajak = totalSementara * 0.15;
  else if (kategori === "AKS") pajak = totalSementara * 0.1;

  // Total setelah pajak
  const totalSetelahPajak = totalSementara + pajak;

  // Diskon 10% jika Tunai (hitung setelah pajak)
  let diskon = 0;
  if (selected.value === "Tunai") diskon = totalSementara * 0.1;

  // Harga total akhir
  const hargaTotal = totalSetelahPajak - diskon;

  // Tampilkan hasil
  pajakInput.value = pajak.toLocaleString("id-ID");
  diskonInput.value = diskon.toLocaleString("id-ID");
  hargaTotalInput.value = hargaTotal.toLocaleString("id-ID");
});

// === Tombol batal jual ===
cancelJual.addEventListener("click", function () {
  popupJual.style.display = "none";
});
