let biayaJarak = {};
const biayaBerat = [
  { min: 0, max: 1, biaya: 1500 },
  { min: 1.1, max: 5, biaya: 2500 },
  { min: 5.1, max: 10, biaya: 3500 },
  { min: 10.1, max: Infinity, biaya: 4500 }
];

document.addEventListener("DOMContentLoaded", () => {
  loadDataXML();
});

function loadDataXML() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "dataKota.xml", true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      const xmlDoc = xhr.responseXML;
      const kotaNodes = xmlDoc.getElementsByTagName("kota");

      // ubah XML ke object JS
      for (let i = 0; i < kotaNodes.length; i++) {
        const namaKota = kotaNodes[i].getAttribute("nama");
        biayaJarak[namaKota] = {};

        const tujuanNodes = kotaNodes[i].getElementsByTagName("tujuan");
        for (let j = 0; j < tujuanNodes.length; j++) {
          const tujuanNama = tujuanNodes[j].getAttribute("nama");
          const biaya = parseInt(tujuanNodes[j].getAttribute("biaya"));
          biayaJarak[namaKota][tujuanNama] = biaya;
        }
      }

      inisialisasiDropdown();
    }
  };
  xhr.send();
}

function inisialisasiDropdown() {
  const asalSelect = document.getElementById("asal");
  const tujuanSelect = document.getElementById("tujuan");

  asalSelect.innerHTML = '<option value="">--- Pilih Kota Asal ---</option>';
  tujuanSelect.innerHTML = '<option>--- Pilih Kota Asal Dahulu ---</option>';

  Object.keys(biayaJarak).forEach(kota => {
    const opt = document.createElement("option");
    opt.value = kota;
    opt.textContent = kota;
    asalSelect.appendChild(opt);
  });
}

function updateTujuan() {
  const asal = document.getElementById("asal").value;
  const tujuanSelect = document.getElementById("tujuan");
  tujuanSelect.innerHTML = "";

  if (asal) {
    const defaultOpt = document.createElement("option");
    defaultOpt.textContent = "--- Pilih Kota Tujuan ---";
    tujuanSelect.appendChild(defaultOpt);

    Object.keys(biayaJarak[asal]).forEach(kota => {
      const opt = document.createElement("option");
      opt.value = kota;
      opt.textContent = kota;
      tujuanSelect.appendChild(opt);
    });
  } else {
    const opt = document.createElement("option");
    opt.textContent = "--- Pilih Kota Asal Dahulu ---";
    tujuanSelect.appendChild(opt);
  }

  hitungBiaya();
}

function hitungBiaya() {
  const asal = document.getElementById("asal").value;
  const tujuan = document.getElementById("tujuan").value;
  const berat = parseFloat(document.getElementById("berat").value);
  const totalInput = document.getElementById("total");

  if (!asal || !tujuan || !berat) {
    totalInput.value = "Rp 0";
    return;
  }

  let biayaBrt = 0;
  for (const b of biayaBerat) {
    if (berat >= b.min && berat <= b.max) {
      biayaBrt = b.biaya;
      break;
    }
  }

  const biayaJrk = biayaJarak[asal][tujuan];
  const total = biayaBrt + biayaJrk;
  totalInput.value = `Rp ${total.toLocaleString("id-ID")}`;
}
